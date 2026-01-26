import { useState, useEffect } from "react";
import { getTags, deleteTag } from "../services/tags";
import TagForm from "../components/TagForm";

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      setLoading(true);
      const data = await getTags();
      setTags(data || []);
    } catch (err) {
      console.error("Error fetching tags:", err);
      alert("Failed to fetch tags: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(tagId) {
    try {
      setDeleting(true);
      await deleteTag(tagId);
      setDeleteConfirm(null);
      fetchTags(); // Refresh list
    } catch (err) {
      console.error("Error deleting tag:", err);
      alert(err.message || "Failed to delete tag");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tag Management</h2>
        <p className="text-gray-600">Create and manage expense categories</p>
      </div>

      <TagForm onTagCreated={fetchTags} />

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">All Tags</h3>

        {loading ? (
          <p className="text-gray-500">Loading tags...</p>
        ) : tags.length === 0 ? (
          <p className="text-gray-500">No tags created yet. Create your first tag above!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="border rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="font-medium">{tag.name}</span>
                </div>

                <button
                  className="text-red-600 text-sm hover:underline"
                  onClick={() => setDeleteConfirm(tag)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Tag</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the tag{" "}
              <span className="font-semibold" style={{ color: deleteConfirm.color }}>
                {deleteConfirm.name}
              </span>
              ?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Note: You cannot delete a tag if it's being used by any expenses.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
