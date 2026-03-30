"use client";

import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";

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
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        rel="stylesheet"
      />
      <div className="d-flex vh-100 premium-bg overflow-hidden text-white">
        <MobileHeader />
        <Sidebar />
        <div
          className="flex-grow-1 d-flex flex-column overflow-hidden"
          style={{ minWidth: 0, background: "transparent" }}
        >
          <main className="flex-grow-1 overflow-auto p-3 p-md-5 no-scrollbar mt-5 mt-lg-0">
            <div className="container-fluid py-3 py-lg-0">{children}</div>
          </main>
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 991.98px) {
          main {
            padding-top: 60px !important;
          }
        }
      `}</style>
    </>
  );
}
