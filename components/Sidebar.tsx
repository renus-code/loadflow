"use client";

// App Navigation: The main side menu that changes based on user role.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserSidebarProfile from "./UserSidebarProfile";
import { useAuth } from "@/context/AuthContext";

// ─── PREMIUM ICONS (LUCIDE STYLE) ─────────────────────────────────────────────
const LayoutGridIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={active ? "#0ea5e9" : "currentColor"} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" style={active ? { filter: "drop-shadow(0 0 4px rgba(14, 165, 233, 0.4))" } : {}}>
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
const PackagePlusIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "currentColor"} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" style={active ? { filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))" } : {}}>
    <path d="M16 16h6" />
    <path d="M19 13v6" />
    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
    <path d="m7.5 4.27 9 5.15" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);
const UsersIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={active ? "#818cf8" : "currentColor"} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" style={active ? { filter: "drop-shadow(0 0 4px rgba(129, 140, 248, 0.4))" } : {}}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ScrollTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const user = useAuth((state) => state.user);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const isCollapsed = !isHovered;

  useEffect(() => {
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

      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`d-flex flex-column h-100 border-end border-white border-opacity-5 flex-shrink-0 animate-fade-in shadow-2xl position-relative ${
          isMobileOpen ? 'mobile-open' : ''
        }`} 
        style={{
          width: isCollapsed ? '90px' : '280px', 
          background: '#04070e', 
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
          zIndex: isMobileOpen ? 1002 : 100
        }}>

        {/* MOBILE CLOSE BUTTON */}
        <button 
          className="d-lg-none btn border-0 text-white rounded-circle p-2 m-2 position-absolute end-0 top-0"
          style={{ background: 'rgba(255, 255, 255, 0.05)' }}
          onClick={() => setIsMobileOpen(false)}
          title="Close Sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* BRANDING */}
        <div className="pt-5 pb-4 mb-4 px-3" style={{ transition: 'all 0.4s ease', paddingLeft: '1.2rem' }}>
          <Link href="/" className="d-flex align-items-center gap-3 text-decoration-none hover-tilt group text-nowrap">
            <div className="rounded-4 d-flex align-items-center justify-content-center shadow-2xl bg-white p-2 flex-shrink-0" 
                 style={{ width: '48px', height: '48px', border: '2px solid rgba(43, 221, 102, 0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
              <img src="/truck-logo.png" alt="LoadFlow Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span className="fs-3 fw-black d-flex align-items-center" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.05em', opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }}>
              <span className="text-white">Load</span><span style={{ color: '#2bdd66' }}>Flow</span>
            </span>
          </Link>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className="flex-grow-1 p-3 d-flex flex-column gap-3 overflow-y-auto overflow-x-hidden no-scrollbar">
          <label className="text-white text-uppercase x-small fw-black opacity-60 px-3 mb-2 tracking-widest mt-2 text-nowrap" style={{ opacity: isCollapsed ? 0 : 0.6, transition: 'opacity 0.2s ease' }}>
            Workspace
          </label>
          
          <Link
            href="/dashboard"
            className={`d-flex align-items-center gap-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 group position-relative px-3 py-3 w-100 text-nowrap ${
              pathname === '/dashboard' 
              ? 'bg-emerald-glow shadow-emerald border-emerald' 
              : 'text-white-50 hover-bg-white-5 hover-text-white'
            }`}
          >
            {pathname === '/dashboard' && <div className="active-indicator-compact bg-emerald shadow-emerald"></div>}
            <div className="icon-wrapper d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px' }}>
              <LayoutGridIcon active={pathname === '/dashboard'} />
            </div>
            <span style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }} className={pathname === '/dashboard' ? 'text-white' : ''}>Dashboard</span>
          </Link>

          {user?.role === 'Dispatcher' && (
            <button
              onClick={handleCreateLoad}
              className={`d-flex align-items-center gap-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 border-0 text-start group position-relative px-3 py-3 w-100 text-nowrap ${
                isCreateModalOpen 
                ? 'bg-emerald-glow shadow-emerald border-emerald' 
                : 'text-white-50 bg-transparent hover-bg-white-5 hover-text-white'
              }`}
            >
              <div className="icon-wrapper d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px' }}>
                <PackagePlusIcon active={isCreateModalOpen} />
              </div>
              <span style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }} className={isCreateModalOpen ? 'text-white' : ''}>Create New Load</span>
            </button>
          )}

          {user?.role === 'Admin' && (
             <Link
                href="/dashboard/users"
                className={`d-flex align-items-center gap-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 group position-relative px-3 py-3 w-100 text-nowrap ${
                  pathname.startsWith('/dashboard/users') 
                  ? 'bg-admin-glow shadow-admin border-admin' 
                  : 'text-white-50 hover-bg-white-5 hover-text-white'
                }`}
             >
                {pathname.startsWith('/dashboard/users') && <div className="active-indicator-compact bg-blue shadow-admin"></div>}
                <div className="icon-wrapper d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px' }}>
                  <UsersIcon active={pathname.startsWith('/dashboard/users')} />
                </div>
                <span style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }} className={pathname.startsWith('/dashboard/users') ? 'text-white' : ''}>User Management</span>
             </Link>
          )}

          {user?.role === 'Admin' && (
             <Link
                href="/dashboard/audit"
                className={`d-flex align-items-center gap-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 group position-relative px-3 py-3 w-100 text-nowrap ${
                  pathname.startsWith('/dashboard/audit') 
                  ? 'bg-admin-glow shadow-admin border-admin' 
                  : 'text-white-50 hover-bg-white-5 hover-text-white'
                }`}
             >
                {pathname.startsWith('/dashboard/audit') && <div className="active-indicator-compact bg-blue shadow-admin"></div>}
                <div className={`icon-wrapper d-flex align-items-center justify-content-center flex-shrink-0 ${pathname.startsWith('/dashboard/audit') ? 'text-blue' : ''}`} style={{ width: '24px' }}>
                  <ScrollTextIcon />
                </div>
                <span style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }} className={pathname.startsWith('/dashboard/audit') ? 'text-white' : ''}>Audit Logs</span>
             </Link>
          )}
        </div>

        <div className="mt-auto pb-4 px-2" style={{ transition: 'all 0.4s ease' }}>
           <div className="rounded-4 border border-white border-opacity-10 p-1 shadow-profile-compact" style={{ background: '#0a101f' }}>
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
             left: 0;
             top: 50%;
             transform: translateY(-50%);
             width: 4px;
             height: 24px;
             border-radius: 0 4px 4px 0;
             transition: all 0.3s ease;
          }
          .bg-emerald { background: #2bdd66; }
          .text-emerald { color: #2bdd66; }
          .bg-blue { background: #3b82f6; }
          .text-blue { color: #3b82f6; }
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
          
          .bg-emerald-glow { background: linear-gradient(135deg, rgba(43, 221, 102, 0.2) 0%, rgba(43, 221, 102, 0.05) 100%); border: 1px solid rgba(43, 221, 102, 0.2) !important; box-shadow: 0 0 30px rgba(43, 221, 102, 0.1); }
          .shadow-emerald { box-shadow: 0 8px 25px -5px rgba(43, 221, 102, 0.3); }
          .border-emerald { border: 1px solid rgba(43, 221, 102, 0.3) !important; }
          
          .bg-admin-glow { background: linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(30, 64, 175, 0.05) 100%); border: 1px solid rgba(59, 130, 246, 0.2) !important; }
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
