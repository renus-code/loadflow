"use client";

import { useAuth } from "@/context/AuthContext";

export default function UserHeaderProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-none d-sm-flex align-items-center gap-2 p-1 pe-3 rounded-pill bg-white border border-secondary border-opacity-10 shadow-sm animate-pulse" style={{ width: '150px', height: '44px' }}>
        <div className="bg-secondary opacity-15 rounded-circle shadow-inner" style={{ width: '36px', height: '36px' }}></div>
        <div className="bg-secondary opacity-10 rounded w-60" style={{ height: '12px' }}></div>
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
      className="btn btn-outline-light d-none d-sm-flex align-items-center gap-2 p-1 pe-4 rounded-pill border border-secondary border-opacity-10 shadow-lg bg-white bg-opacity-80 transition-all hover-float hover-shadow-md" 
      style={{ cursor: 'pointer' }}
    >
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-md flex-shrink-0 border border-white border-opacity-20" 
        style={{ width: '38px', height: '38px', fontSize: '0.95rem', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >
        {initials}
      </div>
      <div className="d-flex flex-column align-items-start text-start overflow-hidden">
         <span className="fw-bold text-dark tracking-wide text-truncate" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>{user.name}</span>
         {user.role && <span className="text-secondary opacity-60 text-uppercase tracking-widest text-truncate" style={{ fontSize: '0.6rem', fontWeight: 800 }}>{user.role}</span>}
      </div>
    </div>
  );
}
