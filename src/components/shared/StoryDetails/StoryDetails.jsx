import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";

const StoryDetails = () => {
  const { id } = useParams();

  const {
    data: story,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      const res = await axios.get(`/stories/${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  if (isError || !story)
    return (
      <div className="text-center mt-20 text-red-500">Story not found.</div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{story.title}</h1>

      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <span>By {story.authorName}</span>
        <span>{moment(story.createdAt).format("MMMM D, YYYY")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {story.images?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Story image ${idx + 1}`}
            className="rounded-xl w-full object-cover h-64"
          />
        ))}
      </div>

      <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
        {story.content}
      </p>
    </div>
  );
};

export default StoryDetails;
