"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserSidebarProfile from "./UserSidebarProfile";

// ─── SIDEBAR ICONS ────────────────────────────────────────────────────────────
export const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
export const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
export const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="18" height="18">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", Icon: GridIcon },
    { href: "/dashboard/create", label: "Create Load", Icon: PlusIcon },
  ];

  return (
    <aside className="d-flex flex-column h-100 bg-dark text-white flex-shrink-0 shadow-lg" style={{ width: '260px', zIndex: 20 }}>
      {/* HEADER / LOGO */}
      <div className="p-4 border-bottom border-secondary border-opacity-25 animate-fade-in">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded overflow-hidden d-flex align-items-center justify-content-center shadow-sm" style={{ width: '32px', height: '32px' }}>
            <img src="/truck-logo.png" alt="LoadFlow Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="fs-4 d-flex align-items-center" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.02em' }}>
            <span className="brand-text-load">Load</span><span className="brand-text-flow">Flow</span>
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-grow-1 p-3 d-flex flex-column gap-2">
        {navItems.map(({ href, label, Icon }, i) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none fw-medium transition-all animate-slide-in-left delay-${(i + 1) * 100}
                ${isActive 
                  ? "bg-gradient-primary text-white shadow-sm border border-white border-opacity-10" 
                  : "text-white-50 hover-bg-secondary hover-text-white"
                }
              `}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / PROFILE */}
      <UserSidebarProfile />
      
      <style jsx>{`
        .hover-bg-secondary:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .hover-text-white:hover {
          color: white !important;
        }
      `}</style>
    </aside>
  );
}
