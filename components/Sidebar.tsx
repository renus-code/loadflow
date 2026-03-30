"use client";

// App Navigation: The main side menu that changes based on user role.

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
const PackagePlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M16 16h6" />
    <path d="M19 13v6" />
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
    <path d="m7.5 4.27 9 5.15" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuth((state) => state.user);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Initialize collapse state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState === 'true') setIsCollapsed(true);

    const handleToggleMobile = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handleToggleMobile);
    
    const handleOpen = () => setIsCreateModalOpen(true);
    const handleClose = () => setIsCreateModalOpen(false);
    window.addEventListener('open-create-load', handleOpen);
    window.addEventListener('close-create-load', handleClose);

    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleMobile);
      window.removeEventListener('open-create-load', handleOpen);
      window.removeEventListener('close-create-load', handleClose);
    };
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const handleCreateLoad = () => {
    window.dispatchEvent(new CustomEvent('open-create-load'));
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div 
          className="d-lg-none position-fixed top-0 start-0 w-100 vh-100 bg-black bg-opacity-50 backdrop-blur-sm shadow-2xl"
          onClick={() => setIsMobileOpen(false)}
          style={{ zIndex: 1001, backdropFilter: 'blur(4px)' }}
        />
      )}

      <aside className={`d-flex flex-column h-100 border-end border-white border-opacity-5 flex-shrink-0 animate-fade-in shadow-2xl position-relative ${
          isMobileOpen ? 'mobile-open' : ''
        }`} 
        style={{
          width: isCollapsed ? '90px' : '280px', 
          background: 'rgba(9, 19, 40, 0.95)', 
          backdropFilter: 'blur(20px)', 
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: isMobileOpen ? 1002 : 100
        }}>
        
        {/* TOGGLE BUTTON (DESKTOP ONLY) */}
        <button 
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="d-none d-lg-flex position-absolute top-50 start-100 translate-middle rounded-circle border border-white border-opacity-10 align-items-center justify-content-center shadow-lg hover-scale-110 active-scale-90"
          style={{ 
            width: '32px', 
            height: '32px', 
            zIndex: 101, 
            marginLeft: '-4px', 
            cursor: 'pointer', 
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            background: 'rgba(9, 19, 40, 1)',
            border: '1px solid rgba(43, 221, 102, 0.3)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" 
               style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', color: '#2bdd66' }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* MOBILE CLOSE BUTTON */}
        <button 
          className="d-lg-none btn border-0 text-white rounded-circle p-2 m-2 position-absolute end-0 top-0 bg-glass-white-10"
          onClick={() => setIsMobileOpen(false)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* BRANDING */}
        <div className={`pt-5 pb-4 mb-4 ${isCollapsed ? 'd-flex justify-content-center' : 'px-4'}`} style={{ transition: 'all 0.4s ease' }}>
          <Link href="/" className="d-flex align-items-center gap-3 text-decoration-none hover-tilt group">
            <div className="rounded-4 overflow-hidden d-flex align-items-center justify-content-center shadow-2xl bg-white p-2 flex-shrink-0" 
                 style={{ width: '52px', height: '52px', border: '2px solid rgba(43, 221, 102, 0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
              <img src="/truck-logo.png" alt="LoadFlow Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span className={`fs-1 fw-black d-flex align-items-center animate-fade-in ${isCollapsed ? 'd-lg-none' : ''}`} style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.05em' }}>
              <span className="text-white">Load</span><span style={{ color: '#2bdd66' }}>Flow</span>
            </span>
          </Link>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className={`flex-grow-1 p-3 d-flex flex-column gap-3 overflow-auto no-scrollbar ${isCollapsed ? 'align-items-lg-center px-lg-0' : ''}`}>
          {!isCollapsed && (
            <label className="text-white text-uppercase x-small fw-black opacity-60 px-3 mb-2 tracking-widest mt-2 animate-fade-in d-none d-lg-block">
              Workspace
            </label>
          )}
          
          <Link
            href="/dashboard"
            title={isCollapsed ? "Dashboard" : ""}
            className={`d-flex align-items-center gap-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 group position-relative ${
              isCollapsed ? 'justify-content-lg-center width-56-lg height-56-lg p-lg-0' : 'px-3 py-3 w-100'
            } ${
              pathname === '/dashboard' 
              ? 'bg-emerald-glow text-white shadow-emerald border-emerald' 
              : 'text-white-50 hover-bg-white-5 hover-text-white'
            }`}
             style={{ padding: '1rem' }}
          >
            {isCollapsed && pathname === '/dashboard' && <div className="active-indicator-compact d-none d-lg-block bg-emerald shadow-emerald"></div>}
            <div className="icon-wrapper d-flex align-items-center justify-content-center">
              <LayoutGridIcon />
            </div>
            <span className={`animate-fade-in ${isCollapsed ? 'd-lg-none' : ''}`}>Dashboard</span>
          </Link>

          {user?.role === 'Dispatcher' && (
            <button
              onClick={handleCreateLoad}
              title={isCollapsed ? "Create New Load" : ""}
              className={`d-flex align-items-center gap-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 border-0 text-start group position-relative ${
                isCollapsed ? 'justify-content-lg-center width-56-lg height-56-lg p-lg-0' : 'px-3 py-3 w-100'
              } ${
                isCreateModalOpen 
                ? 'bg-emerald-glow text-white shadow-emerald border-emerald' 
                : 'text-white-50 bg-transparent hover-bg-white-5 hover-text-white'
              }`}
               style={{ padding: '1rem' }}
            >
              {isCollapsed && isCreateModalOpen && <div className="active-indicator-compact d-none d-lg-block bg-emerald shadow-emerald"></div>}
              <div className="icon-wrapper d-flex align-items-center justify-content-center">
                <PackagePlusIcon />
              </div>
              <span className={`animate-fade-in ${isCollapsed ? 'd-lg-none' : ''}`}>Create New Load</span>
            </button>
          )}

          {user?.role === 'Admin' && (
             <Link
                href="/dashboard/users"
                title={isCollapsed ? "User Management" : ""}
                className={`d-flex align-items-center gap-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 group position-relative ${
                  isCollapsed ? 'justify-content-lg-center width-56-lg height-56-lg p-lg-0' : 'px-3 py-3 w-100'
                } ${
                  pathname === '/dashboard/users' 
                  ? 'bg-admin-glow text-white shadow-admin border-admin' 
                  : 'text-white-50 hover-bg-white-5 hover-text-white'
                }`}
                style={{ padding: '1rem' }}
             >
                {isCollapsed && pathname === '/dashboard/users' && <div className="active-indicator-compact d-none d-lg-block bg-blue shadow-admin"></div>}
                <div className="icon-wrapper d-flex align-items-center justify-content-center">
                  <UsersIcon />
                </div>
                <span className={`animate-fade-in ${isCollapsed ? 'd-lg-none' : ''}`}>User Management</span>
             </Link>
          )}
        </div>

        {/* FOOTER / PROFILE - GLASS CARD */}
        <div className={`mt-auto pb-4 ${isCollapsed ? 'px-lg-2' : 'px-3'}`}>
           <div className={`rounded-4 bg-glass-10 border border-white border-opacity-10 p-1 shadow-profile-compact ${isCollapsed ? 'd-lg-flex justify-content-lg-center' : ''}`} style={{ transition: 'all 0.4s ease' }}>
             <UserSidebarProfile isCollapsed={isCollapsed} />
           </div>
        </div>
        
        <style jsx>{`
          .width-56-lg { width: 56px !important; }
          .height-56-lg { height: 56px !important; }

          @media (max-width: 991.98px) {
            aside {
              position: fixed !important;
              left: -100% !important;
              top: 0 !important;
              z-index: 1010 !important;
              width: 280px !important;
              transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
              visibility: hidden !important;
              display: flex !important;
            }
            aside.mobile-open {
              left: 0 !important;
              visibility: visible !important;
            }
          }

          .active-indicator-compact {
             position: absolute;
             left: -8px;
             width: 4px;
             height: 24px;
             border-radius: 0 4px 4px 0;
             transition: all 0.3s ease;
          }
          .bg-emerald { background: #2bdd66; }
          .bg-blue { background: #3b82f6; }
          .icon-wrapper { transition: all 0.3s ease; }
          .group:hover .icon-wrapper { transform: scale(1.1); color: white !important; }

          .bg-emerald-glow:hover { background: rgba(43, 221, 102, 0.2) !important; box-shadow: 0 0 20px rgba(43, 221, 102, 0.3) !important; color: #2bdd66 !important; }
          .hover-bg-white-5:hover { background-color: rgba(255, 255, 255, 0.05); }
          .hover-text-white:hover { color: white !important; }
          .x-small { font-size: 0.65rem; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .hover-tilt:hover { transform: scale(1.02) rotate(-1deg); }
          .active-scale-90:active { transform: scale(0.9); }
          .active-scale-95:active { transform: scale(0.95); }
          .shadow-2xl { box-shadow: 15px 0 60px -10px rgba(0,0,0,0.6); }
          .shadow-profile-compact { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5); }
          
          .bg-emerald-glow { background: linear-gradient(135deg, rgba(43, 221, 102, 0.2) 0%, rgba(43, 221, 102, 0.05) 100%); border: 1px solid rgba(43, 221, 102, 0.2) !important; color: #2bdd66 !important; box-shadow: 0 0 30px rgba(43, 221, 102, 0.1); }
          .shadow-emerald { box-shadow: 0 8px 25px -5px rgba(43, 221, 102, 0.3); }
          .border-emerald { border: 1px solid rgba(43, 221, 102, 0.3) !important; }
          
          .bg-admin-glow { background: linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(30, 64, 175, 0.05) 100%); color: #3b82f6 !important; border: 1px solid rgba(59, 130, 246, 0.2) !important; }
          .shadow-admin { box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.2); }
          .border-admin { border: 1px solid rgba(59, 130, 246, 0.3) !important; }
          
          .fw-black { font-weight: 900; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
          .bg-glass-10 { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
          .bg-glass-white-10 { background: rgba(255, 255, 255, 0.1); }
        `}</style>
      </aside>
    </>
  );
}
