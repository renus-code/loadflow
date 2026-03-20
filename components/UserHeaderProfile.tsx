"use client";

import { useAuth } from "@/context/AuthContext";

export default function UserHeaderProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-none d-sm-flex align-items-center gap-2 p-1 pe-3 rounded-pill bg-light border border-secondary border-opacity-10 shadow-sm animate-pulse" style={{ width: '140px', height: '42px' }}>
        <div className="bg-secondary opacity-25 rounded-circle" style={{ width: '32px', height: '32px' }}></div>
        <div className="bg-secondary opacity-25 rounded w-75" style={{ height: '12px' }}></div>
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
    <div 
      className="btn btn-light d-none d-sm-flex align-items-center gap-2 p-1 pe-3 rounded-pill border border-secondary border-opacity-10 shadow-sm transition-all" 
      style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
    >
      <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0" style={{ width: '34px', height: '34px', fontSize: '0.9rem' }}>
        {initials}
      </div>
      <span className="fw-bold text-dark tracking-wide" style={{ fontSize: '0.95rem' }}>{user.name}</span>
    </div>
  );
}
