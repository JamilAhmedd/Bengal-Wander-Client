import React from "react";

import { Link } from "react-router";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const GuideStories = ({ email }) => {
  const axiosPublic = useAxiosPublic();
  console.log(email);
  const {
    data: stories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["guide-stories", email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/guide-stories?email=${email}`);
      return res.data;
    },
    enabled: !!email,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="loading loading-spinner loading-md text-emerald-500"></span>
      </div>
    );
  }

  if (isError || stories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No stories found for this guide.
      </div>
    );
  }
  return (
    <>
      <h1 className="text-5xl font-bold text-center my-8 mt-20">
        Stories Uploaded By the Guide
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
        {stories.map((story) => (
          <div
            key={story._id}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <img
              src={story.images[0]}
              alt={story.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                {story.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {story.description}
              </p>
              <a
                href={`/stories/${story._id}`}
                className="text-emerald-600 hover:underline font-medium text-sm"
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GuideStories;
