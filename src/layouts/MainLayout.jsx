import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Navbar from "../components/shared/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/shared/Footer/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

export default MainLayout;
