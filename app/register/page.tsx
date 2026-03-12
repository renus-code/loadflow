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

export default function Register() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (email && password) {
      router.push("/dashboard");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        
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
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2 font-syne">Create your account</h1>
          <p className="text-slate-500">Start managing loads in minutes</p>
        </div>

        {/* AUTH CARD */}
        <div className="bg-white max-w-[500px] w-full rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 block text-left">Full name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-colors shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 block text-left">Company</label>
                <input
                  type="text"
                  placeholder="Acme Freight"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-colors shadow-sm"
                />
              </div>
            </div>

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
              <label className="text-sm font-medium text-slate-700 block">Password</label>
              <input
                type="password"
                required
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-colors shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">Confirm password</label>
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 transition-colors shadow-sm"
              />
            </div>

            <p className="text-[13px] text-slate-400 leading-relaxed pt-2">
              By creating an account, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
            </p>

            <button
              type="submit"
              className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-3 rounded-xl shadow-sm transition-all mt-2"
            >
              Create account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          {"Already have an account?"}{" "}
          <Link href="/login" className="text-[#0f172a] font-bold hover:underline">
            Sign in
          </Link>
        </p>

      </main>
    </div>
  );
}
