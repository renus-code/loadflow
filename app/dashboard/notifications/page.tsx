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

  // Pattern: "Load #XXX is now IN TRANSIT (Operator: Name)"
  if (message.includes("is now IN TRANSIT (Operator:")) {
    const parts = message.split("is now IN TRANSIT (Operator:");
    return {
      title: "Load In Transit",
      subtitle: `${parts[0]?.trim()} • Operator: ${parts[1]?.replace(")", "").trim()}`,
    };
  }

  // Pattern: "Load #XXX: Pickup/Delivery..."
  if (message.startsWith("Load #") && message.includes(":")) {
    const parts = message.split(":");
    return {
      title: parts[0]?.trim(),
      subtitle: parts.slice(1).join(":").trim(),
    };
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
  const [pagination, setPagination] = useState<any>({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [category, setCategory] = useState<"ALL" | "LOADS" | "USERS">("ALL");
  const user = useAuth((state) => state.user);

  const fetchNotifications = async (targetPage = page) => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/notifications?all=${filter === "ALL"}&page=${targetPage}&limit=10${category !== "ALL" ? `&category=${category}` : ""}`,
      );
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
  }, [user, filter, category]);

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
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
    <div
      className="container-fluid px-0 animate-fade-in"
      style={{ maxWidth: "1600px" }}
    >
      {/* HEADER - Desktop Only */}
      <div className="d-none d-lg-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-1 gap-2 border-bottom pb-3 border-opacity-10 border-white">
        <div className="text-start">
          <h1
            className="display-6 text-white m-0 tracking-tight"
            style={{
              fontFamily: "var(--font-syne)",
              letterSpacing: "-0.04em",
              fontWeight: 900,
            }}
          >
            <span className="text-gradient-emerald">
              {user?.role || "User"}
            </span>{" "}
            Dashboard
          </h1>
          <p
            className="text-white mt-1 fw-bold mb-0 opacity-35 text-uppercase small"
            style={{ letterSpacing: "0.15rem", fontSize: "0.7rem" }}
          >
            {todayStr}
          </p>
        </div>
      </div>

      {/* MOBILE HEADER SPACER - Mobile Only */}
      <div className="d-lg-none" style={{ height: "1.5rem" }}></div>

      <div className="row justify-content-center">
        <div className="col-12 px-2">
          {/* CONTENT AREA - NO BACKGROUND BOX */}
          <div className="animate-slide-up">
            <div className="px-3 px-md-5 py-4 d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <h2
                className="fs-3 text-white m-0 tracking-tight"
                style={{
                  fontFamily: "var(--font-syne)",
                  letterSpacing: "-0.04em",
                  fontWeight: 900,
                }}
              >
                <span className="text-gradient-emerald">Manage</span> Alerts
              </h2>

              <div className="d-flex flex-wrap align-items-center gap-3 ms-auto">
                {/* Category Dropdown Filter */}
                <div className="dropdown position-relative">
                  <button
                    className="btn btn-dark rounded-pill px-3 py-1 border border-white border-opacity-10 shadow-lg d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      fontFamily: "var(--font-syne)",
                      height: "30px",
                      transition: "none",
                    }}
                  >
                    <span
                      className={
                        category !== "ALL"
                          ? "text-emerald"
                          : "text-white opacity-40"
                      }
                    >
                      {category === "ALL"
                        ? "ALL"
                        : category === "LOADS"
                          ? "LOADS"
                          : "USERS"}
                    </span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-30"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end border border-white border-opacity-10 rounded-4 shadow-2xl p-1 glass-card"
                    style={{
                      background: "rgba(10,12,20,0.98)",
                      backdropFilter: "blur(20px)",
                      zIndex: 1060,
                      minWidth: "100px",
                    }}
                  >
                    <li>
                      <button
                        className={`dropdown-item rounded-3 mb-1 fw-bold text-center ${category === "ALL" ? "bg-emerald text-dark" : "text-white"}`}
                        style={{ fontSize: "10px", padding: "4px 8px" }}
                        onClick={() => setCategory("ALL")}
                      >
                        ALL
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item rounded-3 mb-1 fw-bold text-center ${category === "LOADS" ? "bg-indigo text-white" : "text-white"}`}
                        style={{ fontSize: "10px", padding: "4px 8px" }}
                        onClick={() => setCategory("LOADS")}
                      >
                        LOADS
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item rounded-3 fw-bold text-center ${category === "USERS" ? "bg-emerald text-dark" : "text-white"}`}
                        style={{ fontSize: "10px", padding: "4px 8px" }}
                        onClick={() => setCategory("USERS")}
                      >
                        USERS
                      </button>
                    </li>
                  </ul>
                </div>

                <div
                  className="bg-black bg-opacity-40 rounded-pill p-1 d-flex border border-white border-opacity-10 shadow-lg"
                  style={{ height: "30px" }}
                >
                  <button
                    onClick={() => setFilter("ALL")}
                    className={`btn rounded-pill px-3 py-0 fw-black text-uppercase tracking-wider transition-all border-0 shadow-none active-scale ${
                      filter === "ALL"
                        ? "bg-emerald text-dark"
                        : "text-white opacity-40 hover-opacity-100"
                    }`}
                    style={{ fontSize: "9px" }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("UNREAD")}
                    className={`btn rounded-pill px-3 py-0 fw-black text-uppercase tracking-wider transition-all border-0 shadow-none active-scale ${
                      filter === "UNREAD"
                        ? "bg-emerald text-dark"
                        : "text-white opacity-40 hover-opacity-100"
                    }`}
                    style={{ fontSize: "9px" }}
                  >
                    Unread
                  </button>
                </div>

                {notifications.some((n) => !n.isRead) && (
                  <button
                    onClick={markAllRead}
                    className="btn btn-outline-emerald rounded-pill px-4 py-2 small fw-black text-uppercase tracking-wider border-1 hover-float transition-all shadow-none"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="p-0" style={{ minHeight: "600px" }}>
              {/* DESKTOP TABLE VIEW */}
              <div className="table-responsive d-none d-lg-block">
                <table className="table table-hover align-middle mb-0 custom-table">
                  <thead className="glass-thead">
                    <tr>
                      <th
                        className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                        style={{
                          letterSpacing: "0.15rem",
                          fontSize: "0.65rem",
                        }}
                      >
                        Time
                      </th>
                      <th
                        className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                        style={{
                          letterSpacing: "0.15rem",
                          fontSize: "0.65rem",
                        }}
                      >
                        Notification Details
                      </th>
                      <th
                        className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                        style={{
                          letterSpacing: "0.15rem",
                          fontSize: "0.65rem",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-10 opacity-50"
                        >
                          <div
                            className="spinner-grow text-emerald mb-4"
                            role="status"
                          ></div>
                          <p className="fw-black text-uppercase tracking-widest small text-white">
                            Orbiting for updates...
                          </p>
                        </td>
                      </tr>
                    ) : filteredNotifications.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-10">
                          <h3 className="fw-black text-white mb-2">
                            All Clear!
                          </h3>
                          <p className="text-white opacity-40 fw-medium">
                            No notifications to show at the moment.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredNotifications.map((n) => {
                        const { title, subtitle } = formatNotification(
                          n.message,
                        );
                        return (
                          <tr
                            key={n._id}
                            className={`glass-row transition-all border-start-4 ${
                              !n.isRead ? "unread-row" : "read-row"
                            }`}
                          >
                            <td className="px-4 py-3 text-center">
                              <span
                                className="fw-black text-uppercase tracking-widest text-white opacity-40"
                                style={{ fontSize: "0.65rem" }}
                              >
                                {new Date(n.createdAt).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center justify-content-center text-center">
                                <div
                                  style={{ maxWidth: "none", width: "100%" }}
                                >
                                  <h4
                                    className={`fs-6 fw-black text-white mb-0 ${!n.isRead ? "text-glow-emerald" : "opacity-80"}`}
                                  >
                                    {title}
                                  </h4>
                                  {subtitle && (
                                    <div className="xx-small text-white opacity-40 mt-1 fw-medium">
                                      {subtitle}
                                    </div>
                                  )}
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
                                      fontSize: "0.75rem",
                                      height: "32px",
                                      minWidth: "70px",
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
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    Mark Read
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(n._id)}
                                  className="btn btn-sm btn-outline-danger-20 rounded-pill px-3 fw-bold transition-all"
                                  style={{ fontSize: "0.75rem" }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="d-lg-none px-3">
                {loading ? (
                  <div className="text-center py-5 opacity-50">
                    <div
                      className="spinner-grow text-emerald mb-4"
                      role="status"
                    ></div>
                    <p className="fw-black text-uppercase tracking-widest small text-white">
                      Updating...
                    </p>
                  </div>
                ) : (
                  <>
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-5">
                        <h3 className="fw-black text-white mb-2">All Clear!</h3>
                        <p className="text-white opacity-40 fw-medium">
                          No notifications yet.
                        </p>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-4 mb-5">
                        {filteredNotifications.map((n) => {
                          const { title, subtitle } = formatNotification(
                            n.message,
                          );
                          return (
                            <div
                              key={n._id}
                              className={`p-4 rounded-4 border-start-4 transition-all hover-float ${!n.isRead ? "unread-card" : "opacity-80"}`}
                              style={{
                                background: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                backdropFilter: "blur(10px)",
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <span
                                  className="fw-black text-uppercase tracking-widest text-white opacity-40"
                                  style={{ fontSize: "0.6rem" }}
                                >
                                  {new Date(n.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                                {!n.isRead && (
                                  <span
                                    className="badge rounded-pill bg-emerald text-dark fw-black p-1 px-2"
                                    style={{ fontSize: "0.55rem" }}
                                  >
                                    UNREAD
                                  </span>
                                )}
                              </div>

                              <h4
                                className={`fs-5 fw-black text-white mb-1 ${!n.isRead ? "text-glow-emerald" : "opacity-80"}`}
                                style={{ lineHeight: "1.2" }}
                              >
                                {title}
                              </h4>
                              {subtitle && (
                                <p
                                  className="small text-white opacity-50 mb-4 fw-medium"
                                  style={{ lineHeight: "1.4" }}
                                >
                                  {subtitle}
                                </p>
                              )}

                              <div className="d-flex gap-2">
                                {n.link && (
                                  <Link
                                    href={n.link}
                                    className="btn btn-amber flex-grow-1 fw-black py-2 rounded-3 text-dark transition-all active-scale shadow-lg"
                                    style={{
                                      fontSize: "0.7rem",
                                      letterSpacing: "1px",
                                      background: "#f59e0b",
                                      border: "none",
                                    }}
                                    onClick={() => markAsRead(n._id)}
                                  >
                                    VIEW
                                  </Link>
                                )}
                                <button
                                  onClick={() => deleteNotification(n._id)}
                                  className="btn btn-crimson px-4 fw-black py-2 rounded-3 text-white transition-all active-scale shadow-lg"
                                  style={{
                                    fontSize: "0.7rem",
                                    letterSpacing: "1px",
                                    background: "#dc2626",
                                    border: "none",
                                  }}
                                >
                                  DELETE
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* INTEGRATED PAGINATION - MATCHES DASHBOARD BACKGROUND */}
            <div className="mt-auto py-4 d-flex justify-content-center align-items-center">
              {pagination.pages > 1 && (
                <div className="d-flex align-items-center gap-2 p-1">
                  {/* First Page */}
                  <button
                    title="First Page"
                    disabled={page === 1 || loading}
                    onClick={() => setPage(1)}
                    className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all btn-pagination-fleet"
                    style={{ width: "36px", height: "36px" }}
                  >
                    <svg
                      width="14"
                      height="14"
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
                    disabled={page === 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all btn-pagination-fleet"
                    style={{ width: "36px", height: "36px" }}
                  >
                    <svg
                      width="14"
                      height="14"
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
                    className="rounded-circle d-flex align-items-center justify-content-center fw-black shadow-lg animate-pulse-emerald"
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "#2bdd66",
                      color: "#000",
                      fontSize: "14px",
                      boxShadow: "0 0 20px -2px rgba(45,221,102,0.5)",
                      border: "2px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {page}
                  </div>

                  {/* Next Page */}
                  <button
                    title="Next Page"
                    disabled={page === pagination.pages || loading}
                    onClick={() =>
                      setPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all btn-pagination-fleet"
                    style={{ width: "36px", height: "36px" }}
                  >
                    <svg
                      width="14"
                      height="14"
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
                    disabled={page === pagination.pages || loading}
                    onClick={() => setPage(pagination.pages)}
                    className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all btn-pagination-fleet"
                    style={{ width: "36px", height: "36px" }}
                  >
                    <svg
                      width="14"
                      height="14"
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
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(13, 18, 38, 0.7);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .glass-thead {
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-row {
          background: rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-row:hover {
          transform: translateY(-1px);
          box-shadow: inset 0 0 0 9999px rgba(255, 255, 255, 0.04);
        }
        .active-scale:active {
          transform: scale(0.96);
        }
        .dropdown-item {
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }
        .border-start-4 {
          border-left: 4px solid transparent;
        }

        .unread-row {
          background: rgba(45, 221, 102, 0.05) !important;
          border-left-color: #2bdd66 !important;
          box-shadow: inset 10px 0 30px -15px rgba(45, 221, 102, 0.2);
        }
        .unread-row:hover {
          background: rgba(45, 221, 102, 0.1) !important;
        }
        .read-row {
          opacity: 0.6;
          border-left-color: transparent !important;
        }
        .read-row:hover {
          opacity: 1;
        }

        .fw-black {
          font-weight: 900;
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
        .text-emerald {
          color: #2bdd66 !important;
        }
        .btn-outline-emerald {
          color: #2bdd66;
          border-color: rgba(45, 221, 102, 0.4);
        }
        .btn-outline-emerald:hover {
          background: rgba(45, 221, 102, 0.1);
          border-color: #2bdd66;
          color: #2bdd66;
        }

        .btn-outline-white-20 {
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.75);
        }
        .btn-outline-white-20:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
        }
        .btn-outline-danger-20 {
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: rgba(239, 68, 68, 0.8);
        }
        .btn-outline-danger-20:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.5);
        }

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

        .xx-small {
          font-size: 0.6rem;
        }
        .x-small {
          font-size: 0.65rem;
        }
        .tracking-tighter {
          letter-spacing: -0.05em;
        }
        .tracking-widest {
          letter-spacing: 0.15em;
        }

        .text-glow-emerald {
          text-shadow: 0 0 10px rgba(45, 221, 102, 0.3);
        }
        .notification-icon-container {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
        }
        .hover-float:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
        }
        .hover-translate-x:hover {
          transform: translateX(3px);
        }

        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-slide-up {
          animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .py-10 {
          padding-top: 5rem;
          padding-bottom: 5rem;
        }
        .bg-emerald {
          background: #2bdd66;
        }

        .btn-pagination-fleet {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-pagination-fleet:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.35);
          transform: translateY(-1px);
          color: #fff;
        }
        .btn-pagination-fleet:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .unread-card {
          border-left-color: #2bdd66 !important;
        }
        .shadow-emerald-subtle {
          box-shadow: 0 10px 30px -10px rgba(45, 221, 102, 0.2);
        }
        .op-70 {
          opacity: 0.7;
        }

        @keyframes pulse-emerald {
          0% {
            box-shadow: 0 0 0 0 rgba(45, 221, 102, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(45, 221, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(45, 221, 102, 0);
          }
        }
        .animate-pulse-emerald {
          animation: pulse-emerald 2s infinite;
        }
      `}</style>
    </div>
  );
}
