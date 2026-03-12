"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── SIDEBAR ICONS ────────────────────────────────────────────────────────────
export const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
export const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);
export const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-[18px] h-[18px]">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", Icon: GridIcon },
    { href: "/dashboard/create", label: "Create Load", Icon: PlusIcon },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col h-full bg-[#111827] text-white">
      {/* HEADER / LOGO */}
      <div className="px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
            <TruckIcon />
          </div>
          <span className="font-bold text-white tracking-tight text-xl font-syne">
            LoadFlow
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium transition-all ${
                isActive 
                  ? "bg-slate-800/80 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / PROFILE */}
      <div className="px-4 py-6 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">
              Jane Doe
            </div>
            <div className="text-xs text-slate-400 font-medium truncate">
              jane@acme.com
            </div>
          </div>
        </div>
        
        <Link
          href="/"
          className="w-full flex items-center gap-3.5 px-2 py-2 text-[15px] font-medium text-slate-400 hover:text-white transition-colors"
        >
          <LogOutIcon />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
