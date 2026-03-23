"use client";

import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider, useSearch } from "@/context/SearchContext";
import UserHeaderProfile from "@/components/UserHeaderProfile";

export const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
export const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SearchProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </SearchProvider>
    </AuthProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      <div className="d-flex vh-100 premium-bg overflow-hidden text-white">
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column overflow-hidden" style={{ minWidth: 0, background: 'transparent' }}>
          <header className="bg-black bg-opacity-40 backdrop-blur-2xl border-bottom border-white border-opacity-10 px-5 py-3 d-flex align-items-center justify-content-between flex-shrink-0 shadow-2xl position-relative sticky-top" style={{ zIndex: 10 }}>
            {/* GLOBAL SEARCH */}
            <div className="d-flex align-items-center gap-3 bg-white bg-opacity-5 rounded-pill px-4 py-2 border border-white border-opacity-10 w-100 transition-all hover-bg-white-10 focus-within-ring shadow-sm" style={{ maxWidth: '400px' }}>
              <span className="text-white opacity-40"><SearchIcon /></span>
              <input
                className="bg-transparent border-0 small text-white shadow-none w-100 fw-medium"
                placeholder="Search logistics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ outline: "none", fontSize: '0.85rem', letterSpacing: '0.02em', color: 'rgba(255,255,255,0.9)' }}
              />
            </div>

            {/* HEADER ACTIONS */}
            <div className="d-flex align-items-center gap-4 ms-3">
              <button className="btn btn-dark border-white border-opacity-10 position-relative text-white p-2 d-flex align-items-center justify-content-center rounded-circle hover-float transition-all bg-white bg-opacity-5 shadow-sm" style={{ width: '42px', height: '42px' }}>
                <BellIcon />
                <span className="position-absolute top-0 start-100 translate-middle p-1.5 bg-success border border-2 border-dark rounded-circle mt-2 ms-2 box-shadow-green"></span>
              </button>
              <div className="border-end border-white border-opacity-10 h-75 my-2 mx-1" style={{ width: '1px' }}></div>
              <UserHeaderProfile />
            </div>
          </header>
          
          <main className="flex-grow-1 overflow-auto p-4 p-md-5 no-scrollbar">
            {children}
          </main>
        </div>
      </div>
      <style jsx>{`
        .box-shadow-green { box-shadow: 0 0 10px rgba(43, 221, 102, 0.4); }
        .hover-bg-white-10:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
