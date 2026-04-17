"use client";

import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import Image from "next/image";

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
      <div className="d-flex vh-resilient premium-bg overflow-hidden text-white position-relative">
        {/* Fixed background layer */}
        <div className="position-fixed top-0 start-0 w-100 h-100 z-0">
          <Image
            src="/premium_logistics_bg.webp"
            alt="Background"
            fill
            priority
            className="object-fit-cover"
            quality={75}
          />
          <div 
            className="position-absolute top-0 start-0 w-100 h-100" 
            style={{ background: 'linear-gradient(rgba(10, 20, 42, 0.9), rgba(10, 20, 42, 0.8))' }}
          ></div>
        </div>

        <div className="position-relative z-1 d-flex w-100 h-100">
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
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 991.98px) {
          main {
            padding-top: 85px !important;
          }
        }
      `}</style>
    </>
  );
}
