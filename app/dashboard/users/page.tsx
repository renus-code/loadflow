/**
 * ======================================================================================
 * PAGE: Fleet Personnel Roster (/dashboard/users)
 * ======================================================================================
 * The administrative command center for managing human assets across the platform.
 *
 * Features:
 * 1. Component Injection: Encapsulates heavy data-table logic within the UserManagement component.
 * 2. Global State Reset: Clears persistent Zustand search queries upon unmounting to prevent pollution.
 * 3. Perimeter Security: Forcefully ejects non-administrator accounts.
 * ======================================================================================
 */
"use client";

import UserManagement from "@/components/UserManagement";
import SystemTimeDisplay from "@/components/SystemTimeDisplay";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

export default function UsersPage() {
  const user = useAuth((state) => state.user);
  const isLoading = useAuth((state) => state.isLoading);
  const setSearchTerm = useSearch((state) => state.setSearchTerm);
  const router = useRouter();

  useEffect(() => {
    // Clear global search term on mount so it doesn't interfere with user lookup
    setSearchTerm("");
  }, [setSearchTerm]);

  useEffect(() => {
    if (
      !isLoading &&
      (!user || (user.role !== "Admin" && user.role !== "Dispatcher"))
    ) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "Admin") {
    return null; // Will redirect via useEffect
  }

  return (
    <div
      className="container-fluid px-0 animate-fade-in"
      style={{ maxWidth: "1600px" }}
    >
      {/* DASHBOARD HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-1 gap-2 border-bottom pb-3 border-opacity-10 border-white">
        <div className="text-start">
          <h1
            className="display-6 fw-black text-white m-0 tracking-tight"
            style={{ 
              fontFamily: "var(--font-syne)", 
              letterSpacing: "-0.04em",
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)" 
            }}
          >
            <span className="text-gradient-emerald">{user?.role || "User"}</span>{" "}
            Dashboard
          </h1>

          <SystemTimeDisplay />
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 px-2">
          <Suspense
            fallback={
              <div className="text-white opacity-50 p-4">
                Loading Management...
              </div>
            }
          >
            <UserManagement />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
