import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const MAX_IMAGE_SIZE_MB = 30;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const validTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const EditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    data: storyData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/stories/${id}`);
      return res.data;
    },
    enabled: !!id,
    onError: () => {
      Swal.fire("Error", "Failed to load story data.", "error");
      navigate("/dashboard/stories/manage");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: storyData
      ? {
          title: storyData.title || "",
          content: storyData.content || "",
        }
      : undefined,
    mode: "onChange",
  });

  useEffect(() => {
    if (storyData?.images) {
      setExistingImages(storyData.images);
    }
  }, [storyData]);

  const updateStoryMutation = useMutation({
    mutationFn: (updatedData) => axiosSecure.put(`/stories/${id}`, updatedData),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Story Updated!",
        text: "Your story has been successfully updated.",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      queryClient.invalidateQueries({ queryKey: ["story", id] });
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      navigate("/dashboard/stories/manage");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update story. Please try again.", "error");
    },
  });

  const handleNewImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const invalidFiles = files.filter(
      (file) =>
        !validTypes.includes(file.type) || file.size > MAX_IMAGE_SIZE_BYTES
    );
    if (invalidFiles.length > 0) {
      Swal.fire(
        "Invalid Files",
        `Each image must be a valid format (JPEG, PNG, etc.) and under ${MAX_IMAGE_SIZE_MB}MB.`,
        "warning"
      );
      return;
    }
    if (files.length === 0) return;

    setIsUploadingImage(true);
    try {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const res = await axiosPublic.post(
            `https://api.imgbb.com/1/upload?key=${
              import.meta.env.VITE_imgbb_key
            }`,
            formData
          );
          return { url: res.data.data.url, file };
        })
      );

      setNewImages((prev) => [...prev, ...uploadResults.map((r) => r.url)]);
      setNewImagePreviews((prev) => [
        ...prev,
        ...uploadResults.map((item) => ({
          id: Date.now() + Math.random(),
          url: item.url,
          file: item.file,
        })),
      ]);
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire("Error", "Failed to upload images. Please try again.", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeExistingImage = (url) => {
    setImagesToRemove((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    if (existingImages.length + newImages.length === 0) {
      Swal.fire(
        "Validation Error",
        "Your story must have at least one image.",
        "warning"
      );
      return;
    }

    updateStoryMutation.mutate({
      title: data.title.trim(),
      content: data.content.trim(),
      imagesToRemove,
      imagesToAdd: newImages,
    });
  };

  if (isPending) return <p>Loading story...</p>;
  if (isError) return <p>Error loading story.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-emerald-800">Edit Story</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg p-6 shadow-lg space-y-6"
      >
        {/* Title */}
        <div>
          <label
            className="label font-semibold text-emerald-800"
            htmlFor="title"
          >
            Story Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "At least 3 characters" },
              maxLength: { value: 100, message: "Max 100 characters" },
            })}
            className={`input input-bordered w-full ${
              errors.title ? "input-error" : "focus:border-emerald-500"
            }`}
            placeholder="Enter story title"
          />
          {errors.title && (
            <p className="text-error mt-1">{errors.title.message}</p>
          )}
        </div>
        {/* Content */}
        <div>
          <label
            className="label font-semibold text-emerald-800"
            htmlFor="content"
          >
            Story Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            {...register("content", {
              required: "Content is required",
              minLength: { value: 10, message: "At least 10 characters" },
              maxLength: { value: 5000, message: "Max 5000 characters" },
            })}
            className={`textarea textarea-bordered w-full h-48 resize-none ${
              errors.content ? "textarea-error" : "focus:border-emerald-500"
            }`}
            placeholder="Share your travel experience..."
          />
          {errors.content && (
            <p className="text-error mt-1">{errors.content.message}</p>
          )}
        </div>
        <div>
          <label className="label font-semibold text-emerald-800">
            Existing Images ({existingImages.length})
          </label>
          {existingImages.length === 0 && (
            <p className="text-sm text-gray-600 mb-2">No existing images.</p>
          )}
          <div className="grid grid-cols-3 gap-4">
            {existingImages.map((url) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt="Existing"
                  className="w-full h-24 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute top-1 right-1 btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        }
        <div>
          <label className="label font-semibold text-emerald-800">
            Upload New Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleNewImageUpload}
            className="file-input file-input-bordered file-input-success w-full max-w-xs"
          />
          {isUploadingImage && (
            <p className="text-sm text-emerald-600 mt-2">Uploading images...</p>
          )}
          {newImagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {newImagePreviews.map((preview, index) => (
                <div key={preview.id} className="relative group">
                  <img
                    src={preview.url}
                    alt={`New upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="btn btn-success"
            disabled={
              updateStoryMutation.status === "pending" || isUploadingImage
            }
          >
            {updateStoryMutation.status === "pending" ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>{" "}
                Updating...
              </>
            ) : (
              "Update Story"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStory;
