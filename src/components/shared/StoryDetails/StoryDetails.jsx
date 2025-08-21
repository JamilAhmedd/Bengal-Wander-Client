import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import moment from "moment";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../../AuthProvider/useAuth";

const StoryDetails = () => {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const [showCommentForm, setShowCommentForm] = useState(false);

  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();

  const {
    data: story,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/stories/${id}`);
      return res.data;
    },
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/stories/${id}/comments`);
      return res.data;
    },
    enabled: !!id,
  });

  const commentMutation = useMutation({
    mutationFn: async (commentData) => {
      const res = await axiosPublic.post(
        `/stories/${id}/comments`,
        commentData
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", id]);
      setNewComment("");

      setShowCommentForm(false);
    },
  });

  const handleSubmitComment = () => {
    commentMutation.mutate({
      content: newComment,
      authorName: user.displayName,
      authorEmail: user.email,
    });
  };

  if (isLoading)
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  if (isError || !story)
    return (
      <div className="text-center mt-20 text-red-500">Story not found.</div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Story Content */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-neutral font-bebas">
          {story.title}
        </h1>

        <div className="flex items-center justify-between mb-6 text-sm text-gray-500 border-b border-gray-100 pb-4">
          <span className="font-medium">By {story.authorName}</span>
          <span>{moment(story.createdAt).format("MMMM D, YYYY")}</span>
        </div>

        {story.images?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {story.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Story image ${idx + 1}`}
                className="rounded-xl w-full object-cover h-64 shadow-sm"
              />
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed text-neutral font-lora font-medium  whitespace-pre-wrap">
            {story.content}
          </p>
        </div>
      </article>

      {/* Comments Section */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Comments ({comments.length})
          </h2>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="bg-primary hover:bg-secondary   text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Add Comment
          </button>
        </div>

        {/* Comment Form */}
        {showCommentForm && (
          <div className="mb-8 p-4 bg-white rounded-lg border border-base-300">
            <h3 className="text-lg font-semibold mb-4 text-neutral">
              Leave a Comment
            </h3>

            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comment *
              </label>
              <textarea
                id="comment"
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitComment}
                disabled={commentMutation.isPending}
                className="bg-primary hover:bg-secondary disabled:bg-primary text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {commentMutation.isPending ? "Posting..." : "Post Comment"}
              </button>
              <button
                onClick={() => setShowCommentForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-neutral px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {commentsLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {comment.authorName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {moment(comment.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default StoryDetails;
