"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
export default function MobileHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: any) => {
      // Capture scroll from any nested element (like the <main> container)
      const scrollPos = e.target.scrollTop || window.scrollY || 0;
      setIsScrolled(scrollPos > 10);
    };

    // Use capture: true to catch events from the inner <main> scroll container
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  const toggleMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-sidebar"));
  };

  return (
    <header 
      className="d-lg-none position-fixed top-0 start-0 w-100 premium-nav-transition"
      style={{ 
        zIndex: 10000,
        backgroundColor: '#0a0c10',
        paddingTop: isScrolled ? '0.5rem' : '0.85rem',
        paddingBottom: isScrolled ? '0.5rem' : '0.85rem',
        backdropFilter: 'blur(30px) saturate(180%)', 
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        willChange: 'padding, background-color, backdrop-filter, box-shadow' 
      }}
    >
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
        <Link href="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none transition-all hover-scale-105">
          <div className="rounded-3 overflow-hidden bg-white p-1 shadow-2xl d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', border: '1px solid rgba(43, 221, 102, 0.1)' }}>
            <Image 
              src="/truck-logo.png" 
              alt="Logo" 
              width={24}
              height={24}
              priority
              style={{ objectFit: 'contain' }} 
            />
          </div>
          <span className="fw-black text-white fs-5" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.02em' }}>
            Load<span style={{ color: '#2bdd66' }}>Flow</span>
          </span>
        </Link>

        <div className="d-flex align-items-center gap-2">
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
        .premium-nav-transition { 
          transition: padding 0.35s cubic-bezier(0.4, 0, 0.2, 1), 
                      background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1), 
                      box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      backdrop-filter 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </header>
  );
}
