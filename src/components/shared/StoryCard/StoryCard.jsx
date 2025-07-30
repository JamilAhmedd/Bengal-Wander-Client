import React from "react";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";

const StoryCard = ({ story }) => {
  const shareUrl = `${window.location.origin}/stories/${story._id}`;
  console.log(`${window.location.origin}/stories/${story._id}`);
  const shareTitle = story.title;

  return (
    <div className=" rounded-2xl  hover:scale-101 bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="  h-48 overflow-hidden">
        <img
          src={story.images[0]}
          alt={story.title}
          className="w-full h-full object-cover  transition-transform duration-300"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div>
            <h4 className="font-medium text-gray-800">{story.authorName}</h4>
            <p className="text-sm text-gray-500">
              {new Date(story.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {story.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{story.content}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <FacebookShareButton url={shareUrl} quote={shareTitle}>
              <FacebookIcon
                size={28}
                round
                className="hover:scale-110 transition-transform"
              />
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon
                size={28}
                round
                className="hover:scale-110 transition-transform"
              />
            </TwitterShareButton>

            <LinkedinShareButton url={shareUrl} title={shareTitle}>
              <LinkedinIcon
                size={28}
                round
                className="hover:scale-110 transition-transform"
              />
            </LinkedinShareButton>

            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <WhatsappIcon
                size={28}
                round
                className="hover:scale-110 transition-transform"
              />
            </WhatsappShareButton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoryCard;
