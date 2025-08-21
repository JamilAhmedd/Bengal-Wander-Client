import React from "react";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import useAuth from "../../AuthProvider/useAuth";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      Swal.fire({
        icon: "success",
        title: "Password reset email sent!",
        text: "Check your inbox for further instructions.",
        confirmButtonColor: "#6366F1",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-bold mb-4 text-center">
        Reset Your Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary  text-white rounded-md hover:bg-secondary transition"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
