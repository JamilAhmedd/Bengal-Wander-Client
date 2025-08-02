import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../../AuthProvider/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const AddStory = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_IMAGE_SIZE_MB = 30;
  const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      images: [],
    },
    mode: "onChange",
  });

  const watchedTitle = watch("title", "");
  const watchedContent = watch("content", "");

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    const invalidFiles = files.filter(
      (file) =>
        !validTypes.includes(file.type) || file.size > MAX_IMAGE_SIZE_BYTES
    );
    if (invalidFiles.length > 0) {
      alert(
        `Each image must be a valid format (JPEG, PNG, etc.) and under ${MAX_IMAGE_SIZE_MB}MB.`
      );
      return;
    }

    if (files.length === 0) return;

    setIsUploadingImage(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await axiosPublic.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_imgbb_key
          }`,
          formData
        );

        return {
          url: res.data.data.url,
          file,
        };
      });

      const uploadResults = await Promise.all(uploadPromises);

      const newPreviews = uploadResults.map((item) => ({
        id: Date.now() + Math.random(),
        url: item.url,
        file: item.file,
      }));

      setUploadedUrls((prev) => [...prev, ...uploadResults.map((r) => r.url)]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      const newImages = [...images, ...files];
      setImages(newImages);
      setValue("images", newImages);
      clearErrors("images");
    } catch (error) {
      console.error("Image upload failed:", error);
      setImages([]);
      setImagePreviews([]);
      setValue("images", []);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    const newPreviews = imagePreviews.filter(
      (_, index) => index !== indexToRemove
    );

    setImages(newImages);
    setImagePreviews(newPreviews);
    setValue("images", newImages);

    if (newImages.length === 0) {
      setValue("images", []);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const imageUrls = uploadedUrls;

      const storyData = {
        title: data.title.trim(),
        content: data.content.trim(),
        images: imageUrls,
        authorEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
      };

      try {
        const response = await axiosSecure.post("/stories", storyData);

        Swal.fire({
          icon: "success",
          title: "Story Published!",
          text: "Your story has been successfully added.",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });

        navigate("/dashboard/stories/manage");
        reset();
        setImages([]);
        setImagePreviews([]);
        setUploadedUrls([]);
      } catch (error) {
        console.error("Error saving story:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Publish",
          text: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error saving story:", error);
      alert("Failed to save story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
    ) {
      reset();
      setImages([]);
      setImagePreviews([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-emerald-800">
          Add New Story
        </h2>
        <button
          className="btn btn-outline btn-success"
          onClick={() => {
            navigate("/dashboard/stories/manage");
          }}
        >
          View My Stories
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Story Title <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "Title cannot exceed 100 characters",
                },
              })}
              placeholder="Enter an engaging title for your story..."
              className={`input input-bordered w-full ${
                errors.title ? "input-error" : "focus:border-emerald-500"
              }`}
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.title.message}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                {watchedTitle.length}/100 characters
              </span>
            </label>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Story Content <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea
              {...register("content", {
                required: "Story content is required",
                minLength: {
                  value: 10,
                  message: "Story content must be at least 10 characters long",
                },
                maxLength: {
                  value: 5000,
                  message: "Story content cannot exceed 5000 characters",
                },
              })}
              placeholder="Share your amazing travel experience, tips, or memorable moments..."
              className={`textarea textarea-bordered w-full h-48 resize-none ${
                errors.content ? "textarea-error" : "focus:border-emerald-500"
              }`}
            />
            {errors.content && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.content.message}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                {watchedContent.length}/5000 characters
              </span>
            </label>
          </div>

          {/* Image Upload - Required */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Upload Images <span className="text-red-500">*</span>
              </span>
            </label>
            <Controller
              name="images"
              control={control}
              rules={{
                required: "At least one image is required",
                validate: {
                  notEmpty: (value) =>
                    value.length > 0 || "Please select at least one image",
                },
              }}
              render={({ field }) => (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    errors.images
                      ? "border-red-300 bg-red-50"
                      : "border-emerald-300 hover:border-emerald-500"
                  }`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div
                      className={`text-4xl mb-2 ${
                        errors.images ? "text-red-400" : "text-emerald-400"
                      }`}
                    ></div>
                    <p
                      className={`font-medium mb-1 ${
                        errors.images ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      Click to upload images
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Valid types: JPG, JPEG, PNG, GIF, WebP
                    </p>
                    <p className="text-sm text-gray-500">
                      Max file size: 30MB each
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      * At least one image is required
                    </p>
                  </label>
                </div>
              )}
            />

            {errors.images && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.images.message}
                </span>
              </label>
            )}
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div>
              <label className="label">
                <span className="label-text font-semibold text-emerald-800">
                  Selected Images ({imagePreviews.length})
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={preview.id} className="relative group">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isUploadingImage}
            >
              {isUploadingImage && (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                </>
              )}
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving Story...
                </>
              ) : (
                "Publish Story"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-6">
        <h3 className="font-semibold text-emerald-800 mb-3">
          💡 Story Writing Tips
        </h3>
        <ul className="space-y-2 text-sm text-emerald-700">
          <li>• Make your title catchy and descriptive</li>
          <li>• Share personal experiences and emotions</li>
          <li>• Include practical tips that others can use</li>
          <li>• Add high-quality images to make your story more engaging</li>
          <li>
            • Keep your content authentic and helpful for fellow travelers
          </li>
          <li>
            • <strong>At least one image is required</strong> to publish your
            story
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddStory;
