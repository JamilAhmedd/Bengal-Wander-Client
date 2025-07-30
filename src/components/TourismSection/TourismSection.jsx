import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useNavigate } from "react-router";

const TourismSection = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const {
    data: stories = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["random-stories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/random-stories");
      return res.data;
    },
  });
  const {
    data: tourGuides = [],
    isPending: guidePending,
    isError: guideError,
  } = useQuery({
    queryKey: ["random-guides"],
    queryFn: async () => {
      const res = await axiosPublic.get("/guides-random");
      console.log(res.data);
      return res.data;
    },
  });
  const handleViewDetails = (id) => {
    navigate(`/guide/${id}`);
  };

  return (
    <section className="py-12 mt-24 font-poppins">
      <div className="container mx-auto">
        <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-12">
          Discover Bangladesh
        </h2>

        <Tabs
          selectedTabClassName="bg-green-300/60"
          className="rounded-xl border border-gray-400/30 bg-white"
        >
          <TabList className="flex p-[2px] rounded-xl border-b border-gray-200/60">
            <Tab className="flex-1 rounded-xl focus:outline-0 text-center py-4 px-6 cursor-pointer text-lg font-semibold transition-all duration-300 text-gray-700 hover:bg-green-100 hover:text-green-800">
              Stories
            </Tab>
            <Tab
              className={
                "flex-1 rounded-xl focus:outline-0 text-center py-4 px-6 cursor-pointer text-lg font-semibold transition-all duration-300 text-gray-700 hover:bg-green-100 hover:text-green-800"
              }
            >
              Our Guides
            </Tab>
          </TabList>

          <TabPanel className="p-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Explore Real Travel Experiences
            </h3>

            {isPending ? (
              <div className="text-center text-lg text-gray-500 py-6">
                <span className="loading loading-spinner loading-lg text-emerald-500"></span>
              </div>
            ) : isError ? (
              <p className="text-center text-red-500">
                Failed to load stories.
              </p>
            ) : stories.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                No stories available at the moment. Please check back later!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story) => (
                  <div
                    key={story._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-102 transition-all duration-300"
                  >
                    <img
                      src={story.images[0]}
                      alt={story.title}
                      className="w-full h-56 object-cover rounded-t-xl"
                    />
                    <div className="p-6">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {story.location}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {story.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {story.description}
                      </p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleViewDetails(story._id)}
                          className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors duration-300 shadow-md"
                        >
                          View Story
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabPanel>
          <TabPanel>
            {guidePending ? (
              <div className="text-center text-lg text-gray-500 py-6">
                <span className="loading loading-spinner loading-lg text-emerald-500"></span>
              </div>
            ) : guideError ? (
              <p className="text-center text-red-500">
                Failed to load Tour Guides.
              </p>
            ) : tourGuides.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                No Tour Guides available.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {tourGuides.map((guide) => (
                  <div
                    key={guide._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-102 transition-all duration-300 flex flex-col items-center p-6 text-center"
                  >
                    <img
                      src={guide.photoURL}
                      alt={guide.name}
                      className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-200 hover:border-green-400 transition-colors duration-300"
                    />
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {guide.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Email: {guide.email}
                    </p>
                    <p className="text-green-600 font-semibold capitalize">
                      Role: {guide.role}
                    </p>
                    <button
                      onClick={() => handleViewDetails(guide._id)}
                      className="btn "
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
};

export default TourismSection;
