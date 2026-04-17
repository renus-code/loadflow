"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

type LoginFormData = {
  email: string;
  password: string;
  code?: string;
};

export default function Login() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const fetchUser = useAuth((state) => state.fetchUser);

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    setIsLocked(false);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.locked) {
          setIsLocked(true);
        } else {
          setServerError(json.error || "Invalid credentials");
        }
      } else if (json.requires2FA) {
        setRequires2FA(true);
      } else {
        await fetchUser(); // Ensure global state is updated before navigation
        router.refresh(); // Clear previous cache for '/'
        router.push("/dashboard");
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
          <h1 className="display-6 fw-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>Welcome Back</h1>
          <p className="text-white text-opacity-75 fs-5">Sign in to your secure command center</p>
        </div>

        <div className="glass-card-stitch p-4 p-md-5 rounded-4 mx-auto animate-slide-up delay-100" style={{ width: "100%", maxWidth: "440px" }}>
          {isLocked ? (
            /* ── LOCKED ACCOUNT SCREEN ─────────────────────────────────────── */
            <div className="text-center py-3 animate-fade-in">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: 72, height: 72, background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.3)' }}>
                  <i className="bi bi-lock-fill text-danger" style={{ fontSize: '2rem' }}></i>
                </div>
                <h3 className="text-white fw-bold mb-2" style={{ fontFamily: 'var(--font-syne)' }}>Account Locked</h3>
                <p className="text-white text-opacity-70 small mb-4">
                  Too many failed login attempts. Your account has been frozen for security.
                  Please contact an administrator to unlock it, or submit a password reset request.
                </p>
              </div>
              <div className="d-flex flex-column gap-3">
                <Link
                  href="/forgot-password"
                  className="btn btn-lg w-100 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--accent-orange) 0%, #ff6b00 100%)', border: 'none', color: 'white', padding: '14px' }}
                >
                  <i className="bi bi-key-fill"></i> Request Password Reset
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-light btn-lg w-100 fw-bold rounded-3"
                  onClick={() => setIsLocked(false)}
                >
                  <i className="bi bi-arrow-left me-2"></i>Try Again
                </button>
              </div>
              <p className="text-white text-opacity-40 small mt-4">
                <i className="bi bi-info-circle me-1"></i>
                An admin can unlock your account from the User Management panel.
              </p>
            </div>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-4" noValidate>
            {serverError && (
              <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger py-3 small fw-medium">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>{serverError}
              </div>
            )}

            {requires2FA ? (
              <div className="form-group text-center animate-fade-in">
                <div className="mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ width: 64, height: 64, background: 'rgba(255,107,0,0.15)', border: '2px solid rgba(255,107,0,0.3)' }}>
                    <i className="bi bi-shield-lock-fill" style={{ fontSize: '1.8rem', color: 'var(--accent-orange)' }}></i>
                  </div>
                  <h3 className="text-white fw-bold mb-2" style={{ fontFamily: 'var(--font-syne)' }}>Two-Factor Auth</h3>
                  <p className="text-white text-opacity-70 small">Enter the 6-digit code from your authenticator app.</p>
                </div>
                
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000 000"
                  className={`form-control form-control-lg premium-input shadow-none py-3 text-center fs-3 letter-spacing-2 mx-auto mb-2 ${errors.code ? 'border-danger' : ''}`}
                  style={{ width: '220px', letterSpacing: '0.25em' }}
                  {...register("code", { required: "2FA code is required", pattern: { value: /^[0-9]{6}$/, message: "Must be 6 digits" } })}
                />
                {errors.code && <p className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.code.message}</p>}
                
                {/* Hidden fields to preserve email/password for the second submission */}
                <input type="hidden" {...register("email")} />
                <input type="hidden" {...register("password")} />
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-lg w-100 fw-bold mt-4 rounded-3 shadow-lg hover-float transition-all d-flex align-items-center justify-content-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--accent-orange) 0%, #ff6b00 100%)', border: 'none', color: 'white', padding: '14px' }}
                >
                  {isLoading ? (
                    <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Verifying...</span></>
                  ) : (
                    <><span>Verify Code</span><i className="bi bi-check-circle"></i></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRequires2FA(false)}
                  className="btn btn-link text-white text-opacity-50 text-decoration-none small mt-3 hover-glow-orange"
                >
                  <i className="bi bi-arrow-left me-1"></i> Back to login
                </button>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label text-white text-opacity-90 fw-semibold small mb-2 ms-1">Email Address</label>
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label text-white text-opacity-90 fw-semibold small mb-0 ms-1">Secure Password</label>
                    <Link href="/forgot-password" className="text-decoration-none small fw-medium hover-zoom transition-all" style={{ color: 'var(--accent-orange)' }}>
                      Forgot access?
                    </Link>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`form-control form-control-lg premium-input shadow-none py-3 px-4 rounded-3 focus-within-ring ${errors.password ? 'border-danger' : ''}`}
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && <p className="text-danger small mt-1 ms-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.password.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-lg w-100 fw-bold mt-2 rounded-3 shadow-lg hover-float transition-all d-flex align-items-center justify-content-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--accent-orange) 0%, #ff6b00 100%)', border: 'none', color: 'white', padding: '14px' }}
                >
                  {isLoading ? (
                    <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span><span role="status">Authenticating...</span></>
                  ) : (
                    <><span>Sign In to Dashboard</span><i className="bi bi-arrow-right fs-5"></i></>
                  )}
                </button>
              </>
            )}
          </form>
          )}
        </div>

        <p className="text-center small text-white text-opacity-60 mt-5 pt-2 animate-fade-in delay-300">
          {"New to the fleet?"}{" "}
          <Link href="/register" className="text-white fw-bold text-decoration-none hover-glow-orange border-bottom border-white border-opacity-25 pb-1 ms-1">
            Create Your Account
          </Link>
        </p>
      </main>

      <style jsx>{`
        .hover-glow-orange:hover {
          color: var(--accent-orange) !important;
          border-color: var(--accent-orange) !important;
          text-shadow: 0 0 10px rgba(255, 140, 0, 0.4);
        }
      `}</style>
    </div>
  );
}
