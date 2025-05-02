// components/CreateModal.js

import { useState } from "react";

export default function CreateModal({ onClose, onCreated }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/workspaces/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl, workspaceName }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error || "Failed to create");

    onCreated(data.workspace); // send workspace back to parent
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Create Workspace</h2>

        <input
          type="text"
          placeholder="GitHub Repo URL"
          className="w-full border px-3 py-2 rounded"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Workspace Name"
          className="w-full border px-3 py-2 rounded"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-1 bg-gray-300 rounded">Cancel</button>
          <button
            onClick={handleCreate}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
