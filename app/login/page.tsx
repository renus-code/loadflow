"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter valid credentials.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dashboard-soft">
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4">
        {/* LOGO & HDR */}
        <div className="text-center mb-4 animate-slide-up">
          <Link
            href="/"
            className="d-flex align-items-center justify-content-center gap-2 mb-4 text-decoration-none hover-tilt"
          >
            <div
              className="rounded overflow-hidden d-flex align-items-center justify-content-center shadow"
              style={{ width: "48px", height: "48px" }}
            >
              <img src="/truck-logo.png" alt="LoadFlow Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span className="fs-2 d-flex align-items-center" style={{ fontFamily: 'var(--font-syne)' }}>
              <span className="brand-text-load">Load</span><span className="brand-text-flow">Flow</span>
            </span>
          </Link>
          <h1
            className="fs-2 fw-bold text-dark mb-2"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Welcome back
          </h1>
          <p className="text-secondary">Sign in to your LoadFlow account</p>
        </div>

        {/* LOGIN CARD */}
        <div
          className="glass-card p-4 p-md-5 rounded-4 shrink-0 mx-auto animate-slide-up delay-100"
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            {error && (
              <div className="alert alert-danger py-2 small fw-medium">
                {error}
              </div>
            )}

            <div>
              <label className="form-label text-dark fw-medium small mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control form-control-lg bg-white bg-opacity-75 text-dark border-secondary border-opacity-25 shadow-sm"
              />
            </div>

            <div>
              <label className="form-label text-dark fw-medium small mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control form-control-lg bg-white bg-opacity-75 text-dark border-secondary border-opacity-25 shadow-sm"
              />
              <div className="text-end mt-2">
                <a
                  href="#"
                  className="text-decoration-none small fw-semibold text-secondary hover-zoom d-inline-block"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-dark btn-lg w-100 fw-bold mt-2 rounded-3 shadow hover-zoom text-white d-flex align-items-center justify-content-center gap-2"
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                  <span role="status">Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="text-center small text-secondary mt-4 pt-2">
          {"Don't have an account?"}{" "}
          <Link
            href="/register"
            className="text-dark fw-bold text-decoration-none hover-zoom d-inline-block"
          >
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
}
