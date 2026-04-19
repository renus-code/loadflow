/**
 * ======================================================================================
 * PAGE: System Audit Ledger (/dashboard/audit)
 * ======================================================================================
 * The centralized administrative view for platform-wide activity tracking.
 *
 * Features:
 * 1. Security Enforcement: Strictly utilizes server-side JWT verification to block non-admins.
 * 2. Visual Architecture: Injects the highly interactive AuditLogViewer component.
 * 3. Dynamic Hydration: Injects server-rendered timestamps for immediate temporal context.
 * ======================================================================================
 */
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AuditLogViewer from "@/components/AuditLogViewer";
import SystemTimeDisplay from "@/components/SystemTimeDisplay";

import * as jose from "jose";

export default async function AuditLogsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret",
    );
    const { payload } = await jose.jwtVerify(token, secret);

    // Only allow Admins
    if (payload.role !== "Admin") {
      redirect("/dashboard");
    }

    return (
      <div
        className="container-fluid px-0 dashboard-page-container page-transition"
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
                fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              }}
            >
              <span className="text-gradient-emerald">Admin</span> Dashboard
            </h1>
            <SystemTimeDisplay />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 px-2 pb-5">
            <AuditLogViewer />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    redirect("/login");
  }
}
