import React, { useState } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import Swal from "sweetalert2";

const GuideDetailsPage = () => {
  const { guideId } = useParams();

  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const {
    data: guide,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["guide-details", guideId],
    queryFn: async () => {
      const res = await axiosPublic.get(`/guides/${guideId}`);
      return res.data;
    },
    enabled: !!guideId,
  });

  const { mutate: likeGuide, isPending: liking } = useMutation({
    mutationFn: async () => {
      const res = await axiosPublic.patch(`/guides/like/${guide._id}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.modifiedCount > 0) {
        Swal.fire({
          title: "Liked!",
          text: `${guide.name} received your like ❤️`,
          icon: "success",
          confirmButtonColor: "#10B981",
        });
        // Optionally refetch guide details
        queryClient.invalidateQueries({
          queryKey: ["guide-details", guide._id],
        });
      } else {
        Swal.fire({
          title: "Already Liked!",
          text: `You’ve already liked this guide.`,
          icon: "info",
          confirmButtonColor: "#3B82F6",
        });
      }
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while liking the guide.",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    },
  });
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading guide details...</p>
        </div>
      </div>
    );
  }

  if (isError || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Unable to load guide
          </h3>
          <p className="text-gray-600">
            Please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-12 text-center">
            <div className="relative inline-block">
              <img
                src={guide.photoURL}
                alt={guide.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mt-6 mb-2">
              {guide.name}
            </h1>
            <p className="text-emerald-100 font-medium">Tour Guide</p>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="grid gap-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="text-gray-800 font-medium">{guide.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l4-4m0 4l-4-4m11-5v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h14a2 2 0 012 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="text-gray-800 font-medium">
                    {new Date(guide.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => likeGuide()}
              disabled={liking}
              className="btn btn-error mt-2 btn-sm text-white"
            >
              {liking ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Liking...
                </>
              ) : (
                <>❤️ Like</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetailsPage;
