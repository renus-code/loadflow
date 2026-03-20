import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import UserHeaderProfile from "@/components/UserHeaderProfile";


export const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
export const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
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
      <div className="d-flex vh-100 bg-dashboard-soft overflow-hidden">
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column overflow-hidden" style={{ minWidth: 0, background: 'transparent' }}>
          <header className="bg-white bg-opacity-50 backdrop-blur-md border-bottom border-opacity-10 px-4 py-3 d-flex align-items-center justify-content-between flex-shrink-0 shadow-sm position-relative" style={{ zIndex: 10, backdropFilter: 'blur(10px)' }}>
            <div className="d-flex align-items-center gap-2 bg-white bg-opacity-75 rounded-pill px-3 py-2 border border-secondary border-opacity-10 w-100 transition-all hover-shadow-sm focus-within-ring" style={{ maxWidth: '320px' }}>
              <span className="text-secondary opacity-75"><SearchIcon /></span>
              <input
                className="bg-transparent border-0 small text-dark shadow-none w-100 fw-medium"
                placeholder="Search loads, routes, drivers..."
                style={{ outline: "none" }}
              />
            </div>
            <div className="d-flex align-items-center gap-3 ms-3">
              <button className="btn btn-light border-0 position-relative text-secondary p-2 d-flex align-items-center justify-content-center rounded-circle shadow-sm" style={{ transition: 'all 0.2s ease' }}>
                <BellIcon />
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-2 border-white rounded-circle mt-1 ms-1">
                  <span className="visually-hidden">New alerts</span>
                </span>
              </button>
              <UserHeaderProfile />
            </div>
          </header>
          <main className="flex-grow-1 overflow-auto p-4 p-md-5">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
