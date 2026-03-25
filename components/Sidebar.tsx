"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserSidebarProfile from "./UserSidebarProfile";
import { useAuth } from "@/context/AuthContext";

// ─── PREMIUM ICONS (LUCIDE STYLE) ─────────────────────────────────────────────
const LayoutGridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const PlusCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const UserSettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><circle cx="12" cy="12" r="3" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsCreateModalOpen(true);
    const handleClose = () => setIsCreateModalOpen(false);

    window.addEventListener('open-create-load', handleOpen);
    window.addEventListener('close-create-load', handleClose);

    return () => {
      window.removeEventListener('open-create-load', handleOpen);
      window.removeEventListener('close-create-load', handleClose);
    };
  }, []);

  const handleCreateLoad = () => {
    window.dispatchEvent(new CustomEvent('open-create-load'));
  };

  return (
    <aside className="d-flex flex-column h-100 border-end border-white border-opacity-5 flex-shrink-0 animate-fade-in shadow-2xl position-relative z-index-100" 
      style={{ width: '280px', background: 'rgba(9, 19, 40, 0.95)', backdropFilter: 'blur(20px)', transition: 'all 0.4s ease' }}>
      
      {/* BRANDING - MATCH LANDING PAGE EMERALD STYLE */}
      <div className="p-4 mb-4">
        <Link href="/" className="d-flex align-items-center gap-3 text-decoration-none hover-tilt group">
          <div className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center shadow-lg bg-white p-2" style={{ width: '48px', height: '48px', border: '2px solid rgba(43, 221, 102, 0.2)' }}>
            <img src="/truck-logo.png" alt="LoadFlow Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="fs-2 fw-black d-flex align-items-center" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.04em' }}>
            <span className="text-white">Load</span><span style={{ color: '#2bdd66' }}>Flow</span>
          </span>
        </Link>
      </div>

      {/* NAVIGATION SECTIONS */}
      <div className="flex-grow-1 p-3 d-flex flex-column gap-2 overflow-auto no-scrollbar">
        <label className="text-white text-uppercase x-small fw-black opacity-60 px-3 mb-2 tracking-widest mt-2">Workspace Dashboard</label>
        
        <Link
          href="/dashboard"
          className={`d-flex align-items-center gap-3 px-3 py-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 ${
            pathname === '/dashboard' 
            ? 'bg-emerald-glow text-white shadow-emerald border-emerald' 
            : 'text-white-50 hover-bg-white-5 hover-text-white'
          }`}
        >
          <LayoutGridIcon />
          <span>Dashboard</span>
        </Link>


        {user?.role === 'Dispatcher' && (
          <button
            onClick={handleCreateLoad}
            className={`w-100 d-flex align-items-center gap-3 px-3 py-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 border-0 text-start ${
              isCreateModalOpen 
              ? 'bg-emerald-glow text-white shadow-emerald border-emerald' 
              : 'text-white-50 bg-transparent hover-bg-white-5 hover-text-white'
            }`}
          >
            <PlusCircleIcon />
            <span>Create New Load</span>
          </button>
        )}

        {user?.role === 'Admin' && (
           <Link
              href="/dashboard/users"
              className={`d-flex align-items-center gap-3 px-3 py-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 ${
                pathname === '/dashboard/users' 
                ? 'bg-admin-glow text-white shadow-admin border-admin' 
                : 'text-white-50 hover-bg-white-5 hover-text-white'
              }`}
           >
              <UsersIcon />
              User Management
           </Link>
        )}
      </div>

      {/* FOOTER / PROFILE - GLASS CARD */}
      <div className="mt-auto px-3 pb-3">
         <div className="rounded-4 bg-glass-5 border border-white border-opacity-10 p-1">
           <UserSidebarProfile />
         </div>
      </div>
      
      <style jsx>{`
        .hover-bg-white-5:hover { background-color: rgba(255, 255, 255, 0.05); }
        .hover-text-white:hover { color: white !important; }
        .x-small { font-size: 0.65rem; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .hover-tilt:hover { transform: scale(1.02) rotate(-1deg); }
        .hover-float:hover { transform: translateY(-3px); }
        .hover-scale:hover { transform: scale(1.02); }
        .active-scale-95:active { transform: scale(0.95); }
        .shadow-2xl { box-shadow: 15px 0 60px -10px rgba(0, 0, 0, 0.6); }
        .bg-emerald-glow { background: linear-gradient(135deg, rgba(43, 221, 102, 0.25) 0%, rgba(43, 221, 102, 0.1) 100%); border: 1px solid rgba(43, 221, 102, 0.4) !important; color: #2bdd66 !important; box-shadow: 0 0 30px rgba(43, 221, 102, 0.15); }
        .shadow-emerald { box-shadow: 0 8px 25px -5px rgba(43, 221, 102, 0.4); }
        .border-emerald { border: 1px solid rgba(43, 221, 102, 0.4) !important; }
        
        .bg-admin-glow { background: linear-gradient(135deg, rgba(30, 64, 175, 0.25) 0%, rgba(30, 64, 175, 0.1) 100%); color: #3b82f6 !important; position: relative; }
        .bg-admin-glow::after { content: ''; position: absolute; left: 0; width: 4px; height: 50%; top: 25%; background: #3b82f6; border-radius: 0 4px 4px 0; box-shadow: 0 0 10px #3b82f6; }
        .shadow-admin { box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.3); }
        .border-admin { border: 1px solid rgba(59, 130, 246, 0.4) !important; }
        
        .bg-profile-glow { background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 100%); color: #a78bfa !important; border: 1px solid rgba(139, 92, 246, 0.4) !important; box-shadow: 0 0 30px rgba(139, 92, 246, 0.15); }
        .shadow-profile { box-shadow: 0 8px 25px -5px rgba(139, 92, 246, 0.4); }
        .border-profile { border: 1px solid rgba(139, 92, 246, 0.4) !important; }
        
        .btn-emerald { background: linear-gradient(135deg, rgba(43, 221, 102, 0.8) 0%, rgba(43, 221, 102, 0.6) 100%); color: #000; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 10px 30px rgba(43, 221, 102, 0.3); backdrop-filter: blur(10px); }
        .btn-emerald:hover { background: linear-gradient(135deg, rgba(43, 221, 102, 0.95) 0%, rgba(43, 221, 102, 0.75) 100%); color: #000; transform: translateY(-3px) scale(1.03); box-shadow: 0 15px 40px rgba(43, 221, 102, 0.5); }
        .btn-emerald-active { background: rgba(43, 221, 102, 0.2) !important; color: #2bdd66 !important; border: 1px solid rgba(43, 221, 102, 0.5) !important; pointer-events: none; }
        .shadow-emerald-active { box-shadow: 0 15px 40px -5px rgba(16, 185, 129, 0.6) !important; }
        .fw-black { font-weight: 900; }
      `}</style>
    </aside>
  );
}
