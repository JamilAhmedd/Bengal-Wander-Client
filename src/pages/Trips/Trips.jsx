// src/pages/Trips.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import { motion } from "motion/react";
const Trips = () => {
  const {
    data: trips = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:5000/trips");
      return res.data;
    },
  });

  if (isPending) return <p className="text-center">Loading packages...</p>;
  if (isError)
    return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <>
      {" "}
      <div className=" bg-emerald-500  rounded-b-2xl text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Plan Your Next Adventure
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
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
            className="bg-white rounded-xl shadow-lg p-6 border border-emerald-200
        transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={trip.gallery[0]}
                alt={trip.packageName}
                className="h-48 w-full object-cover rounded-lg"
              />
            </div>

            <h2 className="text-xl font-bold mt-4 text-emerald-800 leading-tight">
              {trip.packageName}
            </h2>
            <p className="text-gray-600 text-sm mb-2">{trip.location}</p>
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {trip.aboutTour?.slice(0, 150)}...
            </p>
            <div className="flex justify-end mt-auto">
              <Link
                to={`/trips/${trip._id}`}
                className="inline-block px-6 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default Trips;
