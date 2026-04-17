"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setMessage("");
    setServerError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage(json.message);
      } else {
        setServerError(json.error || "An error occurred");
      }
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-resilient premium-bg position-relative overflow-hidden">
      {/* Fixed background layer */}
      <div className="position-fixed top-0 start-0 w-100 h-100 z-0">
        <Image
          src="/premium_logistics_bg.webp"
          alt="Background"
          fill
          priority
          className="object-fit-cover"
          quality={75}
        />
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ background: 'linear-gradient(rgba(10, 20, 42, 0.9), rgba(10, 20, 42, 0.8))' }}
        ></div>
      </div>

      <div className="glow-orb glow-emerald" style={{ top: '10%', left: '-5%' }}></div>
      <div className="glow-orb glow-indigo" style={{ bottom: '20%', right: '-10%' }}></div>

      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 z-1">
        <div className="text-center mb-5 animate-slide-up">
          <Link href="/" className="d-flex align-items-center justify-content-center gap-3 mb-4 text-decoration-none hover-tilt">
            <div className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center shadow-lg border border-white border-opacity-20" style={{ width: "60px", height: "60px", background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <img src="/truck-logo.png" alt="LoadFlow Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            </div>
            <span className="fs-1 d-flex align-items-center" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.03em' }}>
              <span className="brand-text-load">Load</span><span className="brand-text-flow">Flow</span>
            </span>
          </Link>
          <h1 className="display-6 fw-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>Reset Request</h1>
          <p className="text-white text-opacity-75 fs-5">Submit your email for administrator approval</p>
        </div>

        <div className="glass-card-stitch p-4 p-md-5 rounded-4 mx-auto animate-slide-up delay-100" style={{ width: "100%", maxWidth: "440px" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4" noValidate>
            {message && (
              <div className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-20 text-success py-3 small fw-medium">
                <i className="bi bi-check-circle-fill me-2"></i>{message}
                <div className="mt-3 pt-2 border-top border-success border-opacity-20">
                  <p className="mb-2 text-white text-opacity-70 small">Once the admin approves your request, you can set a new password:</p>
                  <a href="/reset-password" className="btn btn-sm fw-bold rounded-3 text-white" style={{ background: 'rgba(43, 221, 102, 0.2)', border: '1px solid rgba(43, 221, 102, 0.3)' }}>
                    <i className="bi bi-shield-lock-fill me-2"></i>Go to Reset Password
                  </a>
                </div>
              </div>
            )}
            {serverError && (
              <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger py-3 small fw-medium">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>{serverError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label text-white text-opacity-90 fw-semibold small mb-2 ms-1">Registered Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                className={`form-control form-control-lg premium-input shadow-none py-3 px-4 rounded-3 focus-within-ring ${errors.email ? 'border-danger' : ''}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" }
                })}
              />
              {errors.email && <p className="text-danger small mt-1 ms-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !!message}
              className="btn btn-lg w-100 fw-bold mt-2 rounded-3 shadow-lg hover-float transition-all d-flex align-items-center justify-content-center gap-2"
              style={{ background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)', border: 'none', color: 'white', padding: '14px' }}
            >
              {isLoading ? (
                <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span><span>Sending Request...</span></>
              ) : (
                <><span>Request Reset Approval</span><i className="bi bi-shield-lock-fill fs-5"></i></>
              )}
            </button>
          </form>
        </div>

        <Link href="/login" className="text-white text-opacity-60 text-decoration-none small mt-4 hover-opacity-100 transition-all d-flex align-items-center gap-2">
          <i className="bi bi-arrow-left"></i>Back to Sign In
        </Link>
      </main>
    </div>
  );
}
