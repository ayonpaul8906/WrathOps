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
  Terminal,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const plans = [
  { name: "Free", price: "0", highlighted: false },
  { name: "Pro", price: "199", highlighted: true },
  { name: "Team", price: "Custom", highlighted: false },
];

export default function Dashboard() {
  const [repos, setRepos] = useState<any[]>([]);
  const [connected, setConnected] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [plan, setPlan] = useState("Free");

  const [deployLoading, setDeployLoading] = useState(false);
  const [deployLinks, setDeployLinks] = useState<any>(null);
  const [deployModal, setDeployModal] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deployGuides, setDeployGuides] = useState<any>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'vercel' | 'render' | 'docker' | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

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

  // 📋 Copy to clipboard helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleDeploy = async () => {
    if (!selectedRepo) return;

    setDeployLoading(true);
    setDeployError(null);

    const token = localStorage.getItem("github_token");

    try {
      const res = await fetch("http://localhost:5000/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl: selectedRepo.html_url,
          githubToken: token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeployError(data.error || "Deployment failed");
      } else {
        setDeployLinks(data.deploy);
        setPrUrl(data.prUrl || null);
        setDeployGuides(data.guides || null);
      }
    } catch (err: any) {
      console.error("Deploy error:", err);
      setDeployError("Could not connect to the backend server. Make sure it's running on port 5000.");
    }

    setDeployLoading(false);
  };

  return (
    <section className="min-h-screen bg-[#050506] text-white relative flex flex-col">
      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#0b0f1a_0%,#050506_60%)]" />
      <div className="fixed w-[800px] h-[800px] bg-[#5E6AD2]/20 blur-[150px] rounded-full top-[-200px] left-[20%] animate-[float_10s_ease-in-out_infinite] pointer-events-none" />
      <div className="fixed w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full bottom-[-100px] left-[30%] animate-[float_12s_ease-in-out_infinite] pointer-events-none" />

      {/* NAV */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-2xl bg-[#050506]/70">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
            <img src="/logo.png" className="h-10" alt="WrathOps Logo" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              WrathOps
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/ayonpaul8906/PhantomKey"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-[#5E6AD2] transition-colors"
              title="View Repository"
            >
              <Github className="w-5 h-5" />
            </a>

            <Button
              onClick={() => setOpenModal(true)}
              className="bg-[#5E6AD2] hover:bg-[#5E6AD2]/90 text-white shadow-lg shadow-[#5E6AD2]/20 transition-all hover:shadow-[#5E6AD2]/40"
            >
              Connect Repo
            </Button>

            {!isLoggedIn ? (
              <Button
                variant="outline"
                className="border-white/20 text-white bg-transparent hover:bg-white/10 transition-colors"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-white/20 text-gray-300 bg-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#050506]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="https://github.com/ayonpaul8906/PhantomKey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">GitHub Repository</span>
            </a>
            
            <Button
              className="w-full bg-[#5E6AD2] hover:bg-[#5E6AD2]/90 text-white shadow-lg shadow-[#5E6AD2]/20"
              onClick={() => {
                setOpenModal(true);
                setIsOpen(false);
              }}
            >
              Connect Repo
            </Button>

            {!isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full border-white/20 text-white bg-transparent hover:bg-white/10 transition-colors"
                onClick={() => {
                  router.push("/login");
                  setIsOpen(false);
                }}
              >
                Login
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full border-white/20 text-gray-300 bg-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
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
          {["overview", "issues", "analytics", "cli", "subscription", "settings"].map(
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
                {tab === "cli" ? "CLI Setup" : tab}
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

                    <div className="flex items-center gap-4 flex-wrap">
  <Badge className="bg-[#5E6AD2]/20 text-[#5E6AD2] border border-[#5E6AD2]/30">
    Auto Scan
  </Badge>

  {/* 🚀 DEPLOY BUTTON */}
  <button
    onClick={() => {
      setSelectedRepo(repo);
      setDeployModal(true);
      setDeployLinks(null);
      setPrUrl(null);
      setDeployError(null);
      setDeployGuides(null);
      setShowGuideModal(false);
      setSelectedProvider(null);
    }}
    className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-md hover:bg-green-500/30 transition"
  >
    🚀 Deploy
  </button>

  {/* ❌ Disconnect */}
  <button
    onClick={() => disconnectRepo(repo.full_name)}
    className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-md hover:bg-red-400/10"
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

        {/* CLI TAB (NEW) */}
        {activeTab === "cli" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Instructions Side */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#5E6AD2]/20 rounded-lg">
                    <Terminal className="text-[#5E6AD2] w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Local Secret Scanner</h2>
                </div>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Prevent API keys and credentials from ever leaving your machine. Install the WrathOps CLI to automatically hook into Git and scan your code before every commit.
                </p>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-3 text-white">
                      <span className="bg-[#5E6AD2] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-[0_0_10px_rgba(94,106,210,0.5)]">1</span>
                      Install the CLI globally
                    </h3>
                    <div className="bg-black/50 border border-white/10 p-4 rounded-lg flex justify-between items-center group">
                      <code className="font-mono text-sm text-[#A8B2FF] overflow-x-auto whitespace-nowrap scrollbar-hide">
                        pip install git+https://github.com/tulu-g559/WrathOps-cli.git
                      </code>
                      <button
                        onClick={() => handleCopy("pip install git+https://github.com/tulu-g559/WrathOps-cli.git")}
                        className="ml-4 p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                      >
                        {copiedText === "pip install git+https://github.com/tulu-g559/WrathOps-cli.git" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-3 text-white">
                      <span className="bg-[#5E6AD2] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-[0_0_10px_rgba(94,106,210,0.5)]">2</span>
                      Initialize in your local repo
                    </h3>
                    <div className="bg-black/50 border border-white/10 p-4 rounded-lg flex justify-between items-center group">
                      <code className="font-mono text-sm text-[#A8B2FF]">
                        wrathops install
                      </code>
                      <button
                        onClick={() => handleCopy("wrathops install")}
                        className="ml-4 p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                      >
                        {copiedText === "wrathops install" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-3 text-white">
                      <span className="bg-[#5E6AD2] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-[0_0_10px_rgba(94,106,210,0.5)]">3</span>
                      Commit safely
                    </h3>
                    <div className="bg-black/50 border border-white/10 p-4 rounded-lg flex justify-between items-start group">
                      <code className="font-mono text-sm text-[#A8B2FF] whitespace-pre">
                        git add .{"\n"}git commit -m "Initial commit"
                      </code>
                      <button
                        onClick={() => handleCopy("git add .\ngit commit -m \"Initial commit\"")}
                        className="ml-4 p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                      >
                        {copiedText === "git add .\ngit commit -m \"Initial commit\"" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Terminal Side */}
              <div className="h-full min-h-[400px] bg-[#0b0f1a] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
                <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="ml-4 text-xs text-gray-400 font-mono flex-1 text-center pr-8">~ bash - wrathops</span>
                </div>
                
                <div className="p-6 font-mono text-sm space-y-4 flex-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-green-400">~/project</span>$ git commit -m "Initial commit"
                  </div>
                  
                  <div className="animate-pulse text-blue-400 font-semibold flex items-center gap-2 mt-4">
                    🔍 WrathOps scanning...
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-red-400 font-bold">🚨 Secrets detected in .\app.py</p>
                    <div className="pl-4 mt-2 border-l-2 border-red-500/30 space-y-1">
                      <p className="text-gray-300">→ GOOGLE_API_KEY</p>
                      <p className="text-gray-300">→ GEMINI_API_KEY</p>
                      <p className="text-gray-300">→ FIREBASE_API_KEY</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-red-500 font-bold bg-red-500/10 inline-block px-3 py-1 rounded">
                      ❌ Commit blocked: secrets detected.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 mt-4 opacity-50">
                    <span className="text-green-400">~/project</span>$ <span className="w-2 h-4 bg-gray-400 animate-pulse"></span>
                  </div>
                </div>
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

      {deployModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0b0f1a] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">

            <h2 className="text-xl font-bold mb-4">
              🚀 Deploy {selectedRepo?.name}
            </h2>

            {/* Error Display */}
            {deployError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">❌ {deployError}</p>
              </div>
            )}

            {!deployLinks ? (
              <>
                <p className="text-gray-400 mb-4">
                  This will scan your repository, dynamically generate production-ready files (Dockerfile, Compose, Configs) via AI, and automatically push them as a PR to your repository.
                </p>

                <button
                  onClick={handleDeploy}
                  disabled={deployLoading}
                  className="w-full bg-[#5E6AD2] py-2.5 rounded-lg hover:bg-[#5E6AD2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {deployLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Preparing & Committing...
                    </span>
                  ) : (
                    "Prepare & Deploy"
                  )}
                </button>
              </>
            ) : (
              <>
                <p className="text-green-400 mb-3 font-medium">
                  ✅ Project Ready!
                </p>

                {prUrl && (
                  <a
                    href={prUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-[#5E6AD2] hover:text-[#5E6AD2]/80 mb-6 underline underline-offset-2"
                  >
                    📋 View Pull Request on GitHub
                  </a>
                )}

                <div className="space-y-4">
                  <p className="text-gray-400 text-sm mb-2">Select a deployment provider to view your custom guide:</p>
                  
                  <button
                    onClick={() => { setSelectedProvider('vercel'); setShowGuideModal(true); }}
                    className="w-full flex items-center justify-between text-left bg-black border border-white/10 p-5 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all group"
                  >
                    <span className="font-bold flex items-center gap-4 text-white text-lg">
                      <span className="text-2xl h-8 w-8 flex items-center justify-center bg-white/10 rounded-full">▲</span> Deploy via Vercel
                    </span>
                    <span className="text-[#5E6AD2] opacity-0 group-hover:opacity-100 transition-opacity font-medium">View Guide →</span>
                  </button>

                  <button
                    onClick={() => { setSelectedProvider('render'); setShowGuideModal(true); }}
                    className="w-full flex items-center justify-between text-left bg-black border border-white/10 p-5 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all group"
                  >
                    <span className="font-bold flex items-center gap-4 text-white text-lg">
                      <span className="text-2xl h-8 w-8 flex items-center justify-center bg-white/10 rounded-full">🚀</span> Deploy via Render
                    </span>
                    <span className="text-[#5E6AD2] opacity-0 group-hover:opacity-100 transition-opacity font-medium">View Guide →</span>
                  </button>
                  
                  <button
                    onClick={() => { setSelectedProvider('docker'); setShowGuideModal(true); }}
                    className="w-full flex items-center justify-between text-left bg-black border border-white/10 p-5 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all group"
                  >
                    <span className="font-bold flex items-center gap-4 text-white text-lg">
                      <span className="text-2xl h-8 w-8 flex items-center justify-center bg-[#2496ED]/20 text-[#2496ED] rounded-full">🐳</span> Deploy via Docker
                    </span>
                    <span className="text-[#5E6AD2] opacity-0 group-hover:opacity-100 transition-opacity font-medium">View Guide →</span>
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => setDeployModal(false)}
              className="mt-5 w-full text-sm text-gray-400 hover:text-white transition-colors py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showGuideModal && deployGuides && selectedProvider && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-[#0b0f1a] border border-white/10 rounded-2xl p-8 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#5E6AD2]/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 shrink-0 relative z-10">
              <h2 className="text-3xl font-bold capitalize text-white flex items-center gap-3">
                {selectedProvider === 'vercel' ? '▲' : selectedProvider === 'render' ? '🚀' : '🐳'}
                {selectedProvider} Setup Protocol
              </h2>
              <button onClick={() => setShowGuideModal(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2.5 rounded-xl hover:bg-white/10">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto pr-4 mb-8 custom-scrollbar flex-1 space-y-5 relative z-10">
               {deployGuides[selectedProvider]?.map((step: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl block relative overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-colors">
                     <div className="flex items-start gap-5">
                        <div className="bg-gradient-to-br from-[#5E6AD2] to-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 shadow-lg shadow-[#5E6AD2]/30 text-lg">
                           {idx + 1}
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                           <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">{step.description}</p>
                        </div>
                     </div>
                  </div>
               ))}
               
               {(!deployGuides[selectedProvider] || deployGuides[selectedProvider].length === 0) && (
                  <div className="text-center p-12 text-gray-500 border border-white/5 rounded-2xl bg-white/5">
                     <p className="text-lg">No custom steps generated for this provider.</p>
                  </div>
               )}
            </div>

            <div className="shrink-0 pt-6 border-t border-white/10 relative z-10">
              {selectedProvider === 'vercel' && (
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-white text-black py-4 rounded-xl hover:bg-gray-200 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-white/10"
                >
                  ▲ Launch on Vercel Context
                </a>
              )}
              {selectedProvider === 'render' && (
                <a
                  href="https://dashboard.render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-gradient-to-r from-[#5E6AD2] to-blue-500 text-white py-4 rounded-xl hover:opacity-90 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-[#5E6AD2]/20"
                >
                  🚀 Launch on Render Context
                </a>
              )}
              {selectedProvider === 'docker' && (
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="w-full text-center bg-[#2496ED] text-white py-4 rounded-xl hover:bg-[#2496ED]/90 transition-all font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-[#2496ED]/20"
                >
                  🐳 OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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