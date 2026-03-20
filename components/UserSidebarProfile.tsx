"use client";

import { useAuth, AuthProvider } from "@/context/AuthContext";
import Link from "next/link";

const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function UserSidebarProfile() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="p-4 border-top border-secondary border-opacity-25 animate-pulse">
        <div className="d-flex align-items-center gap-3 px-2 mb-3">
          <div className="rounded-circle bg-secondary opacity-25" style={{ width: '40px', height: '40px' }}></div>
          <div className="flex-grow-1">
            <div className="bg-secondary opacity-25 rounded mb-1" style={{ height: '14px', width: '80px' }}></div>
            <div className="bg-secondary opacity-25 rounded" style={{ height: '10px', width: '120px' }}></div>
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
    <div className="p-4 border-top border-secondary border-opacity-25">
      <div className="d-flex align-items-center gap-3 px-2 mb-3">
        <div 
          className="rounded-circle border border-white border-opacity-25 bg-gradient-primary d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0" 
          style={{ width: '44px', height: '44px', fontSize: '1.1rem' }}
        >
          {initials}
        </div>
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="fw-bold text-white mb-0" style={{ fontSize: '1rem', letterSpacing: '0.01em', lineHeight: '1.2' }}>
            {user.name}
          </div>
          <div className="text-white-50" style={{ fontSize: '0.8rem', opacity: 0.85 }}>
            {user.email}
          </div>
        </div>
      </div>
      
      <button
        onClick={logout}
        className="btn btn-link d-flex align-items-center gap-3 px-2 py-2 fw-medium text-white-50 text-white-hover text-decoration-none border-0 w-100 text-start shadow-none"
      >
        <LogOutIcon />
        Sign out
      </button>
      <style jsx>{`
        .btn-link:hover {
          color: white !important;
          background-color: rgba(255, 255, 255, 0.05);
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
