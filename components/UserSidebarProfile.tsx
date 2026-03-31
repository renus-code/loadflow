"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const UserSettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ filter: "drop-shadow(0 0 4px rgba(148, 163, 184, 0.4))" }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" style={{ filter: "drop-shadow(0 0 4px rgba(244, 63, 94, 0.4))" }}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function UserSidebarProfile({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const user = useAuth((state) => state.user);
  const isLoading = useAuth((state) => state.isLoading);
  const logout = useAuth((state) => state.logout);
  const pathname = usePathname();
  const router = useRouter();

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

  const isProfileActive = pathname.startsWith("/dashboard/profile");

  return (
    <div className={`mt-auto ${isCollapsed ? 'p-1' : 'p-3'}`} style={{ transition: 'all 0.4s ease', overflow: 'hidden' }}>
      <div 
        title={isCollapsed ? user.name : ""}
        className="d-flex align-items-center gap-3 px-1 mb-4 group cursor-pointer hover-tilt text-nowrap"
      >
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-lg flex-shrink-0 border border-white border-opacity-30 profile-avatar" 
          style={{ width: isCollapsed ? '42px' : '48px', height: isCollapsed ? '42px' : '48px', fontSize: isCollapsed ? '1rem' : '1.2rem', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', transition: 'all 0.4s ease' }}
        >
          {initials}
        </div>
        <div className="flex-grow-1" style={{ minWidth: 0, opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }}>
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
      
      <div className="border-bottom border-white border-opacity-10 mb-3 mx-2" style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }}></div>

      <div className="d-flex flex-column gap-2">
        <Link
          href="/dashboard/profile"
          className={`btn d-flex align-items-center gap-3 fw-bold transition-all border-0 shadow-none rounded-4 active-scale-95 group position-relative px-3 py-3 w-100 text-start text-nowrap ${
            isProfileActive 
            ? 'bg-profile-glow shadow-profile border-profile' 
            : 'text-white-50 hover-bg-white-5 hover-text-white'
          }`}
        >
          {isProfileActive && <div className="active-indicator-compact bg-purple shadow-purple"></div>}
          <div className={`icon-container d-flex align-items-center justify-content-center flex-shrink-0 ${isProfileActive ? 'text-purple' : ''}`} style={{ width: '24px' }}>
            <UserSettingsIcon />
          </div>
          <span className={`small text-uppercase tracking-wider ${isProfileActive ? 'text-white' : ''}`} style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }}>My Profile</span>
        </Link>

        <button
          onClick={() => logout(router)}
          className="btn d-flex align-items-center gap-3 fw-bold text-white-50 hover-bg-danger-glass transition-all border-0 shadow-none rounded-4 active-scale-95 group position-relative px-3 py-3 w-100 text-start text-nowrap"
        >
          <div className="logout-icon-container d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px' }}>
            <LogOutIcon />
          </div>
          <span className="small text-uppercase tracking-wider group-hover:text-white" style={{ opacity: isCollapsed ? 0 : 1, transition: 'opacity 0.2s ease' }}>Sign out</span>
        </button>
      </div>

      <style jsx>{`
        .width-56 { width: 56px !important; }
        .height-56 { height: 56px !important; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
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
        .bg-purple { background: #8b5cf6; }
        .text-purple { color: #a78bfa; }
        .shadow-purple { box-shadow: 0 0 15px #8b5cf6; }
        
        .bg-profile-glow { background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 100%); border: 1px solid rgba(139, 92, 246, 0.4) !important; box-shadow: 0 0 30px rgba(139, 92, 246, 0.15); }
        .shadow-profile { box-shadow: 0 8px 25px -5px rgba(139, 92, 246, 0.4); }
        .border-profile { border: 1px solid rgba(139, 92, 246, 0.4) !important; }
        .hover-bg-white-5:hover { background-color: rgba(255, 255, 255, 0.05); }
        .hover-text-white:hover { color: white !important; }
        .hover-bg-danger-glass:hover { background-color: rgba(239, 68, 68, 0.1) !important; }
        .group:hover .logout-icon-container { transform: scale(1.1); color: #f87171 !important; filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.5)); opacity: 1; }
        .group:hover .icon-container { transform: scale(1.1); }
        
        .logout-icon-container { transition: all 0.3s ease; color: #ef4444; opacity: 0.8; }
        .icon-container { transition: all 0.3s ease; }
        .fw-black { font-weight: 900; }
        .tracking-wider { letter-spacing: 0.1em; }
        .profile-avatar { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .group:hover .profile-avatar { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); transform: scale(1.08) rotate(2deg); }
        .hover-tilt:hover { transform: translateY(-3px); }
        .active-scale-95:active { transform: scale(0.95); }
        .group:hover .group-hover\:text-white { color: white !important; }
      `}</style>
    </div>
  );
}
