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
      className="btn-glass-pill d-none d-sm-flex align-items-center gap-2 p-1 pe-3 rounded-pill transition-all" 
      style={{ cursor: 'pointer' }}
    >
      <div 
        className="profile-avatar-premium rounded-circle d-flex align-items-center justify-content-center text-white fw-black flex-shrink-0" 
      >
        {initials}
      </div>
      <div className="d-flex flex-column align-items-start text-start overflow-hidden me-1">
         <span className="fw-bold text-white tracking-wide text-truncate name-text" style={{ fontSize: '0.85rem', lineHeight: '1.2' }}>{user.name}</span>
         {user.role && <span className="role-text text-uppercase tracking-widest text-truncate" style={{ fontSize: '0.6rem', fontWeight: 900 }}>{user.role}</span>}
      </div>

      <style jsx>{`
        .btn-glass-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .btn-glass-pill:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        .profile-avatar-premium {
          width: 34px;
          height: 34px;
          font-size: 0.8rem;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
        }
        .name-text { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); }
        .role-text { color: rgba(255, 255, 255, 0.4); }
        .btn-glass-pill:hover .role-text { color: #2bdd66; }
      `}</style>
    </div>
  );
}
