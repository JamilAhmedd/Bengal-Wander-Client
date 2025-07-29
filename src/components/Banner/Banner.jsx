import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { div } from "motion/react-client";
import { motion } from "motion/react";
import { Link } from "react-router";
const slides = [
  {
    id: "coxs-bazar",
    link: "/trips/6888af665c780353ba313187",
    image: "./slider-1.jpg",
    alt: "Longest sea beach in Cox's Bazar, Bangladesh",
    location: "Cox's Bazar",
    description: "Relax on the world's longest natural sandy sea beach.",
    buttonText: "Visit Cox's Bazar",
  },
  {
    id: "gazaria",
    image: "./slider-2.jpg",
    link: "/trips/6888af665c780353ba313188",
    alt: "Scenic view in Gazaria, Munshiganj, Bangladesh",
    location: "Gazaria, Munshiganj",
    description:
      "Experience the tranquility of riverside landscapes in Gazaria.",
    buttonText: "Explore Gazaria",
  },
  {
    id: "sylhet",
    image: "./slider-3.jpg",
    link: "/trips/6888af665c780353ba313190",
    alt: "Beautiful landscape of Sylhet District, Bangladesh",
    location: "Sylhet District",
    description: "Explore the tea gardens and lush green hills of Sylhet.",
    buttonText: "Discover Sylhet",
  },
];

const Banner = () => {
  const handleButtonClick = (slideId) => {
    console.log(`Button clicked on slide: ${slideId}`);
    // You can handle navigation here, e.g., navigate(`/destinations/${slideId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
    >
      <Carousel
        className="mt-6"
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        autoPlay={true}
        interval={5000}
        stopOnHover={true}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <img
              className="max-h-[600px] rounded-2xl object-cover w-full"
              src={slide.image}
              alt={slide.alt}
            />
            <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center text-white bg-black/40 p-4">
              <p className="text-xl md:text-3xl font-bold mb-2">
                Location: {slide.location}
              </p>
              <p className="text-sm md:text-lg text-center mb-4">
                {slide.description}
              </p>
              <Link to={slide.link}>
                <button
                  onClick={() => handleButtonClick(slide.id)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                >
                  {slide.buttonText}
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    </motion.div>
  );
};

export default Banner;
