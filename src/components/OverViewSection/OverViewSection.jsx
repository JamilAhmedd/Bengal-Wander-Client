import { div } from "motion/react-client";
import React from "react";

const OverviewSection = () => {
  return (
    <div className="my-36">
      <h1 className="font-extrabold text-primary text-5xl font-poppins text-center mb-12">
        We Are Bengal Wander
      </h1>
      <section className="bg-base-200 border border-base-300 rounded-xl py-16 px-4 md:px-10 lg:px-20 dark:bg-base-100 dark:border-gray-600/30">
        <div className="container mx-auto px-4 flex gap-10 items-center">
          {/* Image */}
          <div className="h-full flex-1 w-full">
            <iframe
              className="w-full aspect-video h-full rounded-lg"
              src="https://www.youtube.com/embed/t__HDoRKM0s"
              title="Bandarban Aerial View | Stunning Drone Footage"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>

          {/* Text */}
          <div className="flex-1">
            <h2 className="text-3xl text-primary md:text-4xl font-bold text-deep mb-4 ">
              Discover the Beauty of Bangladesh
            </h2>
            <p className=" text-lg mb-6 leading-relaxed text-neutral">
              Our platform connects you with the most breathtaking destinations,
              curated tour packages, and experienced local guides. Whether
              you're seeking coastal serenity, lush hills, or cultural heritage,
              we help you explore Bangladesh like never before.
            </p>
            <button className="bg-primary text-white px-6 py-3 rounded-full hover:bg-secondary transition duration-300">
              Start Exploring
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverviewSection;
