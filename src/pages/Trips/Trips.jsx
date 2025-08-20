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
            <h1 className="text-4xl font-[Bebas_Neue] dark:text-neutral tracking-wide md:text-5xl font-bold mb-4">
              Plan Your Next Adventure
            </h1>
            <p className="text-xl font-[Lora] font-semibold dark:text-neutral max-w-2xl mx-auto">
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
            className="bg-base-200 relative rounded-xl shadow-lg p-6 border border-base-300
    transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl 
    flex flex-col" // ⬅️ make card a flex container
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={trip.gallery[0]}
                alt={trip.packageName}
                className="h-48 w-full object-cover rounded-lg"
              />
            </div>

            <div className="flex flex-col flex-1">
              {" "}
              {/* ⬅️ let content expand */}
              <h2 className="text-xl font-bold mt-4 text-neutral leading-tight">
                {trip.packageName}
              </h2>
              <p className="badge badge-success rounded-sm mt-1 text-white text-sm mb-2">
                {trip.location}
              </p>
              <p className="text-neutral text-sm mb-4 line-clamp-3">
                {trip.aboutTour?.slice(0, 150)}...
              </p>
              {/* Push button to the bottom */}
              <div className="mt-auto flex justify-end">
                <Link
                  to={`/trips/${trip._id}`}
                  className="block px-6 py-2 bg-primary text-white font-semibold rounded-lg 
        hover:bg-secondary transition-colors duration-200 
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
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
