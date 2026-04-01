"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import NotificationBell from "./NotificationBell";

export default function MobileHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <header 
      className={`d-lg-none position-fixed top-0 start-0 w-100 z-index-1000 transition-all ${
        isScrolled ? 'py-2 bg-dark bg-opacity-80 backdrop-blur-md shadow-lg border-bottom border-white border-opacity-10' : 'py-3 bg-transparent'
      }`}
      style={{ backdropFilter: isScrolled ? 'blur(15px)' : 'none', WebkitBackdropFilter: isScrolled ? 'blur(15px)' : 'none' }}
    >
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
        <Link href="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none">
          <div className="rounded-3 overflow-hidden bg-white p-1 shadow-sm" style={{ width: '32px', height: '32px' }}>
            <img src="/truck-logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="fw-black text-white fs-5" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.02em' }}>
            Load<span style={{ color: '#2bdd66' }}>Flow</span>
          </span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          <NotificationBell />
          <button 
            onClick={toggleMobileSidebar}
            className="btn border-0 p-2 text-white bg-glass-white-10 rounded-3 hover-scale-110 active-scale-90"
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .bg-glass-white-10 { background: rgba(255, 255, 255, 0.05); }
        .backdrop-blur-md { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </header>
  );
}
