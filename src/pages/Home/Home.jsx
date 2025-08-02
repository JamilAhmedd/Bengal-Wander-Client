import React from "react";
import Banner from "../../components/Banner/Banner";
import TourismSection from "../../components/TourismSection/TourismSection";
import OverviewSection from "../../components/OverViewSection/OverViewSection";
import RandomStoriesSection from "../../components/RandomStories/RandomStoriesSection";

const Home = () => {
  return (
    <>
      <div>
        <Banner></Banner>
        <OverviewSection></OverviewSection>
        <TourismSection></TourismSection>
        <RandomStoriesSection></RandomStoriesSection>
      </div>
    </>
  );
};

export default Home;
