import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
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

const AddPackage = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      packageName: "",
      gallery: [],
      aboutTour: "",
      tourPlan: [{ day: "", activities: "" }],
      price: "",
      duration: "",
      location: "",
    },
  });

  const {
    fields: planFields,
    append: appendPlan,
    remove: removePlan,
  } = useFieldArray({
    control,
    name: "tourPlan",
  });


  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    const invalidFiles = files.filter(
      (file) =>
        !validTypes.includes(file.type) || file.size > MAX_IMAGE_SIZE_BYTES
    );
    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid File",
        text: `Each image must be JPG, PNG, GIF, or WebP format and under ${MAX_IMAGE_SIZE_MB}MB.`,
      });
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
        return res.data.data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      const newPreviews = newUrls.map((url) => ({
        url,
        id: Date.now() + Math.random(),
      }));

      setUploadedUrls((prev) => {
        const updatedUrls = [...prev, ...newUrls];
        setValue("gallery", updatedUrls, { shouldValidate: true });
        return updatedUrls;
      });
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error("Image upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload images. Please try again.",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newUrls = [...uploadedUrls];
    newPreviews.splice(index, 1);
    newUrls.splice(index, 1);
    setImagePreviews(newPreviews);
    setUploadedUrls(newUrls);
    setValue("gallery", newUrls, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    if (uploadedUrls.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Gallery Required",
        text: "Please upload at least one image.",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const filteredTourPlan = data.tourPlan.filter(
        (plan) => plan.day.trim() !== "" && plan.activities.trim() !== ""
      );

      if (filteredTourPlan.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Tour Plan Required",
          text: "Please add at least one day to the tour plan.",
        });
        setIsSubmitting(false);
        return;
      }

      const packageData = {
        packageName: data.packageName.trim(),
        gallery: uploadedUrls,
        aboutTour: data.aboutTour.trim(),
        tourPlan: filteredTourPlan,
        price: parseFloat(data.price),
        duration: data.duration.trim(),
        location: data.location.trim(),
        createdAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post("/trips", packageData);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Package Added Successfully!",
          text: "The tour package has been added.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate("/dashboard/manage-profile");
      }
    } catch (error) {
      console.error("Error adding package:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Add Package",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-white shadow-2xl">
          <div className="card-body p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Create New Package
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/*************************************************** Package Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text mr-4 text-lg font-semibold">
                    Package Name:
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter package name"
                  className={`input input-bordered input-lg ${
                    errors.packageName ? "input-error" : "focus:input-primary"
                  }`}
                  {...register("packageName", {
                    required: "Package name is required",
                    minLength: {
                      value: 3,
                      message: "Package name must be at least 3 characters",
                    },
                  })}
                />
                {errors.packageName && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.packageName.message}
                    </span>
                  </label>
                )}
              </div>

              {/*********************************************** Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text mb-2 text-lg font-semibold">
                    Gallery Images:
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered file-input-success w-full"
                />
                {isUploadingImage && (
                  <p className="text-sm text-emerald-600 mt-2">
                    Uploading images...
                  </p>
                )}
                {errors.gallery && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.gallery.message}
                    </span>
                  </label>
                )}

                {/**************************************************** Preview thumbnails */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, idx) => (
                      <div key={preview.id} className="relative group">
                        <img
                          src={preview.url}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="btn btn-sm btn-circle btn-error absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-4">
                <label className="label">
                  <span className="label-text text-lg font-semibold">
                    About The Tour:
                  </span>
                </label>
                <textarea
                  placeholder="Describe the tour"
                  className={`textarea focus:border-gray-400/30 focus:outline-none textarea-lg h-32 ${
                    errors.aboutTour
                      ? "textarea-error"
                      : "focus:textarea-primary"
                  }`}
                  {...register("aboutTour", {
                    required: "About tour is required",
                    minLength: {
                      value: 50,
                      message: "Description must be at least 50 characters",
                    },
                  })}
                />
                {errors.aboutTour && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.aboutTour.message}
                    </span>
                  </label>
                )}
              </div>

              {/********8*** Tour Plan ***************************/}
              <div className="card bg-green-50 border border-teal-200 p-4 rounded-lg">
                <h3 className="text-teal-900 font-semibold mb-4">
                  Tour Planning
                </h3>
                {planFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="bg-white border border-teal-200 rounded p-4 mb-4 relative"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Day {idx + 1}</h4>
                      {planFields.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => removePlan(idx)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Day title (e.g., Day 1: Arrival)"
                      className={`input input-bordered w-full mb-2 ${
                        errors.tourPlan?.[idx]?.day ? "input-error" : ""
                      }`}
                      {...register(`tourPlan.${idx}.day`, {
                        required: "Day title is required",
                      })}
                    />
                    <input
                      type="text"
                      placeholder="Activities for this day"
                      className={`input input-bordered w-full ${
                        errors.tourPlan?.[idx]?.activities ? "input-error" : ""
                      }`}
                      {...register(`tourPlan.${idx}.activities`, {
                        required: "Activities description is required",
                      })}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline btn-success"
                  onClick={() => appendPlan({ day: "", activities: "" })}
                >
                  Add Another Day
                </button>
              </div>

              {/* Price, Duration, Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label font-semibold">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    className={`input input-bordered ${
                      errors.price ? "input-error" : ""
                    }`}
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 1, message: "Price must be positive" },
                    })}
                  />
                  {errors.price && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.price.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label font-semibold">Duration</label>
                  <input
                    type="text"
                    placeholder="Duration (e.g. 4 Days, 3 Nights)"
                    className={`input input-bordered ${
                      errors.duration ? "input-error" : ""
                    }`}
                    {...register("duration", {
                      required: "Duration is required",
                    })}
                  />
                  {errors.duration && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.duration.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label font-semibold">Location</label>
                  <input
                    type="text"
                    placeholder="Location"
                    className={`input input-bordered ${
                      errors.location ? "input-error" : ""
                    }`}
                    {...register("location", {
                      required: "Location is required",
                    })}
                  />
                  {errors.location && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.location.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-success btn-lg w-full"
                disabled={isSubmitting || isUploadingImage}
              >
                {isSubmitting
                  ? "Creating Package..."
                  : isUploadingImage
                  ? "Uploading Images..."
                  : "Create Package"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
