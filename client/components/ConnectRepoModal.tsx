"use client";

import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

export default function ConnectRepoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [repos, setRepos] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [connected, setConnected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("github_token");
    const stored = localStorage.getItem("connected_repos");

    if (stored) setConnected(JSON.parse(stored));

    const fetchRepos = async () => {
      setLoading(true);

      try {
        const res = await fetch("https://api.github.com/user/repos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setRepos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [isOpen]);

  const toggleRepo = (name: string) => {
    if (connected.includes(name)) return; // 🚫 prevent selecting already connected

    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((r) => r !== name)
        : [...prev, name]
    );
  };

  const handleConnect = () => {
    const updated = [...connected, ...selected];
    localStorage.setItem("connected_repos", JSON.stringify(updated));
    setSelected([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-2xl mx-4">

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-2xl rounded-3xl" />

        <div className="relative bg-[#0B0F14]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">
                Connect Repositories
              </h2>
              <p className="text-xs text-gray-400">
                Select repositories to enable auto security monitoring
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* LIST */}
          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">

            {loading ? (
              <p className="text-gray-400 text-sm">Loading repositories...</p>
            ) : repos.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No repositories found
              </p>
            ) : (
              repos.map((repo) => {
                const isConnected = connected.includes(repo.full_name);
                const isSelected = selected.includes(repo.full_name);

                return (
                  <div
                    key={repo.id}
                    onClick={() => toggleRepo(repo.full_name)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex justify-between items-center
                      
                      ${
                        isConnected
                          ? "bg-green-500/5 border-green-500/20 cursor-not-allowed opacity-60"
                          : isSelected
                          ? "border-cyan-400 bg-cyan-500/10"
                          : "bg-[#05070A] border-white/5 hover:border-white/20"
                      }
                    `}
                  >
                    <div>
                      <p className="font-medium">{repo.name}</p>
                      <p className="text-xs text-gray-400">
                        {repo.full_name}
                      </p>
                    </div>

                    {/* STATUS */}
                    {isConnected ? (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Connected
                      </span>
                    ) : isSelected ? (
                      <span className="text-xs text-cyan-400">
                        Selected
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">
                        Click to select
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center mt-6">

            <p className="text-xs text-gray-400">
              {selected.length} selected
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="text-gray-400 text-sm"
              >
                Cancel
              </button>

              <button
                disabled={selected.length === 0}
                onClick={handleConnect}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                Connect
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}