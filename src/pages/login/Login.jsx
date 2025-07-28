import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { motion } from "motion/react";
import { Link } from "react-router";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data.email === "user@example.com" && data.password === "password123") {
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Redirecting to your next adventure...",
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
      }).then(() => {
        // window.location.href = '/dashboard';
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
        background: "#fff",
        color: "#333",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-gray-900 dark:text-gray-800",
          content: "text-gray-700 dark:text-gray-600",
        },
      });
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
        Your Next Adventure Awaits!
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Input Field */}
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
            name="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input Field */}
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
            name="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full cursor-pointer py-3 px-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          Login
        </button>
      </form>

      {/* Link to Registration Page */}
      <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
        New to Bengal-Wander?{" "}
        <Link
          to={"/auth/register"}
          className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-200 ease-in-out"
        >
          Register for an adventure!
        </Link>
      </p>
    </motion.div>
  );
};

export default Login;
