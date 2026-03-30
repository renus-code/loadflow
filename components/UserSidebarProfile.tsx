"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

  const isProfileActive = pathname === "/dashboard/profile";

  return (
    <div className={`mt-auto ${isCollapsed ? 'p-0 pb-2' : 'p-4'}`} style={{ transition: 'all 0.4s ease' }}>
      <div 
        title={isCollapsed ? user.name : ""}
        className={`d-flex align-items-center gap-3 px-1 mb-4 group cursor-pointer hover-tilt ${isCollapsed ? 'justify-content-center mb-2 px-0 py-2' : ''}`}
      >
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-lg flex-shrink-0 border border-white border-opacity-30 profile-avatar" 
          style={{ width: isCollapsed ? '48px' : '52px', height: isCollapsed ? '48px' : '52px', fontSize: isCollapsed ? '1rem' : '1.2rem', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', transition: 'all 0.4s ease' }}
        >
          {initials}
        </div>
        {!isCollapsed && (
          <div className="flex-grow-1 animate-fade-in" style={{ minWidth: 0 }}>
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
        )}
      </div>
      
      {!isCollapsed && <div className="border-bottom border-white border-opacity-10 mb-3 mx-2 animate-fade-in"></div>}

      <div className={`d-flex flex-column gap-2 ${isCollapsed ? 'align-items-center' : ''}`}>
        <Link
          href="/dashboard/profile"
          title={isCollapsed ? "My Profile" : ""}
          className={`btn d-flex align-items-center gap-3 fw-bold transition-all border-0 shadow-none rounded-4 active-scale-95 group position-relative ${
            isCollapsed ? 'justify-content-center width-56 height-56 p-0' : 'px-3 py-3 w-100 text-start'
          } ${
            isProfileActive 
            ? 'bg-profile-glow text-white shadow-profile border-profile' 
            : 'text-white-50 hover-bg-white-5 hover-text-white'
          }`}
        >
          {isCollapsed && isProfileActive && <div className="active-indicator-compact bg-purple shadow-purple"></div>}
          <div className="icon-container d-flex align-items-center justify-content-center">
            <UserSettingsIcon />
          </div>
          {!isCollapsed && <span className="small text-uppercase tracking-wider animate-fade-in">My Profile</span>}
        </Link>

        <button
          onClick={() => logout(router)}
          title={isCollapsed ? "Sign out" : ""}
          className={`btn d-flex align-items-center gap-3 fw-bold text-white-50 hover-bg-danger-glass transition-all border-0 shadow-none rounded-4 active-scale-95 group position-relative ${
            isCollapsed ? 'justify-content-center width-56 height-56 p-0' : 'px-3 py-3 w-100 text-start'
          }`}
        >
          <div className="logout-icon-container d-flex align-items-center justify-content-center">
            <LogOutIcon />
          </div>
          {!isCollapsed && <span className="small text-uppercase tracking-wider animate-fade-in">Sign out</span>}
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
           left: -8px;
           width: 4px;
           height: 24px;
           border-radius: 0 4px 4px 0;
           transition: all 0.3s ease;
        }
        .bg-purple { background: #8b5cf6; }
        .shadow-purple { box-shadow: 0 0 15px #8b5cf6; }
        
        .bg-profile-glow { background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 100%); color: #a78bfa !important; border: 1px solid rgba(139, 92, 246, 0.4) !important; box-shadow: 0 0 30px rgba(139, 92, 246, 0.15); }
        .shadow-profile { box-shadow: 0 8px 25px -5px rgba(139, 92, 246, 0.4); }
        .border-profile { border: 1px solid rgba(139, 92, 246, 0.4) !important; }
        .hover-bg-white-5:hover { background-color: rgba(255, 255, 255, 0.05); }
        .hover-text-white:hover { color: white !important; }
        .hover-bg-danger-glass:hover { background-color: rgba(239, 68, 68, 0.1) !important; color: #f87171 !important; }
        .group:hover .logout-icon-container { transform: scale(1.1); color: #f87171 !important; filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.5)); }
        .group:hover .icon-container { transform: scale(1.1); color: white !important; }
        
        .logout-icon-container { transition: all 0.3s ease; color: #ef4444; opacity: 0.8; }
        .icon-container { transition: all 0.3s ease; }
        .fw-black { font-weight: 900; }
        .tracking-wider { letter-spacing: 0.1em; }
        .profile-avatar { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .group:hover .profile-avatar { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); transform: scale(1.08) rotate(2deg); }
        .hover-tilt:hover { transform: translateY(-3px); }
        .active-scale-95:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}
