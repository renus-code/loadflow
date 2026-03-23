"use client";

import Sidebar from "@/components/Sidebar";
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
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      <div className="d-flex vh-100 premium-bg overflow-hidden text-white">
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column overflow-hidden" style={{ minWidth: 0, background: 'transparent' }}>
          <main className="flex-grow-1 overflow-auto p-4 p-md-5 no-scrollbar">
            {children}
          </main>
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
