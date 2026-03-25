"use client";

import UserManagement from "@/components/UserManagement";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UsersPage() {
  const { user, isLoading } = useAuth();
  const { setSearchTerm } = useSearch();
  const router = useRouter();

  useEffect(() => {
    // Clear global search term on mount so it doesn't interfere with user lookup
    setSearchTerm("");
  }, [setSearchTerm]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'Admin')) {
      router.push('/dashboard');
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

  if (!user || user.role !== 'Admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11">
          <UserManagement />
        </div>
      </div>
    </div>
  );
}
