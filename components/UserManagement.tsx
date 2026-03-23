"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearch } from "@/context/SearchContext";

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: string;
};

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
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");
  const { searchTerm } = useSearch();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>();

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

  useEffect(() => { fetchUsers(); }, []);

  const onSubmit = async (data: UserFormData) => {
    if (isEditing) {
      try {
        const body = { name: data.name, email: data.email, role: data.role };
        const res = await fetch(`/api/users/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) { setShowModal(false); fetchUsers(); }
        else alert('Failed to update user');
      } catch (err) { console.error("Update error", err); }
    } else {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) { setShowModal(false); fetchUsers(); }
        else {
          const errData = await res.json();
          alert(`Failed to create user: ${errData.error}`);
        }
      } catch (error) { console.error("Create error:", error); }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
      else alert('Failed to delete user');
    } catch (error) { console.error("Delete error:", error); }
  };

  const handleUnlock = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}/unlock`, { method: "POST" });
      if (res.ok) fetchUsers();
      else alert('Failed to unlock account');
    } catch (error) { console.error("Unlock error:", error); }
  };

  const handleApproveReset = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}/approve-reset`, { method: "POST" });
      if (res.ok) fetchUsers();
      else alert('Failed to approve reset');
    } catch (error) { console.error("Approve reset error:", error); }
  };

  const openEditModal = (user: User) => {
    setEditingId(user._id);
    reset({ name: user.name, email: user.email, password: "", role: user.role });
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingId("");
    reset({ name: "", email: "", password: "", role: "Driver" });
    setIsEditing(false);
    setShowModal(true);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden glass-card animate-slide-up">
        <div className="card-header bg-white bg-opacity-50 border-bottom border-secondary border-opacity-10 px-4 px-md-5 py-4 d-flex justify-content-between align-items-center">
          <h2 className="fs-4 fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-syne)' }}>Manage Users</h2>
          <button onClick={openCreateModal} className="btn bg-gradient-primary text-white fw-bold d-flex align-items-center gap-2 rounded-3 shadow-sm hover-float">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Invite User
          </button>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3 fw-bold text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Name</th>
                  <th className="px-4 py-3 fw-bold text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Email</th>
                  <th className="px-4 py-3 fw-bold text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Role</th>
                  <th className="px-4 py-3 fw-bold text-secondary text-uppercase text-end" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-5 text-muted">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-5 text-muted">No users found.</td></tr>
                ) : filteredUsers.map(u => (
                  <tr key={u._id} className="border-bottom border-light transition-all hover-bg-light">
                    <td className="px-4 py-3 fw-bold text-dark">{u.name}</td>
                    <td className="px-4 py-3 text-secondary">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge rounded-pill fw-bold bg-opacity-10 px-3 py-2 ${
                        u.role === 'Admin' ? 'bg-danger text-danger' :
                        u.role === 'Dispatcher' ? 'bg-success text-success' : 'bg-primary text-primary'
                      }`}>{u.role}</span>
                      {u.isPending && (
                        <span className="ms-2 badge rounded-pill bg-warning bg-opacity-10 text-warning px-2 py-1 small fw-bold">Pending</span>
                      )}
                      {u.isLocked && (
                        <span className="ms-2 badge rounded-pill bg-danger bg-opacity-10 text-danger px-2 py-1 small fw-bold">
                          <i className="bi bi-lock-fill me-1"></i>Locked
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      {u.isLocked && (
                        <button
                          onClick={() => handleUnlock(u._id)}
                          className="btn btn-sm fw-bold rounded-3 me-2 shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', border: 'none', color: 'white' }}
                        >
                          <i className="bi bi-unlock-fill me-1"></i>Unlock
                        </button>
                      )}
                      {u.resetPasswordRequested && (
                        <button
                          onClick={() => handleApproveReset(u._id)}
                          className="btn btn-sm btn-success rounded-3 me-2 fw-bold shadow-sm"
                          style={{ background: 'linear-gradient(135deg, #2bdd66 0%, #059669 100%)', border: 'none' }}
                        >Approve Reset</button>
                      )}
                      {u.resetPasswordApproved && (
                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-2 py-1 small fw-bold me-2">Reset Approved</span>
                      )}
                      <button onClick={() => openEditModal(u)} className="btn btn-sm btn-outline-secondary rounded-3 me-2">Edit</button>
                      <button onClick={() => handleDelete(u._id, u.name)} className="btn btn-sm btn-outline-danger rounded-3">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center animate-fade-in" style={{ zIndex: 2000 }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="card border-0 shadow-2xl rounded-5 p-4 p-md-5 glass-card position-relative z-1 animate-slide-up modal-scroll" style={{ width: '95%', maxWidth: '550px', maxHeight: '90vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fs-3 fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-syne)' }}>{isEditing ? 'Edit User' : 'Invite New User'}</h3>
              <button className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
            </div>

            <p className="small text-secondary mb-4">
              {isEditing ? "Update account details. Email cannot be changed during registration." : "Invited users will receive access once they register with this email and set their password."}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-4">
                <label className="small fw-bold text-secondary mb-2 px-1 text-uppercase" style={{ letterSpacing: '0.05em' }}>Full Name *</label>
                <input type="text" placeholder="John Doe"
                  className={`form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50 ${errors.name ? 'border-danger' : ''}`}
                  {...register("name", { required: "Full name is required" })} />
                {errors.name && <p className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label className="small fw-bold text-secondary mb-2 px-1 text-uppercase" style={{ letterSpacing: '0.05em' }}>Email *</label>
                <input type="email" placeholder="john@example.com" disabled={isEditing}
                  className={`form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50 ${errors.email ? 'border-danger' : ''}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" }
                  })} />
                {isEditing && <div className="x-small text-muted mt-1 px-1">Email address is locked for registered users.</div>}
                {errors.email && <p className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.email.message}</p>}
              </div>
              <div className="mb-5">
                <label className="small fw-bold text-secondary mb-2 px-1 text-uppercase" style={{ letterSpacing: '0.05em' }}>Role *</label>
                <select className="form-select rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50 fw-bold text-dark"
                  {...register("role", { required: true })}>
                  <option value="Driver">Driver</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="d-flex gap-3 mt-4">
                <button type="button" className="btn btn-light w-50 rounded-4 py-3 fw-bold shadow-sm transition-all" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn bg-gradient-primary w-50 text-white rounded-4 py-3 fw-bold shadow-lg border-0 transition-all hover-float">
                  {isEditing ? 'Save Changes' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
