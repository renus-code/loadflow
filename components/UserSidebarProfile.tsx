"use client";

import { useAuth } from "@/context/AuthContext";

const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function UserSidebarProfile() {
  const { user, isLoading, logout } = useAuth();

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

  return (
    <div className="p-4 mt-auto">
      <div className="d-flex align-items-center gap-3 px-1 mb-4">
        <div 
          className="rounded-4 bg-gradient-primary d-flex align-items-center justify-content-center text-white fw-bold shadow-lg flex-shrink-0 border border-white border-opacity-20" 
          style={{ width: '46px', height: '46px', fontSize: '1.2rem', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' }}
        >
          {initials}
        </div>
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="fw-bold text-white mb-0 text-truncate" style={{ fontSize: '0.95rem', letterSpacing: '0.01em', lineHeight: '1.2' }}>
            {user.name}
          </div>
          <div className="text-white-50 x-small text-truncate opacity-60">
            {user.email}
          </div>
        </div>
      </div>
      
      <button
        onClick={logout}
        className="btn d-flex align-items-center gap-3 px-3 py-2 fw-bold text-white-50 hover-text-white transition-all border-0 w-100 text-start shadow-none rounded-3"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="text-danger opacity-75"><LogOutIcon /></div>
        <span className="small">Sign out</span>
      </button>
      <style jsx>{`
        .hover-bg-danger:hover { background-color: rgba(239, 68, 68, 0.1) !important; color: #f87171 !important; }
        .hover-text-white:hover { color: white !important; }
        .x-small { font-size: 0.7rem; }
        .bg-opacity-05 { background: rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
}
