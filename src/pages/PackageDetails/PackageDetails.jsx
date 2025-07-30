import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import axios from "axios";
import useAuth from "../../AuthProvider/useAuth";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import { useState } from "react";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Camera,
  CheckCircle,
  User,
  Mail,
  DollarSign,
} from "lucide-react";
import useAxiosSecure from "../../components/hooks/useAxiosSecure";
import Swal from "sweetalert2";

const PackageDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [date, setDate] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { data: pkg = {} } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/trips/${id}`);
      return res.data;
    },
  });

  const { data: guides = [] } = useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const res = await axiosPublic.get("/tour-guide");
      return res.data;
    },
  });

  const handleBooking = async () => {
    if (!user) {
      return navigate("/login");
    }

    const bookingData = {
      packageId: id,
      packageName: pkg.packageName,
      touristName: user.displayName,
      touristEmail: user.email,
      touristImage: user.photoURL,
      tourDate: date,
      guide: selectedGuide,
      price: pkg.price,
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/bookings", bookingData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Booking Confirmed!",
          text: "Your trip has been booked successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/dashboard/my-bookings");
      }
    } catch (err) {
      console.error("Booking failed", err);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: "Please try again later.",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="card bg-white shadow-2xl overflow-hidden">
            <div className="card-body p-0">
              <div className="relative">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  {pkg.gallery && pkg.gallery.length > 0 && (
                    <img
                      src={pkg.gallery[activeImageIndex]}
                      alt="Tour"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <div className="badge badge-primary gap-2">
                      <Camera className="w-4 h-4" />
                      {activeImageIndex + 1} / {pkg.gallery?.length || 0}
                    </div>
                  </div>
                </div>

                {pkg.gallery && pkg.gallery.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-2 bg-black/20 backdrop-blur-sm rounded-full p-2">
                      {pkg.gallery.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            i === activeImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Package Header */}
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      {pkg.packageName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        <span>Bangladesh</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-600" />
                        <span>7 Days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <span>Max 15 People</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span>4.8 (124 reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600">
                      ${pkg.price}
                    </div>
                    <div className="text-gray-500">Family</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card bg-white shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl text-gray-900 mb-4">
                  About This Tour
                </h2>
                <p className="text-gray-700 leading-relaxed">{pkg.aboutTour}</p>
              </div>
            </motion.div>

            {/* Tour Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card bg-white shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl text-gray-900 mb-6">
                  Tour Planning
                </h2>
                <div className="space-y-4">
                  {pkg.tourPlan?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 bg-emerald-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-900 mb-1">
                          {item.day}
                        </h3>
                        <p className="text-gray-700">{item.activities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tour Guides */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card bg-white shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl text-gray-900 mb-6">
                  Meet Our Tour Guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {guides.map((guide) => (
                    <div
                      key={guide._id}
                      onClick={() => navigate(`/guide/${guide._id}`)}
                      className="card bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    >
                      <div className="card-body items-center text-center p-6">
                        <div className="avatar">
                          <div className="w-20 h-20 rounded-full ring ring-emerald-200 ring-offset-2">
                            <img
                              src={guide.photoURL}
                              alt={guide.name}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <h3 className="card-title text-lg text-gray-900 mt-3">
                          {guide.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-gray-600">4.9</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card bg-white shadow-xl lg:sticky lg:top-8 w-full"
            >
              <div className="card-body px-4 sm:px-6 lg:px-8">
                <h2 className="card-title text-2xl text-gray-900 mb-6">
                  Book This Adventure
                </h2>

                <div className="space-y-4">
                  {/* Package Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Package</span>
                    </label>
                    <input
                      type="text"
                      value={pkg.packageName || ""}
                      readOnly
                      className="input input-bordered bg-gray-50 w-full"
                    />
                  </div>

                  {/* Tourist Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Your Name
                      </span>
                    </label>
                    <input
                      type="text"
                      value={user?.displayName || ""}
                      readOnly
                      className="input input-bordered bg-gray-50 w-full"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="input input-bordered bg-gray-50 w-full"
                    />
                  </div>

                  {/* Price */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price
                      </span>
                    </label>
                    <input
                      type="text"
                      value={`${pkg.price}` || ""}
                      readOnly
                      className="input input-bordered bg-gray-50 font-semibold w-full"
                    />
                  </div>

                  {/* Tour Date */}
                  <div className="form-control">
                    <label className="label mr-2 flex">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Tour Date
                      </span>
                    </label>
                    <DatePicker
                      selected={date}
                      onChange={(date) => setDate(date)}
                      placeholderText="Select your preferred date"
                      className="input input-bordered w-full"
                      minDate={new Date()}
                    />
                  </div>

                  {/* Guide Selection */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Choose Your Guide
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={selectedGuide}
                      onChange={(e) => setSelectedGuide(e.target.value)}
                    >
                      <option value="">Select a tour guide</option>
                      {guides.map((guide) => (
                        <option key={guide._id} value={guide.name}>
                          {guide.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Booking Button */}
                  <button
                    onClick={handleBooking}
                    className="btn btn-primary btn-lg w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 border-none hover:from-emerald-700 hover:to-teal-700"
                    disabled={!date || !selectedGuide}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Book Now
                  </button>

                  {(!date || !selectedGuide) && (
                    <p className="text-sm text-gray-500 text-center">
                      Please select a date and guide to continue
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    What's Included
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Professional tour guide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Transportation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Meals as per itinerary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Entry fees to attractions</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
