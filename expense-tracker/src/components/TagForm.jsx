import { useState } from "react";
import { createTag } from "../services/tags";

export default function TagForm({ onTagCreated }) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#3B82F6"); // Default blue color
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim()) {
            alert("Please enter a tag name");
            return;
        }

        try {
            setLoading(true);
            await createTag({
                name: name.trim(),
                color: color,
            });

            // Clear form
            setName("");
            setColor("#3B82F6");

            // Notify parent
            if (onTagCreated) {
                onTagCreated();
            }
        } catch (err) {
            console.error("Error creating tag:", err);
            alert("Failed to create tag: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Create New Tag</h3>

            <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Tag name"
                    className="border p-2 rounded flex-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <div className="flex gap-2 items-center">
                    <label className="text-sm text-gray-600">Color:</label>
                    <input
                        type="color"
                        className="border p-1 rounded h-10 w-20"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Tag"}
                </button>
            </form>
        </div>
    );
}
