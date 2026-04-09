"use client";

// Admin Panel: Let admins manage staff members, roles, and passwords.

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";

// Portal — renders directly on document.body, escaping all parent stacking contexts
function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
};

// --- PREMIUM-STYLE ICONS ---
const UserPlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);
const UserIcon = () => (
  <svg
    width="18"
    height="18"
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
);
const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const ShieldIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

// ─── Custom Role Dropdown ───────────────────────────────────────────────────
function RoleDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const roles = ["Driver", "Dispatcher", "Admin"];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: open ? 2000 : 1 }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 18px 14px 52px",
          borderRadius: "16px",
          border: open
            ? "1.5px solid rgba(43, 221, 102, 0.5)"
            : "1px solid rgba(255,255,255,0.1)",
          background: open
            ? "rgba(43, 221, 102, 0.06)"
            : "rgba(255,255,255,0.05)",
          cursor: "pointer",
          userSelect: "none",
          transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: open ? "0 0 0 3px rgba(43,221,102,0.1)" : "none",
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: "15px",
            fontWeight: 700,
            color: value ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.35)",
          }}
        >
          {value || "Select role..."}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={open ? "#2bdd66" : "rgba(255,255,255,0.35)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            borderRadius: "14px",
            border: "1px solid rgba(43, 221, 102, 0.18)",
            background: "rgb(13, 18, 38)",
            boxShadow:
              "0 20px 50px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
            padding: "6px",
            overflow: "hidden",
            zIndex: 2001,
            animation: "glassDropdownOpen 0.2s cubic-bezier(0.4,0,0.2,1) both",
          }}
        >
          {roles.map((role) => {
            const selected = value === role;
            return (
              <div
                key={role}
                onClick={() => {
                  onChange(role);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  marginBottom: "2px",
                  cursor: "pointer",
                  background: selected
                    ? "rgba(43,221,102,0.12)"
                    : "transparent",
                  border: selected
                    ? "1px solid rgba(43,221,102,0.25)"
                    : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.background = "rgba(43,221,102,0.07)";
                    e.currentTarget.style.border =
                      "1px solid rgba(43,221,102,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.border = "1px solid transparent";
                  }
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: selected ? "#2bdd66" : "rgba(255,255,255,0.15)",
                    boxShadow: selected ? "0 0 8px #2bdd66" : "none",
                    transition: "all 0.15s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    flex: 1,
                    color: selected ? "#2bdd66" : "rgba(255,255,255,0.65)",
                    transition: "color 0.15s ease",
                  }}
                >
                  {role}
                </span>
                {selected && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2bdd66"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function UserManagement() {
  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isPending?: boolean;
    resetPasswordRequested?: boolean;
    resetPasswordApproved?: boolean;
    isLocked?: boolean;
    loginAttempts?: number;
    requestedBy?: string;
    __v?: number;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [actionStatus, setActionStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const searchTerm = useSearch((state) => state.searchTerm);
  const setSearchTerm = useSearch((state) => state.setSearchTerm);

  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>();
  const currentUser = useAuth((state) => state.user);

  // Auto-fill from query params (e.g. from Dispatcher request notification)
  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "invite") {
      const email = searchParams.get("email");
      const firstName = searchParams.get("firstName");
      const lastName = searchParams.get("lastName");

      if (email || firstName || lastName) {
        setIsEditing(false);
        setEditingId("");
        reset({
          email: email || "",
          firstName: firstName || "",
          lastName: lastName || "",
          role: "Driver",
        });
        setShowModal(true);
      }
    }
  }, [searchParams, reset]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (res.ok) setUsers(await res.json());
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: UserFormData) => {
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    const submissionData = {
      name: fullName,
      email: data.email,
      role: data.role,
      password: data.password,
    };

    if (isEditing) {
      try {
        const res = await fetch(`/api/users/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...submissionData,
            __v: users.find((u) => u._id === editingId)?.__v,
          }),
        });

        if (res.status === 409) {
          const errData = await res.json();
          alert(
            errData.error ||
              "Data has been modified by another user. Please refresh.",
          );
          setShowModal(false);
          fetchUsers();
          return;
        }

        if (res.ok) {
          setShowModal(false);
          fetchUsers();
        } else {
          const errData = await res.json();
          alert(`Failed to update user: ${errData.error || "Unknown error"}`);
        }
      } catch (err) {
        console.error("Update error", err);
        alert("An error occurred while updating the user.");
      }
    } else {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });
        if (res.ok) {
          setShowModal(false);
          fetchUsers();
        } else {
          const errData = await res.json();
          alert(`Failed to create user: ${errData.error}`);
        }
      } catch (error) {
        console.error("Create error:", error);
      }
    }
  };

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/users/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActionStatus({
          type: "success",
          message: `User "${deleteTarget.name}" has been permanently deleted.`,
        });
        fetchUsers();
      } else {
        const errorData = await res.json();
        setActionStatus({
          type: "error",
          message: errorData.error || "Failed to delete user.",
        });
      }
    } catch (error) {
      setActionStatus({
        type: "error",
        message: "An unexpected error occurred during deletion.",
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleUnlock = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}/unlock`, { method: "POST" });
      if (res.ok) fetchUsers();
      else alert("Failed to unlock account");
    } catch (error) {
      console.error("Unlock error:", error);
    }
  };

  const handleApproveUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPending: false }),
      });
      if (res.ok) fetchUsers();
      else alert("Failed to approve user");
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  const handleApproveReset = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}/approve-reset`, {
        method: "POST",
      });
      if (res.ok) fetchUsers();
      else alert("Failed to approve reset");
    } catch (error) {
      console.error("Approve reset error:", error);
    }
  };

  const handleRevokeSession = (user: User) => {
    setRevokeTarget(user);
    setShowRevokeConfirm(true);
  };

  const confirmRevoke = async () => {
    if (!revokeTarget) return;
    try {
      const res = await fetch(`/api/users/${revokeTarget._id}/revoke`, {
        method: "POST",
      });
      if (res.ok) {
        setActionStatus({
          type: "success",
          message: `All sessions revoked for ${revokeTarget.name}. They have been logged out.`,
        });
        fetchUsers();
      } else {
        const errorData = await res.json();
        setActionStatus({
          type: "error",
          message: errorData.error || "Failed to revoke sessions.",
        });
      }
    } catch (error) {
      setActionStatus({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setShowRevokeConfirm(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingId(user._id);
    const nameParts = user.name.split(" ");
    const fName = nameParts[0] || "";
    const lName = nameParts.slice(1).join(" ") || "";

    reset({
      firstName: fName,
      lastName: lName,
      email: user.email,
      password: "",
      role: user.role,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingId("");
    reset({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "Driver",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const isDispatcher = currentUser?.role === "Dispatcher";
  const isAdmin = currentUser?.role === "Admin";

  const filteredUsers = users.filter((u) => {
    // Dispatchers only see their own requests
    if (isDispatcher && u.requestedBy !== currentUser?.id) return false;

    const s = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s) ||
      u.role?.toLowerCase().includes(s)
    );
  });

  // PAGINATION LOGIC
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <>
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden glass-card animate-slide-up">
        <div
          className="card-header border-bottom border-white border-opacity-10 px-4 px-md-5 py-4 d-flex flex-wrap justify-content-between align-items-center gap-3"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <h2
            className="fs-3 text-white m-0 tracking-tight"
            style={{
              fontFamily: "var(--font-syne)",
              letterSpacing: "-0.04em",
              fontWeight: 900,
            }}
          >
            <span className="text-gradient-emerald">Manage</span> Users
          </h2>

          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* COMPACT SEARCH */}
            <div
              className="glass-card-stitch p-1 rounded-pill d-flex align-items-center border border-white border-opacity-10 shadow-lg"
              style={{
                width: "280px",
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="ps-2" style={{ color: "#2bdd66" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                className="form-control bg-transparent border-0 text-white shadow-none py-1 px-3 fw-bold placeholder-white-40"
                placeholder="Search Users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: "0.85rem" }}
              />
              {searchTerm && (
                <button
                  className="btn btn-link text-white opacity-30 p-1 me-1 hover-opacity-100 transition-all shadow-none border-0"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={openCreateModal}
              className="btn bg-gradient-primary text-white fw-bold d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm hover-float transition-all border-0"
              style={{ fontSize: "0.85rem" }}
            >
              <UserPlusIcon />
              {isDispatcher ? "Request Driver" : "Invite User"}
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead className="glass-thead">
                <tr>
                  <th
                    className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                    style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                    style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                  >
                    Email
                  </th>
                  <th
                    className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                    style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                  >
                    Role
                  </th>
                  <th
                    className="px-4 py-3 fw-bold text-white text-uppercase text-center opacity-35"
                    style={{ letterSpacing: "0.15rem", fontSize: "0.65rem" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-5 text-white opacity-50 fw-bold">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-5 text-white opacity-50 fw-bold">
                    {isDispatcher ? 'No requested drivers found.' : 'No users found.'}
                  </td></tr>
                ) : filteredUsers.map(u => (
                  <tr key={u._id} className="glass-row transition-all">
                    <td className="px-4 py-4 text-center">
                      <span className="fw-black text-white fs-6">{u.name}</span>
                    </td>
                    <td className="px-4 py-4 text-white text-opacity-50 text-center fw-medium">{u.email}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="d-flex flex-column align-items-center gap-1">
                        <span className={`badge rounded-pill fw-black px-3 py-2 d-flex align-items-center gap-2 shadow-sm ${
                          u.role === 'Admin' ? 'role-badge-admin' :
                          u.role === 'Dispatcher' ? 'role-badge-dispatcher' : 'role-badge-driver'
                        }`}>
                          {u.role === 'Admin' ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                          ) : u.role === 'Dispatcher' ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          )}
                          {u.role}
                        </span>
                        {u.isPending && (
                          <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning px-2 py-1 x-small fw-bold mt-1">Pending</span>
                        )}
                        {u.isLocked && (
                          <span className="badge rounded-pill bg-danger bg-opacity-10 text-danger px-2 py-1 x-small fw-bold mt-1">
                            <i className="bi bi-lock-fill me-1"></i>Locked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {u.isLocked && isAdmin && (u.role !== 'Admin' || u._id === currentUser?.id) && (
                          <button
                            onClick={() => handleUnlock(u._id)}
                            className="btn btn-sm fw-bold rounded-pill px-3 shadow-sm transition-all hover-float"
                            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', color: 'white', fontSize: '0.75rem' }}
                          >
                            Unlock
                          </button>
                        )}
                        {u.resetPasswordRequested && isAdmin && (
                          <button
                            onClick={() => handleApproveReset(u._id)}
                            className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm transition-all hover-float"
                            style={{ background: 'linear-gradient(135deg, #2bdd66 0%, #059669 100%)', border: 'none', fontSize: '0.75rem' }}
                          >Approve Reset</button>
                        )}
                        {u.resetPasswordApproved && (
                          <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-2 py-1 small fw-bold">Reset Approved</span>
                        )}
                        {isAdmin && (
                          <button onClick={() => handleRevokeSession(u)} className="btn btn-sm btn-outline-warning-20 rounded-pill px-3 fw-bold hover-bg-warning-opacity transition-all" style={{ fontSize: '0.75rem' }} title="Instantly log out this user everywhere">Revoke</button>
                        )}
                        {isAdmin && (u.role !== 'Admin' || u._id === currentUser?.id) && (
                          <button onClick={() => openEditModal(u)} className="btn btn-sm btn-outline-white-20 rounded-pill px-3 fw-bold hover-bg-white-10 transition-all" style={{ fontSize: '0.75rem' }}>Edit</button>
                        )}
                        {isAdmin && u.role !== 'Admin' && (
                          <button onClick={() => handleDelete(u)} className="btn btn-sm btn-outline-danger-20 rounded-pill px-3 fw-bold hover-bg-danger-opacity transition-all" style={{ fontSize: '0.75rem' }}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

              {/* NEXT PAGE > */}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-circle-nav d-flex align-items-center justify-content-center shadow-lg"
                title="Next"
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
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {/* LAST PAGE » */}
              <button
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                className="btn-circle-nav d-flex align-items-center justify-content-center shadow-lg"
                title="Last Page"
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
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <ModalPortal>
          {/* Transparent backdrop for floating effect */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              background: "transparent",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center", // Centered
              padding: "24px 16px", // Standard padding
              overflowY: "auto",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            {/* Solid dark modal card */}
            <div
              className="animate-scale-in w-100"
              style={{
                maxWidth: "560px",
                background: "rgb(13, 18, 38)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
                padding: "36px 40px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3
                  className="fs-3 text-white m-0"
                  style={{
                    fontFamily: "var(--font-syne)",
                    letterSpacing: "-0.04em",
                    fontWeight: 900,
                  }}
                >
                  {isEditing ? (
                    <>
                      <span className="text-gradient-emerald">Edit</span> User
                    </>
                  ) : isDispatcher ? (
                    <>
                      <span className="text-gradient-emerald">Request</span> New
                      Driver
                    </>
                  ) : (
                    <>
                      <span className="text-gradient-emerald">Invite</span> New
                      User
                    </>
                  )}
                </h3>
                <button className="btn-close btn-close-white shadow-none opacity-50 hover-opacity-100" onClick={() => setShowModal(false)}></button>
              </div>

              <p className="small text-white opacity-50 mb-4 fw-medium">
                {isEditing
                  ? "Update account details. Email cannot be changed during registration."
                  : isDispatcher
                    ? "Fill in the driver's details. An admin will review the request and send an official invitation."
                    : "Invited users will become active as soon as they complete their registration and set a password."}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="row g-3">
                  <div className="col-md-6 mb-3">
                    <label
                      className="small fw-black text-emerald mb-2 px-1 text-uppercase tracking-widest"
                      style={{ fontSize: "0.85rem" }}
                    >
                      First Name *
                    </label>
                    <div className="position-relative">
                      <div className="modal-input-icon">
                        <UserIcon />
                      </div>
                      <input
                        type="text"
                        placeholder="John"
                        className={`form-control modal-input ${errors.firstName ? "error-border" : ""}`}
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-danger x-small mt-2 fw-bold px-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label
                      className="small fw-black text-emerald mb-2 px-1 text-uppercase tracking-widest"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Last Name *
                    </label>
                    <div className="position-relative">
                      <div className="modal-input-icon">
                        <UserIcon />
                      </div>
                      <input
                        type="text"
                        placeholder="Doe"
                        className={`form-control modal-input ${errors.lastName ? "error-border" : ""}`}
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-danger x-small mt-2 fw-bold px-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="small fw-black text-emerald mb-2 px-1 text-uppercase tracking-widest"
                    style={{ fontSize: "0.85rem" }}
                  >
                    Email Address *
                  </label>
                  <div className="position-relative">
                    <div className="modal-input-icon">
                      <MailIcon />
                    </div>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      disabled={isEditing}
                      className={`form-control modal-input ${errors.email ? "error-border" : ""}`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {isEditing && (
                    <div className="x-small text-white opacity-40 mt-1 px-1">
                      Email address is locked for existing users.
                    </div>
                  )}
                  {errors.email && (
                    <p className="text-danger x-small mt-2 fw-bold px-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {!isDispatcher && (
                  <div className="mb-5">
                    <label
                      className="small fw-black text-emerald mb-2 px-1 text-uppercase tracking-widest"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Account Role *
                    </label>
                    <div className="position-relative">
                      <div className="modal-input-icon">
                        <ShieldIcon />
                      </div>
                      <input
                        type="hidden"
                        {...register("role", { required: true })}
                      />
                      <RoleDropdown
                        value={watch("role") || "Driver"}
                        onChange={(v) =>
                          setValue("role", v, { shouldValidate: true })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn btn-glass-secondary w-50 rounded-pill py-3 fw-bold transition-all"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-emerald-solid w-50 text-dark rounded-pill py-3 fw-black shadow-lg border-0 transition-all hover-float"
                  >
                    {isEditing
                      ? "Save Changes"
                      : isDispatcher
                        ? "Submit Request"
                        : "Send Invitation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <ModalPortal>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(12px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              className="animate-scale-in w-100"
              style={{
                maxWidth: "420px",
                background: "rgb(13, 18, 38)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "24px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <div
                className="mb-4 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
              <h3
                className="text-white fw-black mb-3"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Delete User?
              </h3>
              <p className="text-white opacity-50 mb-4 fw-medium">
                Are you sure you want to permanently delete{" "}
                <strong>{deleteTarget?.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-glass-secondary w-50 rounded-pill py-2 fw-bold"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn w-50 rounded-pill py-2 fw-black border-0"
                  style={{ background: "#ef4444", color: "#fff" }}
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
      {/* CUSTOM REVOKE CONFIRMATION MODAL */}
      {showRevokeConfirm && (
        <ModalPortal>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              className="animate-scale-in w-100"
              style={{
                maxWidth: "420px",
                background: "rgb(13, 18, 38)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                borderRadius: "24px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <div
                className="mb-4 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(245, 158, 11, 0.1)",
                  color: "#f59e0b",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3
                className="text-white fw-black mb-3"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                Revoke Sessions?
              </h3>
              <p className="text-white opacity-50 mb-4 fw-medium">
                Are you sure you want to log out{" "}
                <strong>{revokeTarget?.name}</strong> from all devices? They
                will need to sign in again.
              </p>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-glass-secondary w-50 rounded-pill py-2 fw-bold"
                  onClick={() => setShowRevokeConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn w-50 rounded-pill py-2 fw-black border-0"
                  style={{ background: "#f59e0b", color: "#000" }}
                  onClick={confirmRevoke}
                >
                  Yes, Revoke
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
      {/* STATUS FEEDBACK MODAL */}
      {actionStatus && (
        <ModalPortal>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999999,
              background: "rgba(0,0,0,0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              className="animate-scale-in w-100"
              style={{
                maxWidth: "400px",
                background: "rgb(13, 18, 38)",
                border: `1px solid ${actionStatus.type === "success" ? "rgba(45, 221, 102, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                borderRadius: "24px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <div
                className="mb-4 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background:
                    actionStatus.type === "success"
                      ? "rgba(45, 221, 102, 0.1)"
                      : "rgba(239, 68, 68, 0.1)",
                  color:
                    actionStatus.type === "success" ? "#2bdd66" : "#ef4444",
                }}
              >
                {actionStatus.type === "success" ? (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                )}
              </div>
              <p className="text-white fw-bold mb-4">{actionStatus.message}</p>
              <button
                className="btn btn-glass-secondary w-100 rounded-pill py-2 fw-bold"
                onClick={() => setActionStatus(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </ModalPortal>
      )}{" "}
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
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .glass-row:hover {
          background: rgba(255, 255, 255, 0.04) !important;
        }
        .fw-black {
          font-weight: 900;
        }
        .tracking-wider {
          letter-spacing: 0.15em;
          font-size: 0.7rem;
        }
        .hover-float:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
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
        .x-small {
          font-size: 0.65rem;
        }

        .role-badge-admin {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .role-badge-dispatcher {
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .role-badge-driver {
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.2);
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
        .btn-outline-warning-20 {
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: rgba(245, 158, 11, 0.8);
        }
        .btn-outline-warning-20:hover {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border-color: rgba(245, 158, 11, 0.5);
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

        .modal-input {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          padding: 1rem 1rem 1rem 3.5rem !important;
          border-radius: 16px !important;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .modal-input:focus {
          background: rgba(255, 255, 255, 0.07) !important;
          border-color: #2bdd66 !important;
          box-shadow: 0 0 15px rgba(43, 221, 102, 0.15) !important;
        }
        .modal-input-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: #2bdd66; opacity: 0.7; z-index: 5; }
        .btn-emerald-solid { background: #2bdd66; color: #000 !important; cursor: pointer; }
        .btn-glass-secondary { background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid rgba(255, 255, 255, 0.1); }
      `}</style>
    </>
  );
}
