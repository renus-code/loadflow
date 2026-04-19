/**
 * ======================================================================================
 * COMPONENT: AuditLogViewer (System Accountability Hub)
 * ======================================================================================
 * A professional interface for reviewing system-wide actions and event history.
 * 
 * Features:
 * 1. Semantic Action Tracking: Color-coded classification for CRUD, Auth, and System events.
 * 2. Real-Time Intelligence: Implements background polling (5s interval) for live monitoring.
 * 3. Deep-Dive Context: Captures actor details, target entities, and specific metadata chunks.
 * 4. Responsive Visibility: Transitions from a high-density desktop table to streamlined mobile cards.
 * 5. Forensic Infrastructure: Displays IP addresses and actor roles for security transparency.
 * ======================================================================================
 */
"use client";

import React, { useEffect, useState } from "react";
import { TableRowSkeleton, MobileCardSkeleton } from "./SkeletonLoaders";

interface AuditLog {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string };
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    fetchLogs(page);
    const interval = setInterval(() => {
      fetchLogs(page, true); // background refresh
    }, 5000);
    return () => clearInterval(interval);
  }, [page]);

  const fetchLogs = async (p: number, isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await fetch(`/api/audit?page=${p}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.totalPages);
        setTotalLogs(data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    const a = action.toUpperCase();
    if (
      a.includes("CREATE") ||
      a.includes("REGISTER") ||
      a.includes("REGISTERED") ||
      a.includes("ADD")
    )
      return "action-create";
    if (a.includes("UPDATE") || a.includes("EDIT") || a.includes("MODIFIED"))
      return "action-update";
    if (a.includes("DELETE") || a.includes("REMOVE") || a.includes("CANCEL"))
      return "action-delete";
    if (a.includes("REVOKE") || a.includes("BLOCK") || a.includes("LOGOUT"))
      return "action-revoke";
    if (a.includes("LOGIN") || a.includes("AUTH") || a.includes("APPROVE"))
      return "action-auth";
    return "action-default";
  };

  const MobileLogCard = ({ log }: { log: AuditLog }) => (
    <div 
      className="glass-card-stitch rounded-4 p-4 mb-3 border border-white border-opacity-10 shadow-lg animate-fade-in"
      style={{ 
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex flex-column">
          <span className={`badge rounded-pill px-3 py-2 border shadow-sm ${getActionColor(log.action)} fw-black x-small tracking-widest text-uppercase d-inline-block`}
                style={{ width: 'fit-content' }}>
            {log.action.replace(/_/g, " ")}
          </span>
          <div className="mt-2 text-white text-opacity-75 x-small fw-black">
            {new Date(log.createdAt).toLocaleDateString()} @ {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        {log.entityType && (
          <div className="d-flex align-items-center gap-2">
             <div className={`icon-container-${log.entityType === "User" ? "user" : log.entityType === "Load" ? "load" : "default"} rounded-circle d-flex align-items-center justify-content-center shadow-sm`}
                  style={{ width: "24px", height: "24px" }}>
                <span style={{ fontSize: '10px' }}>
                  {log.entityType === "User" ? "👤" : log.entityType === "Load" ? "📦" : "⚙️"}
                </span>
             </div>
             <span className="text-white text-opacity-90 fw-black x-small text-uppercase">{log.entityType}</span>
          </div>
        )}
      </div>

      <div className="mb-3">
        {log.userId ? (
          <div className="d-flex align-items-center gap-2">
            <div className="bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center fw-black text-white" 
                 style={{ width: '24px', height: '24px', fontSize: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {log.userId.name.charAt(0).toUpperCase()}
            </div>
            <div className="d-flex flex-column">
              <span className="text-white fw-black small">{log.userId.name}</span>
              <span className="text-white text-opacity-75 x-small fw-black">{log.userId.email}</span>
            </div>
          </div>
        ) : (
          <span className="text-white text-opacity-50 x-small fw-black">System / Unknown Actor</span>
        )}
      </div>

      {log.details && Object.keys(log.details).length > 0 && (
        <div className="d-flex flex-wrap gap-1 mt-2 pt-2 border-top border-white border-opacity-5">
          {Object.entries(log.details).map(([k, v]) => {
            if (["updatedKeys", "userId", "id", "_id", "__v"].includes(k)) return null;
            const val = typeof v === "object" ? JSON.stringify(v) : String(v);
            if (val.length > 50 || val === "undefined") return null;
            return (
              <span key={k} className="badge rounded-pill detail-badge border px-2 py-1" style={{ fontSize: '9px', background: 'rgba(255,255,255,0.1)' }}>
                <span className="text-white text-opacity-50 me-1">{k}:</span>
                <span className="text-white fw-bold">{val}</span>
              </span>
            );
          })}
        </div>
      )}
      
      {log.ipAddress && (
        <div className="mt-2 text-end">
          <span className="badge rounded-pill ip-badge border px-2 py-1 fw-bold" style={{ fontSize: '8px', opacity: 0.6 }}>
            {log.ipAddress.replace("::1", "LOCAL")}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden glass-card animate-slide-up">
        <div
          className="card-header border-bottom border-white border-opacity-10 px-4 px-md-5 py-4 d-flex justify-content-start align-items-center"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <h2
            className="fs-3 text-white m-0 tracking-tight text-start"
            style={{
              fontFamily: "var(--font-syne)",
              letterSpacing: "-0.04em",
              fontWeight: 900,
            }}
          >
            <span className="text-gradient-emerald">Audit</span> Logs
          </h2>
        </div>

        <div className="card-body p-0 flex-grow-1 overflow-hidden d-flex flex-column">
          {loading && logs.length === 0 ? (
            <div className="p-0 flex-grow-1 overflow-hidden">
              {/* Desktop Skeleton Rows */}
              <div className="d-none d-lg-block table-responsive">
                <table className="table align-middle mb-0 custom-table">
                  <tbody>
                    {[...Array(8)].map((_, i) => (
                      <TableRowSkeleton key={i} />
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Skeleton Cards */}
              <div className="d-lg-none p-3">
                {[...Array(5)].map((_, i) => (
                  <MobileCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="table-responsive flex-grow-1 custom-scrollbar d-none d-lg-block">
                <table className="table table-hover align-middle mb-0 custom-table">
                  <thead
                    className="glass-thead position-sticky top-0"
                    style={{ zIndex: 1 }}
                  >
                    <tr>
                      <th
                        className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                        style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                      >
                        Timestamp
                      </th>
                      <th
                        className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                        style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                      >
                        Actor
                      </th>
                      <th
                        className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                        style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                      >
                        Action
                      </th>
                      <th
                        className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                        style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                      >
                        Target
                      </th>
                      <th
                        className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                        style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                      >
                        Context / IP
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id} className="glass-row transition-all">
                        <td className="px-4 py-3 text-center">
                          <div className="text-white small fw-bold">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-white-50 x-small fw-bold opacity-50">
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {log.userId ? (
                            <>
                              <div className="text-white fw-black fs-6">
                                {log.userId.name}
                              </div>
                              <div className="text-white-50 small fw-medium">
                                {log.userId.email}
                              </div>
                            </>
                          ) : (
                            <div className="text-white-50 small font-monospace">
                              System / Unknown
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`badge rounded-pill px-3 py-2 border shadow-sm ${getActionColor(log.action)} fw-black x-small tracking-widest`}
                          >
                            {log.action.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {log.entityType ? (
                            <div className="d-flex align-items-center justify-content-center gap-3">
                              <div
                                className={`icon-container-${log.entityType === "User" ? "user" : log.entityType === "Load" ? "load" : "default"} rounded-4 d-flex align-items-center justify-content-center shadow-sm`}
                                style={{ width: "32px", height: "32px" }}
                              >
                                {log.entityType === "User" ? (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                  </svg>
                                ) : log.entityType === "Load" ? (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="2"
                                      y="7"
                                      width="20"
                                      height="14"
                                      rx="2"
                                      ry="2"
                                    ></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                  </svg>
                                ) : (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line
                                      x1="12"
                                      y1="16"
                                      x2="12.01"
                                      y2="16"
                                    ></line>
                                  </svg>
                                )}
                              </div>
                              <span className="text-white fw-black small mb-0 opacity-85">
                                {log.entityType}
                              </span>
                            </div>
                          ) : (
                            <div className="text-white-50 small">—</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="d-flex flex-wrap gap-1 align-items-center justify-content-center">
                            {log.details &&
                              Object.entries(log.details).map(([k, v]) => {
                                // Filter out technical noise
                                if (
                                  [
                                    "updatedKeys",
                                    "userId",
                                    "id",
                                    "_id",
                                    "__v",
                                  ].includes(k)
                                )
                                  return null;
                                const val =
                                  typeof v === "object"
                                    ? JSON.stringify(v)
                                    : String(v);
                                if (val.length > 100 || val === "undefined")
                                  return null; // Skip non-useful or extremely long technical values

                                return (
                                  <span
                                    key={k}
                                    className="badge rounded-pill detail-badge border px-3 py-2"
                                    style={{
                                      fontSize: "0.75rem",
                                      letterSpacing: "0.01em",
                                    }}
                                  >
                                    <span className="opacity-50 me-1">{k}:</span>
                                    <span className="text-white fw-bold">
                                      {val}
                                    </span>
                                  </span>
                                );
                              })}
                            {log.ipAddress && (
                              <span
                                className="badge rounded-pill ip-badge border px-3 py-2 fw-bold"
                                style={{
                                  fontSize: "0.6rem",
                                  background: "rgba(0,0,0,0.2)",
                                }}
                              >
                                {log.ipAddress.replace("::1", "LOCAL")}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-5 text-white opacity-50 fw-bold"
                        >
                          No audit logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="d-lg-none p-3 custom-scrollbar overflow-auto" style={{ maxHeight: '70vh' }}>
                 {logs.length === 0 ? (
                    <div className="text-center py-5 text-white opacity-50 fw-bold">
                      No audit logs found.
                    </div>
                 ) : (
                    logs.map((log) => <MobileLogCard key={log._id} log={log} />)
                 )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* ─── Pagination Info & Controls ───────────────────────────────────────────── */}
      <div className="d-flex flex-column align-items-center mt-5 px-4 mb-4">
        
        {totalPages > 1 && (
          <div className="d-flex w-100 justify-content-center align-items-center gap-2">
            {/* First Page */}
            <button
              title="First Page"
              aria-label="First Page"
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all btn-pagination-fleet"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
              </svg>
            </button>

            {/* Prev Page */}
            <button
              title="Previous Page"
              aria-label="Previous Page"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all btn-pagination-fleet"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Current Page Circle */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-black shadow-lg"
              style={{
                width: "48px",
                height: "48px",
                background: "#10b981",
                color: "#000",
                fontSize: "16px",
                boxShadow: "0 0 20px -2px rgba(16,185,129,0.5)",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {page}
            </div>

            {/* Next Page */}
            <button
              title="Next Page"
              aria-label="Next Page"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all btn-pagination-fleet"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {/* Last Page */}
            <button
              title="Last Page"
              aria-label="Last Page"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all btn-pagination-fleet"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(6, 9, 20, 0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .glass-thead {
          background: rgba(0, 0, 0, 0.4);
          border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }
        .glass-row {
          background: rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }
        .glass-row:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .fw-black {
          font-weight: 900;
        }
        .tracking-wider {
          letter-spacing: 0.15em;
          font-size: 0.7rem;
        }

        .action-create {
          background: rgba(16, 185, 129, 0.1) !important;
          color: #34d399 !important;
          border: 1px solid rgba(16, 185, 129, 0.2) !important;
        }
        .action-update {
          background: rgba(99, 102, 241, 0.1) !important;
          color: #818cf8 !important;
          border: 1px solid rgba(99, 102, 241, 0.2) !important;
        }
        .action-delete {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #f87171 !important;
          border: 1px solid rgba(239, 68, 68, 0.2) !important;
        }
        .action-revoke {
          background: rgba(245, 158, 11, 0.1) !important;
          color: #fbbf24 !important;
          border: 1px solid rgba(245, 158, 11, 0.2) !important;
        }
        .action-auth {
          background: rgba(6, 182, 212, 0.1) !important;
          color: #22d3ee !important;
          border: 1px solid rgba(6, 182, 212, 0.2) !important;
        }
        .action-default {
          background: rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .icon-container-user {
          background: rgba(16, 185, 129, 0.08) !important;
          color: #34d399 !important;
          border: 1px solid rgba(16, 185, 129, 0.15) !important;
        }
        .icon-container-load {
          background: rgba(99, 102, 241, 0.08) !important;
          color: #818cf8 !important;
          border: 1px solid rgba(99, 102, 241, 0.15) !important;
        }
        .icon-container-default {
          background: rgba(255, 255, 255, 0.04) !important;
          color: rgba(255, 255, 255, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        .detail-badge {
          background: rgba(255, 255, 255, 0.03) !important;
          color: rgba(255, 255, 255, 0.5) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          font-weight: 400;
        }
        .ip-badge {
          background: rgba(6, 182, 212, 0.08) !important;
          color: #22d3ee !important;
          border: 1px solid rgba(6, 182, 212, 0.15) !important;
          font-weight: 700;
        }

        .btn-pagination-fleet {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-pagination-fleet:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
          color: #fff;
        }
        .btn-pagination-fleet:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .text-gradient-emerald {
          background: linear-gradient(135deg, #2bdd66 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .custom-table {
          border-collapse: separate;
          border-spacing: 0;
        }
        .x-small {
          font-size: 0.65rem;
        }
        .tracking-widest {
          letter-spacing: 0.15em;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
