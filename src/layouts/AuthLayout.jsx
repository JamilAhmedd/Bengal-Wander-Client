import React from "react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { Outlet, useLocation } from "react-router";
const AuthLayout = () => {
  const location = useLocation();
  return (
    <div className="relative min-h-screen bg-cover bg-center bg-[url(/src/assets/auth-page.jpg)] flex items-center justify-center bg-gradient-to-br from-teal-500 via-blue-600 to-purple-700 p-4 font-inter">
      <AnimatePresence mode="wait">
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout;
