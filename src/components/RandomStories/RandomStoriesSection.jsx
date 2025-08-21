import React, { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  LinkedinIcon,
} from "react-share";
import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import { Link, useNavigate } from "react-router";

import useAuth from "../../AuthProvider/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";

const RandomStoriesSection = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get("/random-stories");
        setStories(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching random stories", error);
        setError("Failed to load stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [axiosPublic]);

  const handleShare = (storyId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (navigator.share) {
      const story = stories.find((s) => s._id === storyId);
      navigator
        .share({
          title: story?.title || "Check out this story",
          text: story?.description || "An interesting story to read",
          url: `${window.location.origin}/stories/${storyId}`,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      const shareUrl = `${window.location.origin}/stories/${storyId}`;
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Story link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);

          prompt("Copy this link to share:", shareUrl);
        });
    }
  };

  const getShareUrl = (storyId) =>
    `${window.location.origin}/stories/${storyId}`;

  if (loading) {
    return (
      <section className="px-4 md:px-10 py-10 bg-white border  border-gray-400/30 rounded-xl">
        <div className="flex items-center justify-center">
          <div className="text-gray-600">Loading stories...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 md:px-10 py-10 bg-white border  border-gray-400/30 rounded-xl">
        <div className="flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
      </section>
    );
  }
  console.log(stories);
  return (
    <div className="my-36">
      <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">
        Stories from our Community
      </h1>
      <section className="px-4 md:px-10 py-10 bg-white border  border-gray-400/30 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Stories</h2>
          <Link
            to="/community"
            className="text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-medium transition"
          >
            All Stories
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            No stories available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories.map((story) => (
              <div
                key={story._id}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition"
              >
                <img
                  src={story.images[0] || "https://via.placeholder.com/300"}
                  alt={story.title}
                  className="rounded-xl w-full h-40 object-cover mb-3"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {story.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-500">
                    by {story.author}
                  </span>
                  <a
                    href={`/stories/${story._id}`}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Read More
                  </a>
                </div>

                <div className="border-t pt-3">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Share:</span>
                      <div className="flex gap-2">
                        <FacebookShareButton
                          url={getShareUrl(story._id)}
                          quote={story.title}
                          round
                        >
                          <FacebookIcon size={24} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                          url={getShareUrl(story._id)}
                          title={story.title}
                        >
                          <TwitterIcon size={24} round />
                        </TwitterShareButton>
                        <WhatsappShareButton
                          round
                          url={getShareUrl(story._id)}
                          title={story.title}
                        >
                          <WhatsappIcon size={24} round />
                        </WhatsappShareButton>{" "}
                        <LinkedinShareButton
                          url={getShareUrl(story._id)}
                          title={story.title}
                        >
                          <LinkedinIcon size={24} round />
                        </LinkedinShareButton>{" "}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Share:</span>
                      <button
                        onClick={() => handleShare(story._id)}
                        className="text-xs text-primary hover:text-secondary  "
                        title="Login to share"
                      >
                        Login to share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RandomStoriesSection;
