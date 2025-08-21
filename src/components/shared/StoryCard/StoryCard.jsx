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
  console.log(shareUrl);
  const shareTitle = story.title;

  return (
    <div className="rounded-2xl hover:scale-101 bg-base-200 shadow-sm border border-base-300 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={story.images[0]}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
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

        <h3 className="text-2xl font-bebas tracking-wide font-bold text-neutral mb-3 line-clamp-2">
          {story.title}
        </h3>

        <p className="text-neutral mb-4 line-clamp-3 font-lora font-bold">
          {story.content}
        </p>

        {/* Footer (sticks to bottom) */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
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

          <a
            className="btn shadow-none text-white btn-primary font-lora font-bold hover:btn-secondary"
            href={`/stories/${story._id}`}
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
};
export default StoryCard;
