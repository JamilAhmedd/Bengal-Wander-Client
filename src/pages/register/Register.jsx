import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../AuthProvider/useAuth";
import useAxiosPublic from "../../components/hooks/useAxiosPublic";
import getJWT from "../../components/hooks/getJWT";
import SocialLogin from "../socialLogin/SocialLogin";

const Register = () => {
  const location = useLocation();
  const from = location.state?.from || "/";
  const axiosPublic = useAxiosPublic();
  const [profile, setProfile] = useState("");
  const { createAccount, userUpdate } = useAuth();
  const navigate = useNavigate();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createAccount(data.email, data.password).then(async (res) => {
      const userInfo = {
        email: data.email,
        name: data.name,
        photoURL: profile,
      };
      axiosPublic.post("/users", userInfo);
      const userToUpdate = res.user;
      const updatedProfile = {
        displayName: data.name,
        photoURL: profile,
      };
      await userUpdate(userToUpdate, updatedProfile).then((res) => {
       
      });
      navigate(from, { replace: true });
      await getJWT(res.user);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome to Bengal-Wander. Let's start your journey!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: "#fff",
        color: "#333",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-gray-900 dark:text-gray-800",
          content: "text-gray-700 dark:text-gray-600",
        },
      });
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosPublic.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_key}`,
        formData
      );
      setProfile(res.data.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: "Could not upload profile picture. Please try again.",
      });
      setProfile(""); 
    } finally {
      setIsUploadingImage(false); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
        type: "tween",
      }}
      className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
        Join Bengal-Wander Today!
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Profile Picture
          </label>
          <input
            onChange={handleImageUpload}
            type="file"
            id="photo"
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Submit */}
        <button
          disabled={isUploadingImage}
          type="submit"
          className="w-full cursor-pointer py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          {isUploadingImage ? (
            <span className="loading loading-dots loading-xl"></span>
          ) : (
            "Register"
          )}
        </button>
      </form>

      {/* Link to Login */}
      <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
        Already have an account?{" "}
        <Link
          to={"/auth/login"}
          className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-200 ease-in-out"
        >
          Login to continue your adventure!
        </Link>
      </p>
      <SocialLogin></SocialLogin>
    </motion.div>
  );
};

export default Register;
