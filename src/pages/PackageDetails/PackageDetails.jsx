import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import axios from "axios";
import useAuth from "../../AuthProvider/useAuth";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleBooking = async () => {
    if (!user) {
      return navigate("/login");
    }
    const guideEmailResponse = await axiosPublic.get(
      `/selected-guide/?name=${selectedGuide}`
    );
    const guideEmail = guideEmailResponse.data.email;
    const bookingData = {
      packageId: id,
      packageName: pkg.packageName,
      touristName: user.displayName,
      touristEmail: user.email,
      touristImage: user.photoURL,
      tourDate: date,
      guide: guideEmail,
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
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto font-[Lora]  ">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="card  shadow-lg overflow-hidden">
            <div className="  ">
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
              <div className="p-8 bg-white dark:bg-base-200">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-neutral mb-4">
                      {pkg.packageName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-success" />
                        <span className="text-neutral">{pkg.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-success" />
                        <span className="text-neutral">
                          {pkg.tourPlan?.length} Days
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-success" />
                        <span className="text-neutral">{pkg.maxPeople}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-neutral">
                    <div className="text-3xl border-b-2 border-b-base-accent  slashed-zero tabular-nums font-bold text-neutral">
                      ${pkg.price}
                    </div>
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
              className="card bg-white dark:bg-base-200 shadow-lg"
            >
              <div className="card-body ">
                <h2 className="card-title text-2xl text-neutral mb-4">
                  About This Tour
                </h2>
                <p className=" text-lg font-medium  text-neutral/70">
                  {pkg.aboutTour}
                </p>
              </div>
            </motion.div>

            {/* Tour Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card bg-white dark:bg-base-200 shadow-lg"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl text-neutral mb-6">
                  Tour Planning
                </h2>
                <div className="space-y-4">
                  {pkg.tourPlan?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-center p-4 bg-base- dark:bg-base-300 rounded-lg"
                    >
                      <div className="flex-shrink-0  ">
                        <div className="w-8 h-8 bg-success text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <p className=" font-[Lora] text-lg tracking-wider font-bold  text-neutral mb-1">
                          {item.day}
                        </p>
                        <p className="text-neutral/80 font-[Lora] tracking-wide font-semibold">
                          {item.activities}
                        </p>
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
              className="card dark:bg-base-200 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title text-2xl  text-neutral mb-6">
                  Meet Our Tour Guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {guides.map((guide) => (
                    <div
                      key={guide._id}
                      onClick={() => navigate(`/guide/${guide._id}`)}
                      className="card  dark:bg-base-300  shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    >
                      <div className="card-body items-center text-center p-6">
                        <div className="avatar">
                          <div className="w-20 h-20 rounded-full ">
                            <img
                              src={guide.photoURL}
                              alt={guide.name}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <h3 className="card-title text-lg text-neutral font-[Lora] capitalize tracking-widest] mt-3">
                          {guide.name}
                        </h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm text-neutral/80 font-bold">
                            4.9
                          </span>
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
              className="card bg-white dark:bg-base-200 font-[Lora] shadow-xl lg:sticky lg:top-28 w-full"
            >
              <div className="card-body px-4 sm:px-6 lg:px-8">
                <h2 className="card-title text-2xl font-[Bebas_Neue] tracking-widest text-neutral mb-6">
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
                      className="input focus:outline-none border-base-300 dark:bg-base-300 w-full"
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
                      className="input focus:outline-none border-base-300 dark:bg-base-300 w-full"
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
                      className="input focus:outline-none border-base-300 dark:bg-base-300 w-full"
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
                      className="input focus:outline-none border-base-300 dark:bg-base-300  font-semibold w-full"
                    />
                  </div>

                  {/* Tour Date */}
                  <div className="form-control">
                    <label className="label mr-2 flex">
                      <span className="label-text  font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Tour Date
                      </span>
                    </label>
                    <DatePicker
                      selected={date}
                      onChange={(date) => setDate(date)}
                      placeholderText="Select your preferred date"
                      className="input focus:outline-none border-base-300 dark:bg-base-300 w-full"
                      minDate={new Date()}
                    />
                  </div>

                  {/* Guide Selection */}
                  <div className="relative w-full" ref={dropdownRef}>
                    <button
                      className="select focus:outline-none border-base-300 dark:bg-base-300 w-full"
                      onClick={() => setOpen(!open)}
                    >
                      {selectedGuide || "Select a tour guide"}
                    </button>

                    {open && (
                      <div className="absolute mt-2 w-full max-h-48 overflow-y-auto bg-white dark:bg-base-300 shadow rounded z-50">
                        {guides.map((guide) => (
                          <div
                            key={guide._id}
                            className="px-4 py-2 hover:bg-base-200 cursor-pointer"
                            onClick={() => {
                              setSelectedGuide(guide.name);
                              setOpen(false);
                            }}
                          >
                            {guide.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Booking Button */}
                  <button
                    onClick={handleBooking}
                    className="btn btn-primary btn-lg w-full mt-6  text-white"
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
