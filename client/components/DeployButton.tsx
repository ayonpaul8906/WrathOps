// components/DeployButton.tsx

import { useState } from "react";
import DeployModal from "./DeployModal";

export default function DeployButton({ repoUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        🚀 Deploy
      </button>

      {open && (
        <DeployModal
          repoUrl={repoUrl}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}