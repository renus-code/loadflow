"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NotFound() {
  const user = useAuth((state) => state.user);
  const isLoading = useAuth((state) => state.isLoading);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const buttonHref = user ? "/dashboard" : "/";
  const buttonText = user ? "Return to Dashboard" : "Return Home";
  const buttonIcon = user ? "bi-speedometer2" : "bi-house";

  return (
    <div className="min-vh-100 position-relative overflow-hidden d-flex flex-column align-items-center justify-content-center bg-dark">
      {/* ─── HYPER-PREMIUM KINETIC BACKGROUND ────────────────────────────────── */}
      <div className="position-absolute top-0 start-0 w-100 h-100 mesh-gradient-premium opacity-50 z-0"></div>

      {/* Floating Nebula Orbs */}
      <div
        className="glow-orb glow-indigo top-0 start-0 animate-pulse-subtle"
        style={{
          transform: "translate(-20%, -20%)",
          width: "600px",
          height: "600px",
        }}
      ></div>
      <div
        className="glow-orb glow-emerald bottom-0 end-0 animate-pulse-subtle"
        style={{
          transform: "translate(30%, 30%)",
          width: "500px",
          height: "500px",
          animationDelay: "1s",
        }}
      ></div>
      <div
        className="glow-orb glow-purple top-50 start-50 translate-middle opacity-10"
        style={{ width: "800px", height: "800px" }}
      ></div>

      {/* Drifting Cargo Particles (SVG) - Rendered only on client to prevent hydration mismatch */}
      {mounted && (
        <div className="position-absolute w-100 h-100 z-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <svg
              key={i}
              className="position-absolute animate-float opacity-10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 40}px`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1"
            >
              <path d="M21 8l-9-4-9 4v8l9 4 9-4V8z" />
              <path d="M3 8l9 4 9-4" />
              <path d="M12 12v8" />
            </svg>
          ))}
        </div>
      )}

      {/* ─── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <div className="container position-relative z-1 py-5">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-md-10 col-lg-8 animate-fade-in">
            
            {/* Branding Anchor */}
            <div className="mb-5 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <span className="brand-text-load fs-2">Load</span>
              <span className="brand-text-flow fs-2">Flow</span>
            </div>

            {/* BOLD GRADIENT 404 */}
            <div className="position-relative mb-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <h1
                className="display-1 fw-black m-0 text-gradient-indigo animate-pulse-subtle"
                style={{
                  fontSize: "clamp(10rem, 25vw, 15rem)",
                  fontFamily: "var(--font-heading)",
                  letterSpacing: "-0.06em",
                  position: "relative",
                  lineHeight: "0.8",
                  filter: "drop-shadow(0 20px 40px rgba(99, 102, 241, 0.4))",
                }}
              >
                404
              </h1>
            </div>

            {/* ERROR CARD: PRE-STITCHED GLASS */}
            <div 
              className="glass-card-stitch p-4 p-md-5 rounded-5 animate-slide-up shadow-2xl overflow-hidden glass-wash"
              style={{ animationDelay: "400ms" }}
            >
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-danger bg-opacity-10 border border-danger border-opacity-20 mb-4">
                <span className="bg-danger rounded-circle animate-pulse" style={{ width: "8px", height: "8px" }}></span>
                <span className="text-danger fw-bold text-uppercase small tracking-widest" style={{ fontSize: "0.7rem" }}>
                  Load Status: Missing
                </span>
              </div>

              <h2
                className="display-5 fw-bold text-white mb-3"
                style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
              >
                Lost in <span className="text-gradient-emerald">Transit.</span>
              </h2>
              <p className="lead text-white text-opacity-70 mb-5 max-w-500 mx-auto fw-medium">
                The manifest record for this destination has been lost. 
                Our dispatchers are currently rerouting or simply can't find this cargo.
              </p>

              {/* DYNAMIC ACTION BUTTON */}
              <div className="d-flex justify-content-center mt-2">
                {isLoading ? (
                  <div
                    className="btn btn-lg fw-bold px-5 py-3 rounded-4 border-white border-opacity-10 text-white opacity-40 animate-pulse"
                    style={{ fontSize: "1.1rem" }}
                  >
                    Identifying cargo...
                  </div>
                ) : (
                  <Link
                    href={buttonHref}
                    className="btn btn-lg fw-black px-5 py-3 rounded-4 shadow-success-glow border-0 hover-zoom d-flex align-items-center justify-content-center gap-3 glass-wash transition-all"
                    style={{
                      backgroundColor: "#2bdd66",
                      color: "#05070a",
                      fontSize: "1.15rem",
                      boxShadow: "0 10px 40px rgba(43, 221, 102, 0.4)",
                    }}
                  >
                    <i className={`bi ${buttonIcon} fs-4`}></i>
                    {buttonText}
                  </Link>
                )}
              </div>
            </div>

            {/* SUBTLE FOOTER TAGLINE */}
            <div className="mt-5 animate-slide-up opacity-30" style={{ animationDelay: "600ms" }}>
              <p className="small text-white text-uppercase tracking-widest fw-bold">
                Precision. Power. Performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Micro-Texture */}
      <div className="position-absolute w-100 h-100 top-0 start-0 pointer-events-none opacity-05" style={{ 
        backgroundImage: "radial-gradient(#fff 0.5px, transparent 0.5px)", 
        backgroundSize: "20px 20px" 
      }}></div>
    </div>
  );
}
