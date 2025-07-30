import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../../AuthProvider/useAuth";

// Mock useAuth hook for demo

const JoinTourGuide = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      applicationTitle: "",
      reason: "",
      cvLink: "",
    },
    mode: "onChange",
  });

  const watchedTitle = watch("applicationTitle", "");
  const watchedReason = watch("reason", "");
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const applicationData = {
        applicationTitle: data.applicationTitle.trim(),
        reason: data.reason.trim(),
        cvLink: data.cvLink.trim(),
        applicantEmail: user.email,
        applicantName: user.displayName,
        appliedAt: new Date().toISOString(),
        status: "pending",
      };

      const response = await axiosSecure.post(
        "/tour-guide-application",
        applicationData
      );

      if (response.data.insertedId) {
        Swal.fire({
          title: "Application Submitted!",
          text: "Your tour guide application has been received. We'll review it soon.",
          icon: "success",
          confirmButtonText: "Back to Dashboard",
          confirmButtonColor: "#10B981", // Tailwind emerald-500
        }).then(() => {
          navigate("/dashboard");
        });

        reset(); // clear form
      } else {
        throw new Error("No insertedId returned");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      Swal.fire({
        title: "Submission Failed",
        text:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-emerald-800 mb-2">
          Join Our Tour Guide Team
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Share your passion for travel and local knowledge with fellow
          adventurers. Become a certified tour guide and help create
          unforgettable experiences.
        </p>
      </div>

      {/********************* Application Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-emerald-800 mb-6">
          Tour Guide Application Form
        </h3>

        <div className="space-y-6">
          <div>
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Application Title <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              {...register("applicationTitle", {
                required: "Application title is required",
                minLength: {
                  value: 10,
                  message:
                    "Application title must be at least 10 characters long",
                },
                maxLength: {
                  value: 100,
                  message: "Application title cannot exceed 100 characters",
                },
              })}
              placeholder="e.g., Experienced Local Guide for Mountain Adventures"
              className={`input input-bordered w-full ${
                errors.applicationTitle
                  ? "input-error"
                  : "focus:border-emerald-500"
              }`}
            />
            {errors.applicationTitle && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.applicationTitle.message}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                {watchedTitle.length}/100 characters
              </span>
            </label>
          </div>

          {/***** / Why Tour Guide *****/}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                Why do you want to be a Tour Guide?{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea
              {...register("reason", {
                required: "Please tell us why you want to be a tour guide",
                minLength: {
                  value: 50,
                  message:
                    "Please provide at least 50 characters explaining your motivation",
                },
                maxLength: {
                  value: 1000,
                  message: "Response cannot exceed 1000 characters",
                },
              })}
              placeholder="Share your passion for travel, local knowledge, experience with tourists, language skills, and what makes you a great guide..."
              className={`textarea textarea-bordered w-full h-32 resize-none ${
                errors.reason ? "textarea-error" : "focus:border-emerald-500"
              }`}
            />
            {errors.reason && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.reason.message}
                </span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-gray-500">
                {watchedReason.length}/1000 characters
              </span>
            </label>
          </div>

          {/*** CV Link  ***/}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-emerald-800">
                CV/Resume Link <span className="text-red-500">*</span>
              </span>
            </label>
            <input
              type="url"
              {...register("cvLink", {
                required: "CV link is required",
              })}
              placeholder="https://drive.google.com/file/d/your-cv-link"
              className={`input input-bordered w-full ${
                errors.cvLink ? "input-error" : "focus:border-emerald-500"
              }`}
            />
            {errors.cvLink && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.cvLink.message}
                </span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to cancel? All form data will be lost."
                  )
                ) {
                  reset();
                  navigate("/dashboard");
                }
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-emerald-50 rounded-lg p-6">
        <h3 className="font-semibold text-emerald-800 mb-3">
          💡 Application Tips
        </h3>
        <ul className="space-y-2 text-sm text-emerald-700">
          <li>
            • Be specific about your local knowledge and areas of expertise
          </li>
          <li>
            • Highlight any language skills, certifications, or relevant
            experience
          </li>
          <li>• Make sure your CV link is publicly accessible</li>
          <li>• Show your enthusiasm and passion for helping travelers</li>
          <li>• Include any unique skills or specializations you bring</li>
        </ul>
      </div>
    </div>
  );
};

export default JoinTourGuide;
