"use client";

import { useRouter } from "next/navigation";
import { githubLogin } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await githubLogin();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // 🔥 typing animation
  const text = "Scanning repositories for secrets...";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#050506] text-[#EDEDEF] overflow-hidden">

      {/* 🔵 LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative flex-col justify-center px-16">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0b0f1a_0%,#050506_60%,#020203_100%)]" />

        {/* Animated blobs */}
        <div className="absolute w-[800px] h-[800px] bg-[#5E6AD2]/20 blur-[150px] rounded-full top-[-200px] left-[20%] animate-[float_10s_ease-in-out_infinite]" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full bottom-[-100px] left-[30%] animate-[float_12s_ease-in-out_infinite]" />

        {/* Content */}
        <div className="relative z-10 max-w-xl">

          <h1 className="text-5xl font-semibold leading-tight mb-6
            bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Automate DevOps.  
            Secure Code Instantly.
          </h1>

          <p className="text-lg text-[#8A8F98] mb-8">
            WrathOps scans, detects, and fixes vulnerabilities in real time.
          </p>

          {/* 🔥 fake dashboard */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0c]
            p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

            <p className="text-xs text-green-400 mb-2">
              ● Live Scan Running
            </p>

            <p className="text-sm font-mono text-[#8A8F98]">
              {displayText}
            </p>

            <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#5E6AD2] animate-pulse w-[70%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 🧊 RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative h-14 w-14 rounded-xl flex items-center justify-center
              bg-[#5E6AD2]/20 border border-[#5E6AD2]/30
              shadow-[0_0_30px_rgba(94,106,210,0.5)]">

              {/* rotating ring */}
              <div className="absolute inset-0 rounded-xl border border-[#5E6AD2]/40 animate-spin" />

              <span className="text-xl font-semibold text-[#5E6AD2]">W</span>
            </div>
          </div>

          {/* Card */}
          <div className="relative rounded-2xl border border-white/[0.06]
            bg-white/[0.03] backdrop-blur-xl p-8
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            transition-all duration-300 hover:scale-[1.02]">

            {/* hover glow */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition
              bg-[radial-gradient(circle_at_center,rgba(94,106,210,0.15),transparent_60%)] rounded-2xl" />

            <h2 className="text-xl font-semibold mb-2 text-center">
              Welcome back
            </h2>

            <p className="text-sm text-[#8A8F98] mb-6 text-center">
              Connect your GitHub to continue
            </p>

            {/* Button */}
            <button
              onClick={handleLogin}
              className="relative w-full h-11 rounded-lg text-sm font-medium overflow-hidden
              bg-[#5E6AD2] hover:bg-[#6872D9]
              transition-all duration-200
              shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_6px_20px_rgba(94,106,210,0.4)]
              active:scale-[0.97]">

              {/* shine */}
              <span className="absolute inset-0 opacity-0 hover:opacity-100 transition
                bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full" />

              Continue with GitHub
            </button>
          </div>

          <p className="text-xs text-[#8A8F98] mt-6 text-center">
            Requires repository access for scanning and fixes
          </p>
        </div>
      </div>
    </div>
  );
}