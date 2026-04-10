"use client";

import { useEffect, useState } from "react";
import ConnectRepoModal from "@/components/ConnectRepoModal";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  GitPullRequest,
  Shield,
  Clock,
  TrendingUp,
  X,
  AlertCircle,
  Github,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const plans = [
  { name: "Free", price: "0", highlighted: false },
  { name: "Pro", price: "29", highlighted: true },
  { name: "Team", price: "Custom", highlighted: false },
];

export default function Dashboard() {
  const [repos, setRepos] = useState<any[]>([]);
  const [connected, setConnected] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [plan, setPlan] = useState("Free");

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  // 🔐 Check login state & fetch data
  useEffect(() => {
    const token = localStorage.getItem("github_token");
    setIsLoggedIn(!!token);

    const stored = localStorage.getItem("connected_repos");
    if (stored) setConnected(JSON.parse(stored));

    const savedPlan = localStorage.getItem("plan");
    if (savedPlan) setPlan(savedPlan);

    if (token) {
      fetch("https://api.github.com/user/repos", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setRepos(data);
        })
        .catch((err) => console.error("Error fetching repos:", err));
    }
  }, []);

  // 🔓 Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/");
  };

  const disconnectRepo = (name: string) => {
    const updated = connected.filter((r) => r !== name);
    setConnected(updated);
    localStorage.setItem("connected_repos", JSON.stringify(updated));
  };

  const filteredRepos = repos.filter((r) =>
    connected.includes(r.full_name)
  );

  const selectPlan = (name: string) => {
    setPlan(name);
    localStorage.setItem("plan", name);
  };

  return (
    <section className="min-h-screen bg-[#050506] text-white relative flex flex-col">
      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#0b0f1a_0%,#050506_60%)]" />
      <div className="fixed w-[800px] h-[800px] bg-[#5E6AD2]/20 blur-[150px] rounded-full top-[-200px] left-[20%] animate-[float_10s_ease-in-out_infinite] pointer-events-none" />
      <div className="fixed w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full bottom-[-100px] left-[30%] animate-[float_12s_ease-in-out_infinite] pointer-events-none" />

      {/* NAV */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-[#050506]/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" className="h-10" alt="WrathOps Logo" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              WrathOps
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/ayonpaul8906/PhantomKey"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>

            <Button
              onClick={() => setOpenModal(true)}
              className="bg-[#5E6AD2] hover:bg-[#5E6AD2]/90 text-white"
            >
              Connect Repo
            </Button>

            {!isLoggedIn ? (
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-red"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0b0f1a] border-b border-white/10 px-6 py-4 space-y-4 shadow-xl z-40">
            <a
              href="https://github.com/ayonpaul8906/PhantomKey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            
            <Button
              className="w-full bg-[#5E6AD2] hover:bg-[#5E6AD2]/90 text-white"
              onClick={() => setOpenModal(true)}
            >
              Connect Repo
            </Button>

            {!isLoggedIn ? (
              <Button
                className="w-full border border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            ) : (
              <Button
                className="w-full border border-white/20 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        )}
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 z-10">
        
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Security Dashboard
          </h1>
          <p className="text-[#8A8F98] mt-2">
            WrathOps is actively protecting your code and repositories.
          </p>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["overview", "issues", "analytics", "subscription", "settings"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
                  activeTab === tab
                    ? "bg-[#5E6AD2] text-white shadow-lg shadow-[#5E6AD2]/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, label: "Issues Fixed", value: "47" },
                { icon: Clock, label: "Avg Fix Time", value: "12m" },
                { icon: GitPullRequest, label: "PRs", value: "34" },
                { icon: TrendingUp, label: "Growth", value: "+12" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xl hover:bg-white/10 transition-colors"
                  >
                    <Icon className="text-[#5E6AD2] mb-2" />
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className="text-xl font-bold">{s.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Repositories */}
            <div>
              <h3 className="mb-4 font-semibold text-lg">Connected Repositories</h3>
              {filteredRepos.length === 0 ? (
                <p className="text-sm text-gray-400">No repositories connected yet.</p>
              ) : (
                filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-white">{repo.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {repo.full_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className="bg-[#5E6AD2]/20 text-[#5E6AD2] border border-[#5E6AD2]/30 hover:bg-[#5E6AD2]/30">
                        Auto Scan
                      </Badge>
                      <button
                        onClick={() => disconnectRepo(repo.full_name)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-md hover:bg-red-400/10"
                        title="Disconnect Repository"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ISSUES TAB */}
        {activeTab === "issues" && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-auto">
            <h4 className="text-lg font-bold mb-6">Detected Issues</h4>
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left pb-4 font-medium">File</th>
                  <th className="text-left pb-4 font-medium">Type</th>
                  <th className="text-left pb-4 font-medium">Severity</th>
                  <th className="text-left pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { file: "config.js", type: "API Key", severity: "high" },
                  { file: ".env", type: "Password", severity: "critical" },
                ].map((issue, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 text-white">{issue.file}</td>
                    <td className="py-4 text-gray-300">{issue.type}</td>
                    <td className="py-4">
                      <Badge className={`${issue.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}`}>
                        {issue.severity}
                      </Badge>
                    </td>
                    <td className="py-4 text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Fixed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Issues Over Time */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                <h4 className="font-bold mb-6">Issues Detected (Last 30 Days)</h4>
                <div className="h-40 flex items-end justify-between gap-2">
                  {[12, 15, 8, 14, 11, 18, 9, 16, 13, 7, 19, 14].map((val, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#5E6AD2] to-blue-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                      style={{ height: `${(val / 20) * 100}%` }}
                      title={`Day ${i + 1}: ${val} issues`}
                    />
                  ))}
                </div>
              </div>

              {/* Fix Rate */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
                <h4 className="font-bold mb-6">Fix Success Rate</h4>
                <div className="flex items-center justify-center h-40">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-white/10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={`${251.2 * 0.98} 251.2`}
                        className="text-[#5E6AD2] transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">98%</span>
                      <span className="text-xs text-gray-400">Fixed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Vulnerabilities */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
              <h4 className="font-bold mb-6">Top Vulnerability Types</h4>
              <div className="space-y-4">
                {[
                  { type: "API Keys", count: 18, percentage: 38 },
                  { type: "Database Passwords", count: 12, percentage: 26 },
                  { type: "AWS Credentials", count: 11, percentage: 23 },
                  { type: "Auth Tokens", count: 6, percentage: 13 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.type}</span>
                      <span className="text-gray-400">{item.count} detected</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#5E6AD2] to-blue-400 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBSCRIPTION TAB */}
        {activeTab === "subscription" && (
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {plans.map((p) => (
              <div
                key={p.name}
                onClick={() => selectPlan(p.name)}
                className={`cursor-pointer p-6 rounded-2xl border backdrop-blur-xl transition hover:scale-[1.02] ${
                  plan === p.name
                    ? "border-[#5E6AD2] bg-[#5E6AD2]/10 shadow-[0_0_30px_rgba(94,106,210,0.15)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <h3 className="text-xl font-semibold text-white">{p.name}</h3>
                <p className="text-3xl mt-2 font-bold text-white">Rs {p.price}</p>
                <p className="text-sm text-gray-400 mt-1">per user / month</p>

                {plan === p.name && (
                  <Badge className="mt-6 bg-green-500/20 text-green-400 border border-green-500/30">
                    Active Plan
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-xl">
              <h4 className="text-lg font-bold mb-4">Account Settings</h4>
              <p className="text-sm text-gray-400 mb-2">Current Subscription</p>
              <Badge className="bg-[#5E6AD2]/20 text-[#5E6AD2] border border-[#5E6AD2]/30 px-3 py-1 text-sm">
                {plan} Plan
              </Badge>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-xl">
               <h4 className="text-lg font-bold mb-4">Manage Connections</h4>
               {connected.length === 0 ? (
                 <p className="text-sm text-gray-400">No active connections.</p>
               ) : (
                 <div className="space-y-3">
                   {connected.map((repo) => (
                     <div
                       key={repo}
                       className="flex items-center justify-between p-4 border border-white/10 bg-white/5 rounded-lg"
                     >
                       <span className="font-medium">{repo}</span>
                       <Button
                         variant="ghost"
                         onClick={() => disconnectRepo(repo)}
                         className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                       >
                         Disconnect
                       </Button>
                     </div>
                   ))}
                 </div>
               )}
            </div>
            
          </div>
        )}
      </div>

      <ConnectRepoModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConnect={(repos) => {
          const updated = [...connected, ...repos];
          setConnected(updated);
          localStorage.setItem("connected_repos", JSON.stringify(updated));
        }}
        connectedRepos={connected}
      />
    </section>
  );
}