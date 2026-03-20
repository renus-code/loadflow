"use client";

import Link from "next/link";
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
    <nav className={`navbar navbar-expand-lg position-fixed w-100 z-3 transition-all ${isScrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'}`} style={{ top: 0, transition: 'all 0.3s ease' }}>
      <div className="container-fluid px-3">
        
        {/* LOGO */}
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2 hover-tilt">
          <div className="rounded overflow-hidden d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px' }}>
            <img src="/truck-logo.png" alt="LoadFlow Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="fs-3 d-flex align-items-center" style={{ fontFamily: 'var(--font-syne)' }}>
            <span className="brand-text-load">Load</span><span className="brand-text-flow">Flow</span>
          </span>
        </Link>

        {/* Navbar Toggler for mobile */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon navbar-dark"></span>
        </button>

        {/* CENTER LINKS & ACTION BUTTONS */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-4">
            <li className="nav-item">
              <Link href="#" className={`nav-link fw-medium nav-link-animated px-0 ${isScrolled ? 'text-dark' : 'text-white'}`} style={isScrolled ? {} : { textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Features</Link>
            </li>
            <li className="nav-item">
              <Link href="#" className={`nav-link fw-medium nav-link-animated px-0 ${isScrolled ? 'text-dark' : 'text-white'}`} style={isScrolled ? {} : { textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Solutions</Link>
            </li>
            <li className="nav-item">
              <Link href="#" className={`nav-link fw-medium nav-link-animated px-0 ${isScrolled ? 'text-dark' : 'text-white'}`} style={isScrolled ? {} : { textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Pricing</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            <Link href="/login" className={`text-decoration-none fw-semibold d-flex align-items-center gap-2 ${isScrolled ? 'text-dark' : 'text-white'}`} style={isScrolled ? {} : { textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Sign in</span>
            </Link>
            <Link href="/register" className={`btn ${isScrolled ? 'btn-primary' : 'btn-dark'} fw-semibold px-4 py-2 shadow-sm rounded-3 d-flex align-items-center gap-2`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              <span>Get started</span>
            </Link>
          </div>
        </div>

      </div>
    </nav>
  );
}
