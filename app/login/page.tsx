"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

// We extract the TruckIcon to keep the UI clean
const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      router.push("/dashboard");
    } else {
      alert("Please enter valid credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        
        {/* LOGO & HDR */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-[#0f172a]">
              <TruckIcon />
            </div>
            <span className="font-bold text-[#0f172a] text-2xl font-syne">
              LoadFlow
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2 font-syne">Welcome back</h1>
          <p className="text-slate-500">Sign in to your LoadFlow account</p>
        </div>

        {/* AUTH CARD */}
        <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block text-left">Email address</label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 block">Password</label>
                <a href="#" className="text-sm text-slate-500 hover:text-[#0f172a] font-medium transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-colors shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-3 rounded-xl shadow-sm transition-all mt-2"
            >
              Sign in
            </button>
          </form>

          {/* DIVIDER */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <span className="h-px bg-slate-100 flex-1"></span>
            <span className="text-sm text-slate-400">or continue with</span>
            <span className="h-px bg-slate-100 flex-1"></span>
          </div>

          <button className="w-full mt-6 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-3 rounded-xl shadow-sm transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          {"Don't have an account?"}{" "}
          <Link href="/register" className="text-[#0f172a] font-bold hover:underline">
            Create one
          </Link>
        </p>

      </main>
    </div>
  );
}
