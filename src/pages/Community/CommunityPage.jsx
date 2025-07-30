import React from "react";
import { useQuery } from "@tanstack/react-query";

import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import StoryCard from "../../components/shared/StoryCard/StoryCard";

const CommunityPage = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: stories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["community-stories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/stories");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <p className="text-gray-600 font-medium">Loading community stories...</p>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
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
            Unable to load stories
          </h3>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className=" bg-emerald-500  rounded-b-2xl text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community Stories
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Discover amazing travel experiences shared by our community
              members from Bangladesh.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="flex flex-1  justify-center  gap-6 mb-8">
          <div className="bg-white flex-1 rounded-xl p-6 text-center border border-gray-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {stories.length}
            </h3>
            <p className="text-gray-600">Total Stories</p>
          </div>

          <div className="bg-white flex-1 rounded-xl p-6 text-center border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {new Set(stories.map((story) => story.author?.email)).size}
            </h3>
            <p className="text-gray-600">Contributors</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {stories.map((story) => (
          <StoryCard
          
            key={story._id}
            story={story}
            isLoading={isLoading}
            isError={isError}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
