import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router";
import { motion } from "motion/react";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
const Trips = () => {
  const axiosPublic = useAxiosPublic();
  const {
    data: trips = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const res = await axiosPublic.get("/trips");
      return res.data;
    },
  });

  if (isPending) return <p className="text-center">Loading packages...</p>;
  if (isError)
    return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <>
      {" "}
      <div className=" bg-primary dark:bg-base-200 border-x border-b border-base-300  rounded-b-2xl text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bebas dark:text-neutral tracking-wide md:text-5xl font-bold mb-4">
              Plan Your Next Adventure
            </h1>
            <p className="text-xl font-lora font-semibold dark:text-neutral max-w-2xl mx-auto">
              Browse through our curated travel packages and start your journey
              through the breathtaking beauty of Bangladesh.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {trips.map((trip, index) => (
          <motion.div
            key={trip._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: index * 0.1,
            }}
            className="rounded-2xl  hover:scale-101 bg-base-200 shadow-sm border border-base-300 overflow-hidden hover:shadow-md transition-all duration-300" // ⬅️ make card a flex container
          >
            <div className="relative overflow-hidden h-48">
              <img
                src={trip.gallery[0]}
                alt={trip.packageName}
                className="w-full h-full object-cover  transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col flex-1 p-6">
              {" "}
              {/* ⬅️ let content expand */}
              <h2 className=" font-bold  text-neutral font-bebas tracking-wide text-2xl leading-tight">
                {trip.packageName}
              </h2>
              <p className="badge badge-success font-lora font-bold rounded-sm mt-1 text-white text-sm mb-2">
                {trip.location}
              </p>
              <p className="text-neutral font-lora font-bold mb-4 line-clamp-3">
                {trip.aboutTour?.slice(0, 150)}...
              </p>
              {/* Push button to the bottom */}
              <div className="mt-auto flex justify-end">
                <Link
                  to={`/trips/${trip._id}`}
                  className="block px-6 py-2 bg-primary font-lora  text-white font-bold rounded-lg 
        hover:bg-secondary transition-colors duration-200 
        "
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Trips;
