"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg position-fixed w-100 z-3 ${isScrolled ? "shadow-sm" : ""}`}
      style={{ 
        top: 0, 
        transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.9)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        paddingTop: isScrolled ? "0.8rem" : "1.8rem",
        paddingBottom: isScrolled ? "0.8rem" : "1.8rem",
      }}
    >
      <div className="container-fluid px-3">
        {/* LOGO */}
        <Link
          href="/"
          className="navbar-brand d-flex align-items-center gap-2 hover-tilt"
        >
          <div
            className="rounded overflow-hidden d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: "40px", height: "40px" }}
          >
            <Image
              src="/truck-logo.png"
              alt="LoadFlow Logo"
              width={40}
              height={40}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <span
            className="fs-3 d-flex align-items-center transition-all"
            style={{ 
              fontFamily: "var(--font-syne)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <span 
              className="brand-text-load"
              style={{ 
                filter: isScrolled ? "brightness(0.8) contrast(1.2)" : "none",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              Load
            </span>
            <span 
              className="brand-text-flow"
              style={{ 
                filter: isScrolled ? "saturate(1.4) drop-shadow(0 0 8px rgba(43,221,102,0.2))" : "none",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              Flow
            </span>
          </span>
        </Link>

        {/* Navbar Toggler for mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon navbar-dark"></span>
        </button>

        {/* CENTER LINKS & ACTION BUTTONS */}
        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto gap-1 gap-lg-3">
            <li className="nav-item">
              <Link
                href="/#features"
                className={`nav-link fw-bold px-4 py-2 nav-pill-hover ${isScrolled ? "nav-link-dark" : "nav-link-light"}`}
                style={{
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  color: isScrolled ? "#05070a" : "#ffffff",
                  textShadow: isScrolled ? "none" : "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                Features
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/#solutions"
                className={`nav-link fw-bold px-4 py-2 nav-pill-hover ${isScrolled ? "nav-link-dark" : "nav-link-light"}`}
                style={{
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  color: isScrolled ? "#05070a" : "#ffffff",
                  textShadow: isScrolled ? "none" : "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                Solutions
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/#pricing"
                className={`nav-link fw-bold px-4 py-2 nav-pill-hover ${isScrolled ? "nav-link-dark" : "nav-link-light"}`}
                style={{
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  color: isScrolled ? "#05070a" : "#ffffff",
                  textShadow: isScrolled ? "none" : "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                Pricing
              </Link>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-4 mt-lg-0">
            {/* VIBRANT SIGN IN BUTTON WITH SCROLL TRANSITION */}
            <Link
              href="/login"
              className="btn fw-black px-4 py-2 rounded-pill hover-zoom d-flex align-items-center justify-content-center gap-2 transition-all"
              style={{ 
                backgroundColor: isScrolled ? "#05070a" : "#2bdd66", 
                color: isScrolled ? "#ffffff" : "#05070a",
                boxShadow: isScrolled ? "0 4px 12px rgba(0,0,0,0.1)" : "0 0 20px rgba(43,221,102,0.3)",
                border: isScrolled ? "1px solid rgba(255,255,255,0.1)" : "none",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
