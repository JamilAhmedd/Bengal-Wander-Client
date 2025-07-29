import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Mock useAuth hook for demo
const useAuth = () => ({
  user: {
    uid: "demo-user-123",
    displayName: "John Doe",
    email: "john.doe@example.com",
  },
});

// import useAuth from "../../../../AuthProvider/useAuth"; // Use this in your actual app
// import { useNavigate } from "react-router-dom"; // Use this in your actual app

// Mock stories data for demonstration
const mockStories = [
  {
    id: 1,
    title: "Amazing Adventure in the Mountains",
    content:
      "This was an incredible journey through the mountain trails. The views were breathtaking and the experience was unforgettable. I learned so much about myself and nature during this trip...",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1464822759844-d150ad6d1f0f?w=300&h=200&fit=crop",
    ],
    authorId: "demo-user-123",
    authorName: "John Doe",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    status: "published",
  },
  {
    id: 2,
    title: "Beach Paradise Discovery",
    content:
      "Found this hidden gem of a beach during my coastal road trip. The crystal clear waters and pristine sand made it a perfect escape from city life...",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
    ],
    authorId: "demo-user-123",
    authorName: "John Doe",
    createdAt: "2025-01-10T14:20:00Z",
    updatedAt: "2025-01-10T14:20:00Z",
    status: "published",
  },
  {
    id: 3,
    title: "Cultural Immersion in Local Markets",
    content:
      "Exploring the vibrant local markets was an eye-opening experience. The colors, smells, and sounds created an unforgettable sensory journey...",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop",
    ],
    authorId: "demo-user-123",
    authorName: "John Doe",
    createdAt: "2025-01-05T09:15:00Z",
    updatedAt: "2025-01-05T09:15:00Z",
    status: "published",
  },
];

const ManageStories = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Uncomment in actual app

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    // Simulate API call to fetch user stories
    const fetchStories = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/stories/user/${user.uid}`);
        // const data = await response.json();

        // Using mock data for now
        setTimeout(() => {
          setStories(mockStories);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchStories();
    }
  }, [user]);

  const handleEdit = (storyId) => {
    // Navigate to edit story page
    // navigate(`/dashboard/edit-story/${storyId}`); // Uncomment in actual app
    alert(`Navigate to edit story page with ID: ${storyId}`);
  };

  const handleDelete = async (storyId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      setDeleteLoading(storyId);

      try {
        // API call to delete story
        const response = await fetch(`/api/stories/${storyId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete story");
        }

        // Remove from local state
        setStories((prevStories) =>
          prevStories.filter((story) => story.id !== storyId)
        );

        alert("Story deleted successfully.");
      } catch (error) {
        console.error("Error deleting story:", error);
        alert("Failed to delete story. Please try again.");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (loading) {
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
            <div className="stat bg-white rounded-lg shadow border-l-4 border-l-blue-400">
              <div className="stat-title text-gray-600">Published</div>
              <div className="stat-value text-blue-600">
                {stories.filter((s) => s.status === "published").length}
              </div>
            </div>
            <div className="stat bg-white rounded-lg shadow border-l-4 border-l-yellow-400">
              <div className="stat-title text-gray-600">Total Images</div>
              <div className="stat-value text-yellow-600">
                {stories.reduce(
                  (total, story) => total + story.images.length,
                  0
                )}
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Story Images */}
                <div className="relative h-48 bg-gray-200">
                  {story.images.length > 0 ? (
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
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-sm">No images</p>
                      </div>
                    </div>
                  )}
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
                      onClick={() => handleEdit(story.id)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-outline btn-error btn-sm flex-1"
                      onClick={() => handleDelete(story.id)}
                      disabled={deleteLoading === story.id}
                    >
                      {deleteLoading === story.id ? (
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
