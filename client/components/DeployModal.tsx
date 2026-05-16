// components/DeployModal.tsx

import { useState } from "react";

export default function DeployModal({ repoUrl, onClose }) {
  const [loading, setLoading] = useState(false);

  const handlePrepare = async () => {
    setLoading(true);

    await fetch("/api/prepare-production", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoUrl }),
    });

    setLoading(false);
  };

  const deployToVercel = () => {
    window.open(
      `https://vercel.com/new/clone?repository-url=${repoUrl}`,
      "_blank"
    );
  };

  const deployToRender = () => {
    window.open(
      "https://dashboard.render.com/select-repo",
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl w-[400px]">
        
        <h2 className="text-xl font-semibold mb-4">
          🚀 Deploy Your Project
        </h2>

        <p className="text-gray-600 mb-4">
          We will prepare your project for deployment.
        </p>

        <button
          onClick={handlePrepare}
          className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Preparing..." : "Prepare Project"}
        </button>

        <div className="border-t pt-4">
          <p className="mb-2 text-sm text-gray-500">
            Choose platform:
          </p>

          <button
            onClick={deployToVercel}
            className="w-full mb-2 px-4 py-2 bg-black text-white rounded-lg"
          >
            Deploy to Vercel
          </button>

          <button
            onClick={deployToRender}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Deploy to Render
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}