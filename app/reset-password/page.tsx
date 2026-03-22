"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import PasswordStrength from "@/components/PasswordStrength";

type ResetPasswordFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setServerError(json.error || "Reset failed. Ensure admin has approved your request.");
      }
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 premium-bg position-relative overflow-hidden">
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
          <h1 className="display-6 fw-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>Secure Reset</h1>
          <p className="text-white text-opacity-75 fs-5">Set your new access credentials</p>
        </div>

        <div className="glass-card-stitch p-4 p-md-5 rounded-4 mx-auto animate-slide-up delay-100" style={{ width: "100%", maxWidth: "440px" }}>
          {success ? (
            <div className="text-center py-4">
              <div className="mb-4 text-success"><i className="bi bi-check-circle-fill display-1"></i></div>
              <h3 className="text-white fw-bold mb-3">Password Updated</h3>
              <p className="text-white text-opacity-70">Your new credentials are active. Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4" noValidate>
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

              <div className="form-group">
                <label className="form-label text-white text-opacity-90 fw-semibold small mb-2 ms-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`form-control form-control-lg premium-input shadow-none py-3 px-4 rounded-3 focus-within-ring ${errors.password ? 'border-danger' : ''}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 12, message: "Password must be at least 12 characters" },
                    validate: {
                      hasUppercase: (v) => /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
                      hasLowercase: (v) => /[a-z]/.test(v) || "Must contain at least one lowercase letter",
                      hasNumber:    (v) => /[0-9]/.test(v) || "Must contain at least one number",
                      hasSpecial:   (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) || "Must contain at least one special character (!@#$%^&*)",
                    }
                  })}
                />
                {errors.password && <p className="text-danger small mt-1 ms-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.password.message}</p>}
                <PasswordStrength password={watch("password") || ""} />
              </div>

              <div className="form-group">
                <label className="form-label text-white text-opacity-90 fw-semibold small mb-2 ms-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`form-control form-control-lg premium-input shadow-none py-3 px-4 rounded-3 focus-within-ring 
                    ${errors.confirmPassword ? 'border-danger' : ''}
                    ${watch("confirmPassword") && watch("confirmPassword") === password ? 'border-success' : ''}`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val) => val === password || "Passwords do not match"
                  })}
                />
                {/* Live real-time match indicator */}
                {watch("confirmPassword") && (
                  watch("confirmPassword") === password
                    ? <p className="text-success small mt-1 ms-1"><i className="bi bi-check-circle-fill me-1"></i>Passwords match</p>
                    : <p className="text-danger small mt-1 ms-1"><i className="bi bi-x-circle-fill me-1"></i>Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-lg w-100 fw-bold mt-2 rounded-3 shadow-lg hover-float transition-all d-flex align-items-center justify-content-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)', border: 'none', color: 'white', padding: '14px' }}
              >
                {isLoading ? (
                  <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span><span>Updating...</span></>
                ) : (
                  <><span>Confirm New Password</span><i className="bi bi-check2-circle fs-5"></i></>
                )}
              </button>
            </form>
          )}
        </div>

        <Link href="/login" className="text-white text-opacity-60 text-decoration-none small mt-4 hover-opacity-100 transition-all d-flex align-items-center gap-2">
          <i className="bi bi-arrow-left"></i>Back to Sign In
        </Link>
      </main>
    </div>
  );
}
