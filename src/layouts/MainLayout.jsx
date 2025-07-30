import React from "react";

import Navbar from "../components/shared/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/shared/Footer/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="container mx-auto min-h-screen">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </>
  );
};

export default MainLayout;
