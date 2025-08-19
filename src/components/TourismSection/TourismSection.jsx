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
    data: packages = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["random-packages"],
    queryFn: async () => {
      const res = await axiosPublic.get("/random-packages");
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

      return res.data;
    },
  });
  const handleViewDetails = (id) => {
    navigate(`/guide/${id}`);
  };

  return (
    <section className="py-12 mt-36 font-poppins">
      <div className="container  mx-auto">
        <h2 className="text-5xl font-extrabold text-center text-primary mb-12">
          Discover Bangladesh
        </h2>

        <Tabs
          selectedTabClassName="bg-primary dark:bg-base-100 text-white dark:text-neutral "
          className="rounded-xl border border-gray-400/30 bg-base-200"
        >
          <TabList className="flex p-4 space-x-2 rounded-xl border-b  border-gray-200/60">
            <Tab className="flex-1 rounded-xl  focus:outline-0 text-center py-4 px-6 cursor-pointer text-lg font-semibold transition-all hover:bg-base-300 duration-300    ">
              Our Packages
            </Tab>
            <Tab
              className={
                "flex-1 rounded-xl focus:outline-0 text-center py-4 px-6 cursor-pointer text-lg font-semibold transition-all duration-300 hover:bg-base-300   "
              }
            >
              Our Guides
            </Tab>
          </TabList>

          <TabPanel className="p-8">
            <h3 className="text-3xl font-bold  text-gray-800 mb-6 mt-20 text-center">
              Explore Our Travel Packages
            </h3>

            {isPending ? (
              <div className="text-center text-lg text-gray-500 py-6">
                <span className="loading loading-spinner loading-lg text-emerald-500"></span>
              </div>
            ) : isError ? (
              <p className="text-center text-red-500">
                Failed to load packages.
              </p>
            ) : packages.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                No packages available at the moment. Please check back later!
              </p>
            ) : (
              <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-base-100 rounded-xl shadow-md overflow-hidden transform hover:scale-102 transition-all duration-300"
                  >
                    <img
                      src={pkg.gallery[0] || "/src/assets/brand-logo.png"}
                      alt={pkg.name}
                      className="w-full h-56 object-cover rounded-t-xl"
                    />
                    <div className="p-6">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {pkg.destination || "Bangladesh"}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {pkg.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-bold text-base">
                          ${pkg.price}
                        </span>
                        <button
                          onClick={() => navigate(`/trips/${pkg._id}`)}
                          className="bg-primary text-white px-5 py-2 rounded-xl hover:bg-secondary transition-colors duration-300 shadow-md"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabPanel>
          <TabPanel className="p-8">
            <h1 className="text-3xl font-bold my-6 text-gray-800   text-center">
              Meet Our Guides
            </h1>
            {guidePending ? (
              <span className="loading loading-spinner loading-lg text-emerald-500"></span>
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
                    className="bg-green-50 rounded-xl shadow-md overflow-hidden transform hover:scale-102 transition-all duration-300 flex flex-col items-center p-6 text-center"
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
