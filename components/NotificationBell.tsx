"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NotificationBell({ 
  variant = 'default', 
  isCollapsed = false 
}: { 
  variant?: 'default' | 'sidebar';
  isCollapsed?: boolean;
}) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuth((state) => state.user);
  const pathname = usePathname();
  const isActive = pathname === "/dashboard/notifications";

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch("/api/notifications?limit=10");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setTotalUnread(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setTotalUnread((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (res.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  if (!user) return null;

  const BellIcon = ({ active }: { active?: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#2bdd66" : "currentColor"}
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="20"
      height="20"
      className="transition-all"
      style={
        active ? { filter: "drop-shadow(0 0 4px rgba(45, 221, 102, 0.4))" } : {}
      }
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );

  if (variant === 'sidebar') {
    return (
      <Link
        href="/dashboard/notifications"
        className={`d-flex align-items-center gap-3 rounded-4 text-decoration-none fw-bold transition-all active-scale-95 group position-relative px-3 py-2 w-100 text-nowrap border-0 shadow-none bg-transparent ${
          isActive
            ? "bg-emerald-glow shadow-emerald border-emerald"
            : "text-white-50 hover-bg-white-5 hover-text-white"
        }`}
        title={isCollapsed ? "Notifications" : ""}
      >
        {isActive && (
          <div className="active-indicator-compact bg-emerald shadow-emerald"></div>
        )}
        <div
          className="icon-wrapper d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: "24px" }}
        >
          <BellIcon active={isActive} />
        </div>
        <span
          style={{
            opacity: isCollapsed ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
          className={`fw-bold ${isActive ? "text-white" : ""}`}
        >
          Notifications
        </span>
        {totalUnread > 0 && (
          <span
            className={`badge rounded-pill bg-danger fw-black ${
              isCollapsed
                ? "position-absolute translate-middle"
                : "ms-auto px-2 py-1"
            }`}
            style={{
              top: isCollapsed ? '25%' : 'auto',
              left: isCollapsed ? '75%' : 'auto',
              fontSize: isCollapsed ? "0.55rem" : "0.6rem",
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
            }}
          >
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="btn border-0 p-2 rounded-circle bg-white bg-opacity-05 hover-bg-white-10 transition-all position-relative active-scale-95 shadow-none"
        title="Notifications"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={totalUnread > 0 ? "#2bdd66" : "white"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="20"
          height="20"
          className={`notification-icon ${totalUnread > 0 ? "has-notifications" : "no-notifications"}`}
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {totalUnread > 0 && (
          <span 
            className="position-absolute translate-middle badge rounded-pill bg-danger border border-dark fw-black p-0 d-flex align-items-center justify-content-center"
            style={{ 
              top: '20%', 
              left: '80%', 
              fontSize: '0.55rem',
              minWidth: '16px',
              height: '16px',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
              zIndex: 2
            }}
          >
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="position-absolute end-0 mt-3 glass-dropdown shadow-2xl animate-scale-in">
          <div className="p-3 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center">
            <h6 className="m-0 fw-black text-white text-uppercase tracking-wider small">
              Notifications
            </h6>
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="btn btn-link p-0 text-emerald small fw-bold text-decoration-none hover-opacity-70"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list no-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center">
                <div
                  className="spinner-border spinner-border-sm text-emerald opacity-50"
                  role="status"
                ></div>
                <p className="small text-white opacity-40 mt-2 mb-0">
                  Checking for alerts...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-5 text-center">
                <div className="opacity-20 mb-2">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <p className="small text-white opacity-40 fw-medium m-0">
                  No new notifications
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className="p-3 border-bottom border-white border-opacity-05 hover-bg-white-02 transition-colors duration-200 d-flex gap-3 position-relative group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`notification-icon-container rounded-circle d-flex align-items-center justify-content-center ${
                          n.type === "DANGER"
                            ? "bg-danger bg-opacity-20 text-danger"
                            : n.type === "WARNING"
                              ? "bg-warning bg-opacity-20 text-warning"
                              : "bg-info bg-opacity-20 text-info"
                        }`}
                      >
                        {n.type === "DANGER" ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <Link
                        href={n.link || "#"}
                        className="text-decoration-none"
                        onClick={() => {
                          setShowDropdown(false);
                          markAsRead(n._id);
                        }}
                      >
                        <p className="notification-text small text-white opacity-90 m-0 fw-medium mb-1 pe-4">
                          {n.message}
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="x-small text-white opacity-30 fw-bold">
                            {new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="x-small text-emerald fw-bold opacity-0 group-hover-opacity-100 transition-all">
                            View details
                          </span>
                        </div>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n._id);
                        }}
                        className="notification-close-btn btn btn-link p-1 text-white opacity-10 hover-opacity-60 position-absolute"
                        title="Mark as read"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-top border-white border-opacity-10 text-center">
            {user.role === 'Admin' && (
              <Link
                href="/dashboard/users"
                className="text-decoration-none p-2 d-block text-white opacity-30 hover-opacity-100 transition-all x-small fw-black text-uppercase tracking-widest"
                onClick={() => setShowDropdown(false)}
              >
                View User Management
              </Link>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .glass-dropdown {
          background: rgba(13, 18, 38, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          width: 320px;
          z-index: 1000;
        }
        .notification-list {
          max-height: 380px;
          overflow-y: auto;
        }
        .notification-icon-container {
          width: 28px;
          height: 28px;
        }
        .notification-text {
          line-height: 1.4;
        }
        .notification-close-btn {
          top: 0.75rem;
          right: 0.75rem;
        }
        .hover-bg-white-02:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
        .hover-bg-white-10:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .text-emerald {
          color: #2bdd66 !important;
        }
        .x-small {
          font-size: 0.65rem;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .tracking-wider {
          letter-spacing: 0.1em;
        }
        .active-scale-95:active {
          transform: scale(0.95);
        }
        .group-hover-opacity-100 {
          opacity: 0;
        }
        .group:hover .group-hover-opacity-100 {
          opacity: 1;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s cubic-bezier(0, 0, 0.2, 1) forwards;
          transform-origin: top right;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
