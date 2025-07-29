import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../../AuthProvider/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const ManageStories = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [deleteLoading, setDeleteLoading] = useState(null);

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["userStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stories/user");
      return res.data;
    },
    enabled: !!user,
  });

  const handleEdit = (storyId) => {
    navigate(`/dashboard/edit-story/${storyId}`);
    alert(`Navigate to edit story page with ID: ${storyId}`);
  };

  const deleteStoryMutation = useMutation({
    mutationFn: async (storyId) => {
      const res = await axiosSecure.delete(`/stories/${storyId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStories"] });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your story was deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      console.error("Error deleting story:", error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Failed to delete story. Please try again.",
      });
    },
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const handleDelete = async (storyId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      setDeleteLoading(storyId);
      deleteStoryMutation.mutate(storyId, {
        onSettled: () => setDeleteLoading(null),
      });
    }
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading loading-spinner loading-lg text-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-emerald-800">My Stories</h2>
        <button
          className="btn btn-success"
          onClick={() => {
            navigate("/dashboard/stories/add"); // Uncomment in actual app
          }}
        >
          + Add New Story
        </button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Stories Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start sharing your amazing travel experiences!
          </p>
          <button
            className="btn btn-success"
            onClick={() => {
              navigate("/dashboard/stories/add"); // Uncomment in actual app
              alert("Navigate to add story page");
            }}
          >
            Create Your First Story
          </button>
        </div>
      ) : (
        <>
          {/* Stories Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="stat bg-white rounded-lg shadow border-l-4 border-l-emerald-400">
              <div className="stat-title text-gray-600">Total Stories</div>
              <div className="stat-value text-emerald-600">
                {stories.length}
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 bg-gray-200">
                  <div className="relative w-full h-full">
                    <img
                      src={story.images[0]}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    {story.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        +{story.images.length - 1} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`badge ${
                        story.status === "published"
                          ? "badge-success"
                          : "badge-warning"
                      } text-white`}
                    >
                      {story.status.charAt(0).toUpperCase() +
                        story.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(story.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2">
                    {story.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateContent(story.content)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>
                      📸 {story.images.length} image
                      {story.images.length !== 1 ? "s" : ""}
                    </span>
                    <span>📝 {story.content.length} characters</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-success btn-sm flex-1"
                      onClick={() => handleEdit(story._id)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-outline btn-error btn-sm flex-1"
                      onClick={() => handleDelete(story._id)}
                      disabled={deleteLoading === story.id}
                    >
                      {deleteLoading === story._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>🗑️ Delete</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tips Section */}
      <div className="bg-emerald-50 rounded-lg p-6 mt-8">
        <h3 className="font-semibold text-emerald-800 mb-3">
          📋 Story Management Tips
        </h3>
        <ul className="space-y-2 text-sm text-emerald-700">
          <li>
            • Edit your stories to keep them up-to-date with new experiences
          </li>
          <li>• Add or remove images to better showcase your adventures</li>
          <li>• Delete outdated stories to keep your profile fresh</li>
          <li>• Regular updates help engage your audience better</li>
          <li>• Use the edit feature to fix typos or add more details</li>
        </ul>
      </div>
    </div>
  );
};

export default ManageStories;
