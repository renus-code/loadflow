"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserSettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function UserSidebarProfile() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="d-flex align-items-center gap-3 px-1 mb-3">
          <div className="rounded-circle bg-white bg-opacity-10" style={{ width: '40px', height: '40px' }}></div>
          <div className="flex-grow-1">
            <div className="bg-white bg-opacity-10 rounded mb-2" style={{ height: '12px', width: '80px' }}></div>
            <div className="bg-white bg-opacity-05 rounded" style={{ height: '8px', width: '110px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const isProfileActive = pathname === "/dashboard/profile";

  return (
    <div className="p-4 mt-auto">
      <div className="d-flex align-items-center gap-3 px-1 mb-4 group cursor-pointer hover-tilt">
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-lg flex-shrink-0 border border-white border-opacity-30 profile-avatar" 
          style={{ width: '48px', height: '48px', fontSize: '1.2rem', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' }}
        >
          {initials}
        </div>
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="fw-black text-white mb-0" style={{ fontSize: '1.05rem', letterSpacing: '0.01em', lineHeight: '1.1' }}>
            {user.name}
          </div>
          <div className="d-flex align-items-center gap-2 mt-2">
            <span 
              className="badge rounded-pill fw-black text-uppercase tracking-widest px-2 py-1" 
              style={{ 
                fontSize: '0.55rem', 
                background: '#2bdd66', 
                color: '#0d1117',
                boxShadow: '0 0 12px rgba(43, 221, 102, 0.4)' 
              }}
            >
              {user.role}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-bottom border-white border-opacity-10 mb-3 mx-2"></div>

      <div className="d-flex flex-column gap-1">
        <Link
          href="/dashboard/profile"
          className={`btn d-flex align-items-center gap-3 px-3 py-3 fw-bold transition-all border-0 w-100 text-start shadow-none rounded-4 active-scale-95 ${
            isProfileActive 
            ? 'bg-profile-glow text-white shadow-profile border-profile' 
            : 'text-white-50 hover-bg-white-5 hover-text-white'
          }`}
        >
          <div className="icon-container"><UserSettingsIcon /></div>
          <span className="small text-uppercase tracking-wider">My Profile</span>
        </Link>

        <button
          onClick={logout}
          className="btn d-flex align-items-center gap-3 px-3 py-3 fw-bold text-white-50 hover-bg-danger-glass transition-all border-0 w-100 text-start shadow-none rounded-4 active-scale-95"
        >
          <div className="logout-icon-container"><LogOutIcon /></div>
          <span className="small text-uppercase tracking-wider">Sign out</span>
        </button>
      </div>

      <style jsx>{`
        .bg-profile-glow { background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 100%); color: #a78bfa !important; border: 1px solid rgba(139, 92, 246, 0.4) !important; box-shadow: 0 0 30px rgba(139, 92, 246, 0.15); }
        .shadow-profile { box-shadow: 0 8px 25px -5px rgba(139, 92, 246, 0.4); }
        .border-profile { border: 1px solid rgba(139, 92, 246, 0.4) !important; }
        .hover-bg-white-5:hover { background-color: rgba(255, 255, 255, 0.05); }
        .hover-text-white:hover { color: white !important; }
        .hover-bg-danger-glass:hover { background-color: rgba(239, 68, 68, 0.15) !important; color: #f87171 !important; box-shadow: 0 0 20px rgba(239, 68, 68, 0.1); }
        .hover-bg-danger-glass:hover .logout-icon-container { transform: translateX(3px); color: #ef4444; }
        .logout-icon-container { transition: all 0.3s ease; color: #ef4444; opacity: 0.8; }
        .icon-container { transition: all 0.3s ease; }
        .x-small { font-size: 0.7rem; }
        .fw-black { font-weight: 900; }
        .tracking-wider { letter-spacing: 0.1em; }
        .profile-avatar { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); transition: all 0.3s ease; }
        .group:hover .profile-avatar { box-shadow: 0 0 30px rgba(99, 102, 241, 0.5); transform: scale(1.05); }
        .hover-tilt:hover { transform: translateY(-2px); }
        .active-scale-95:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}
