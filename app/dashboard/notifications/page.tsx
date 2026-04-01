"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

// Helper to simplify notification messages
const formatNotification = (message: string) => {
  // Pattern: "Password reset requested by user: email (name)"
  if (message.toLowerCase().includes("password reset requested by user:")) {
    const parts = message.split(/password reset requested by user:/i);
    const details = parts[1]?.trim() || "";
    // Clean up "(Name)" and format as "email • Name"
    const cleanedDetails = details.replace(/\((.*?)\)/, " • $1").trim();
    return { title: "Password Reset Request", subtitle: cleanedDetails };
  }
  
  // Pattern: "New message from: Name"
  if (message.toLowerCase().includes("new message from:")) {
    const parts = message.split(/new message from:/i);
    return { title: "New Message", subtitle: parts[1]?.trim() || "" };
  }

  // Generic split by first colon
  if (message.includes(":")) {
    const [title, ...rest] = message.split(":");
    return { title: title.trim(), subtitle: rest.join(":").trim() };
  }

  return { title: message, subtitle: "" };
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, pages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const user = useAuth((state) => state.user);

  const fetchNotifications = async (targetPage = page) => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/notifications?all=${filter === "ALL"}&page=${targetPage}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchNotifications(1);
  }, [user, filter]);

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (!user) return null;

  const filteredNotifications = notifications;

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container-fluid px-0 animate-fade-in" style={{ maxWidth: "1600px" }}>
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-1 gap-2 border-bottom pb-3 border-opacity-10 border-white">
        <div className="text-start">
          <h1
            className="display-6 text-white m-0 tracking-tight"
            style={{ fontFamily: "var(--font-syne)", letterSpacing: "-0.04em", fontWeight: 900 }}
          >
            <span className="text-gradient-emerald">{user?.role || "User"}</span> Dashboard
          </h1>
          <p
            className="text-white mt-1 fw-bold mb-0 opacity-35 text-uppercase small"
            style={{ letterSpacing: "0.15rem", fontSize: "0.7rem" }}
          >
            {todayStr}
          </p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 px-2">
          {/* CONTENT CARD */}
          <div className="card border-0 shadow-lg rounded-5 overflow-hidden glass-card animate-slide-up">
            <div className="card-header border-bottom border-white border-opacity-10 px-4 px-md-5 py-4 d-flex flex-wrap justify-content-between align-items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h2 className="fs-3 text-white m-0 tracking-tight" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.04em', fontWeight: 900 }}>
                <span className="text-gradient-emerald">Manage</span> Alerts
              </h2>
              
              <div className="d-flex align-items-center gap-3 ms-auto">
                <div className="bg-black bg-opacity-40 rounded-pill p-1 d-flex border border-white border-opacity-10 shadow-lg">
                  <button
                    onClick={() => setFilter("ALL")}
                    className={`btn rounded-pill px-4 py-1 small fw-black text-uppercase tracking-wider transition-all border-0 shadow-none ${
                      filter === "ALL" ? "bg-emerald text-dark" : "text-white opacity-40 hover-opacity-100"
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("UNREAD")}
                    className={`btn rounded-pill px-4 py-1 small fw-black text-uppercase tracking-wider transition-all border-0 shadow-none ${
                      filter === "UNREAD" ? "bg-emerald text-dark" : "text-white opacity-40 hover-opacity-100"
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    Unread
                  </button>
                </div>
                
                {notifications.some(n => !n.isRead) && (
                  <button
                    onClick={markAllRead}
                    className="btn btn-outline-emerald rounded-pill px-4 py-2 small fw-black text-uppercase tracking-wider border-1 hover-float transition-all shadow-none"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 custom-table">
                  <thead className="glass-thead">
                    <tr>
                      <th className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35" style={{ letterSpacing: '0.15rem', fontSize: '0.65rem' }}>Time</th>
                      <th className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35" style={{ letterSpacing: '0.15rem', fontSize: '0.65rem' }}>Notification Details</th>
                      <th className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35" style={{ letterSpacing: '0.15rem', fontSize: '0.65rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={3} className="text-center py-10 opacity-50"><div className="spinner-grow text-emerald mb-4" role="status"></div><p className="fw-black text-uppercase tracking-widest small text-white">Orbiting for updates...</p></td></tr>
                    ) : filteredNotifications.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-10"><h3 className="fw-black text-white mb-2">All Clear!</h3><p className="text-white opacity-40 fw-medium">No notifications to show at the moment.</p></td></tr>
                    ) : (
                      filteredNotifications.map((n, index) => (
                        <tr
                          key={n._id}
                          className={`glass-row transition-all border-start-4 ${
                            !n.isRead ? "unread-row" : "read-row"
                          }`}
                        >
                          <td className="px-4 py-3 text-center">
                            <span className="fw-black text-uppercase tracking-widest text-white opacity-40" style={{ fontSize: '0.65rem' }}>
                              {new Date(n.createdAt).toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center justify-content-center text-center">
                              <div style={{ maxWidth: '450px' }}>
                                {(() => {
                                  const { title, subtitle } = formatNotification(n.message);
                                  return (
                                    <>
                                      <h4 
                                        className={`fs-6 fw-black text-white mb-0 text-truncate ${!n.isRead ? "text-glow-emerald" : "opacity-80"}`}
                                        title={n.message}
                                      >
                                        {title}
                                      </h4>
                                      {subtitle && (
                                        <div className="xx-small text-white opacity-40 mt-1 fw-medium text-truncate">
                                          {subtitle}
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              {n.link && (
                                <Link
                                  href={n.link}
                                  className="btn btn-sm btn-view-solid rounded-pill px-3 fw-bold transition-all shadow-sm d-flex align-items-center justify-content-center"
                                  style={{ 
                                    fontSize: '0.75rem',
                                    height: '32px',
                                    minWidth: '70px',
                                  }}
                                  onClick={() => markAsRead(n._id)}
                                >
                                  VIEW
                                </Link>
                              )}
                              
                              {!n.isRead && (
                                <button
                                  onClick={() => markAsRead(n._id)}
                                  className="btn btn-sm btn-gradient-emerald-subtle rounded-pill px-3 fw-bold transition-all"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  Mark Read
                                </button>
                              )}

                              <button
                                onClick={() => deleteNotification(n._id)}
                                className="btn btn-sm btn-outline-danger-20 rounded-pill px-3 fw-bold transition-all"
                                style={{ fontSize: '0.75rem' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

              {pagination.pages > 1 && (
                <div className="px-4 px-md-5 py-3 border-top border-white border-opacity-10 d-flex flex-column align-items-center gap-3 bg-black bg-opacity-20 mx-0">
                  <div className="d-flex align-items-center gap-2 pagination-container">
                    {/* FIRST PAGE */}
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1 || loading}
                      className="btn pagination-btn d-flex align-items-center justify-content-center transition-all shadow-none border-0"
                      title="First Page"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="11 17 6 12 11 7"></polyline>
                        <polyline points="18 17 13 12 18 7"></polyline>
                      </svg>
                    </button>

                    {/* PREV PAGE */}
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                      className="btn pagination-btn d-flex align-items-center justify-content-center transition-all shadow-none border-0"
                      title="Previous Page"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>

                    {/* CURRENT PAGE */}
                    <div className="pagination-btn active d-flex align-items-center justify-content-center shadow-lg">
                      <span className="fw-black" style={{ fontSize: '1.1rem' }}>{page}</span>
                    </div>

                    {/* NEXT PAGE */}
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages || loading}
                      className="btn pagination-btn d-flex align-items-center justify-content-center transition-all shadow-none border-0"
                      title="Next Page"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>

                    {/* LAST PAGE */}
                    <button
                      onClick={() => setPage(pagination.pages)}
                      disabled={page === pagination.pages || loading}
                      className="btn pagination-btn d-flex align-items-center justify-content-center transition-all shadow-none border-0"
                      title="Last Page"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="13 17 18 12 13 7"></polyline>
                        <polyline points="6 17 11 12 6 7"></polyline>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="small text-white opacity-20 fw-black text-uppercase tracking-widest" style={{ fontSize: '0.6rem' }}>
                    Showing {Math.min(pagination.total, (pagination.page - 1) * pagination.limit + 1)} - {Math.min(pagination.total, pagination.page * pagination.limit)} of {pagination.total} notifications
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card { background: rgba(13, 18, 38, 0.7); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.08) !important; }
        .glass-thead { background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
        .glass-row { transition: all 0.2s ease; border-bottom: 1px solid rgba(255, 255, 255, 0.04); }
        .glass-row:hover { background: rgba(255, 255, 255, 0.04) !important; }
        
        .border-start-4 { border-left: 4px solid transparent; }
        
        .unread-row { 
          background: rgba(45, 221, 102, 0.05) !important; 
          border-left-color: #2bdd66 !important;
          box-shadow: inset 10px 0 30px -15px rgba(45, 221, 102, 0.2);
        }
        .read-row { 
          opacity: 0.6; 
          border-left-color: transparent !important;
        }
        .read-row:hover {
          opacity: 1;
        }

        .fw-black { font-weight: 900; }
        .text-gradient-emerald { background: linear-gradient(135deg, #2bdd66 0%, #10b981 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .custom-table { border-collapse: separate; border-spacing: 0; }
        .text-emerald { color: #2bdd66 !important; }
        .btn-outline-emerald { color: #2bdd66; border-color: rgba(45, 221, 102, 0.4); }
        .btn-outline-emerald:hover { background: rgba(45, 221, 102, 0.1); border-color: #2bdd66; color: #2bdd66; }
        
        .btn-outline-white-20 { border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.75); }
        .btn-outline-white-20:hover { background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.5); }
        .btn-outline-danger-20 { border: 1px solid rgba(239, 68, 68, 0.3); color: rgba(239, 68, 68, 0.8); }
        .btn-outline-danger-20:hover { background: rgba(239, 68, 68, 0.15); color: #f87171; border-color: rgba(239, 68, 68, 0.5); }
 
  
        .glass-row :global(.btn-view-solid) {
          background: #f59e0b !important;
          color: #000000 !important;
          border: 1px solid #f59e0b !important;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3) !important;
          font-weight: 900 !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .glass-row :global(.btn-view-solid:hover) {
          background: #d97706 !important;
          border-color: #d97706 !important;
          color: #000000 !important;
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 8px 30px rgba(245, 158, 11, 0.5) !important;
        }
 
        .btn-gradient-emerald-subtle { 
          background: rgba(45, 221, 102, 0.12); 
          color: #2bdd66; 
          border: 1px solid rgba(45, 221, 102, 0.25);
        }
        .btn-gradient-emerald-subtle:hover { 
          background: rgba(45, 221, 102, 0.22); 
          border-color: #2bdd66; 
        }
        
        .xx-small { font-size: 0.6rem; }
        .x-small { font-size: 0.65rem; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .tracking-widest { letter-spacing: 0.15em; }
        
        .text-glow-emerald { text-shadow: 0 0 10px rgba(45, 221, 102, 0.3); }
        .notification-icon-container { width: 42px; height: 42px; flex-shrink: 0; }
        .hover-float:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.4) !important; }
        .hover-translate-x:hover { transform: translateX(3px); }
        
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        .py-10 { padding-top: 5rem; padding-bottom: 5rem; }
        .bg-emerald { background: #2bdd66; }

        .pagination-btn {
          width: 48px;
          height: 48px;
          border-radius: 50% !important;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          opacity: 0.5;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          opacity: 1;
          transform: translateY(-2px);
        }
        .pagination-btn:disabled {
          opacity: 0.1;
          cursor: not-allowed;
        }
        .pagination-btn.active {
          background: #2bdd66;
          color: #000;
          opacity: 1;
          transform: scale(1.15);
          box-shadow: 0 0 25px rgba(45, 221, 102, 0.4) !important;
        }
      `}</style>
    </div>
  );
}
