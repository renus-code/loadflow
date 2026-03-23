"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearch } from "@/context/SearchContext";

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
};

// --- PREMIUM-STYLE ICONS ---
const UserPlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

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
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    const submissionData = {
      name: fullName,
      email: data.email,
      role: data.role,
      password: data.password
    };

    if (isEditing) {
      try {
        const res = await fetch(`/api/users/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });
        if (res.ok) { setShowModal(false); fetchUsers(); }
        else alert('Failed to update user');
      } catch (err) { console.error("Update error", err); }
    } else {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
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
    const nameParts = user.name.split(" ");
    const fName = nameParts[0] || "";
    const lName = nameParts.slice(1).join(" ") || "";
    
    reset({ firstName: fName, lastName: lName, email: user.email, password: "", role: user.role });
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingId("");
    reset({ firstName: "", lastName: "", email: "", password: "", role: "Driver" });
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
            <UserPlusIcon />
            Invite User
          </button>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 custom-table">
              <thead className="glass-thead">
                <tr>
                  <th className="px-4 py-4 fw-black text-white text-uppercase tracking-wider text-center">Name</th>
                  <th className="px-4 py-4 fw-black text-white text-uppercase tracking-wider text-center">Email</th>
                  <th className="px-4 py-4 fw-black text-white text-uppercase tracking-wider text-center">Role</th>
                  <th className="px-4 py-4 fw-black text-white text-uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-5 text-muted">Loading users...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-5 text-muted">No users found.</td></tr>
                ) : filteredUsers.map(u => (
                  <tr key={u._id} className="glass-row">
                    <td className="px-4 py-3 text-center">
                      <span className="fw-black text-white">{u.name}</span>
                    </td>
                    <td className="px-4 py-3 text-white text-opacity-75 text-center small tracking-tight">{u.email}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="d-flex flex-column align-items-center gap-1">
                        <span className={`badge rounded-pill fw-black bg-opacity-10 px-3 py-2 d-flex align-items-center gap-2 ${
                          u.role === 'Admin' ? 'bg-danger text-danger' :
                          u.role === 'Dispatcher' ? 'bg-success text-success' : 'bg-primary text-primary'
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
                          <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning px-2 py-1 x-small fw-bold">Pending</span>
                        )}
                        {u.isLocked && (
                          <span className="badge rounded-pill bg-danger bg-opacity-10 text-danger px-2 py-1 x-small fw-bold">
                            <i className="bi bi-lock-fill me-1"></i>Locked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
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
                      <button onClick={() => openEditModal(u)} className="btn btn-sm btn-outline-light rounded-3 me-2">Edit</button>
                      <button onClick={() => handleDelete(u._id, u.name)} className="btn btn-sm btn-outline-danger rounded-3 fw-bold">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay d-flex align-items-center justify-content-center animate-fade-in">
          <div className="modal-backdrop-blur" onClick={() => setShowModal(false)}></div>
          <div className="card modal-content border-0 shadow-2xl rounded-5 p-4 p-md-5 glass-card-solid position-relative z-1 animate-slide-up" style={{ maxWidth: '550px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fs-3 fw-black text-white m-0" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.02em' }}>
                {isEditing ? 'Edit User' : 'Invite New User'}
              </h3>
              <button className="btn-close btn-close-white shadow-none opacity-50 hover-opacity-100" onClick={() => setShowModal(false)}></button>
            </div>

            <p className="small text-white opacity-50 mb-4 fw-medium">
              {isEditing ? "Update account details. Email cannot be changed during registration." : "Invited users will receive access once they register with this email and set their password."}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="row g-3">
                <div className="col-md-6 mb-3">
                  <label className="small fw-black text-emerald mb-2 px-1 text-uppercase tracking-widest" style={{ fontSize: '0.85rem' }}>First Name *</label>
                  <div className="position-relative">
                    <div className="modal-input-icon"><UserIcon /></div>
                    <input type="text" placeholder="John"
                      className={`form-control modal-input ${errors.firstName ? 'error-border' : ''}`}
                      {...register("firstName", { required: "First name is required" })} />
                  </div>
                  {errors.firstName && <p className="text-danger x-small mt-2 fw-bold px-1">{errors.firstName.message}</p>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="small fw-black text-emerald mb-2 px-1 text-uppercase tracking-widest" style={{ fontSize: '0.85rem' }}>Last Name *</label>
                  <div className="position-relative">
                    <div className="modal-input-icon"><UserIcon /></div>
                    <input type="text" placeholder="Doe"
                      className={`form-control modal-input ${errors.lastName ? 'error-border' : ''}`}
                      {...register("lastName", { required: "Last name is required" })} />
                  </div>
                  {errors.lastName && <p className="text-danger x-small mt-2 fw-bold px-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="small fw-black text-emerald mb-2 px-1 text-uppercase tracking-widest" style={{ fontSize: '0.85rem' }}>Email Address *</label>
                <div className="position-relative">
                  <div className="modal-input-icon"><MailIcon /></div>
                  <input type="email" placeholder="john@example.com" disabled={isEditing}
                    className={`form-control modal-input ${errors.email ? 'error-border' : ''}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" }
                    })} />
                </div>
                {isEditing && <div className="x-small text-white opacity-40 mt-1 px-1">Email address is locked for existing users.</div>}
                {errors.email && <p className="text-danger x-small mt-2 fw-bold px-1">{errors.email.message}</p>}
              </div>

              <div className="mb-5">
                <label className="small fw-black text-emerald mb-2 px-1 text-uppercase tracking-widest" style={{ fontSize: '0.85rem' }}>Account Role *</label>
                <div className="position-relative">
                   <div className="modal-input-icon"><ShieldIcon /></div>
                   <select className="form-select modal-input fw-bold"
                    {...register("role", { required: true })}>
                    <option value="Driver">Driver</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button type="button" className="btn btn-glass-secondary w-50 rounded-pill py-3 fw-bold transition-all" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-emerald-solid w-50 text-dark rounded-pill py-3 fw-black shadow-lg border-0 transition-all hover-float">
                  {isEditing ? 'Save Changes' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       <style jsx>{`
        .glass-card { background: rgba(9, 19, 40, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1) !important; }
        .glass-card-solid { background: rgba(13, 22, 45, 0.98); backdrop-filter: blur(50px); border: 1px solid rgba(255, 255, 255, 0.15) !important; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6); }
        .glass-thead { background: rgba(255, 255, 255, 0.05); }
        .glass-row { transition: all 0.3s ease; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .glass-row:hover { background: rgba(255, 255, 255, 0.05) !important; }
        .fw-black { font-weight: 900; }
        .tracking-wider { letter-spacing: 0.1em; font-size: 0.7rem; }
        .hover-float:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important; }
        .bg-gradient-primary { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: none !important; }
        .custom-table { border-collapse: separate; border-spacing: 0 4px; }
        .text-emerald { color: #2bdd66 !important; }
        .bg-emerald { background-color: #2bdd66 !important; }
        .x-small { font-size: 0.65rem; }
        .tracking-tight { letter-spacing: -0.01em; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2000; padding: 20px; }
        .modal-backdrop-blur { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px); }
        .modal-input { 
          background: rgba(255, 255, 255, 0.05) !important; 
          border: 1px solid rgba(255, 255, 255, 0.1) !important; 
          color: white !important; 
          padding: 1rem 1rem 1rem 3.5rem !important; 
          border-radius: 16px !important; 
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .modal-input:focus { 
          background: rgba(255, 255, 255, 0.1) !important; 
          border-color: #2bdd66 !important; 
          box-shadow: 0 0 15px rgba(43, 221, 102, 0.2) !important; 
        }
        .modal-input-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: #2bdd66; opacity: 0.8; z-index: 5; }
        .error-border { border-color: #ef4444 !important; }
        .modal-input option {
          background-color: #0d162d !important;
          color: white !important;
          padding: 10px;
        }
        .btn-emerald-solid { background: #2bdd66; color: #000 !important; }
        .btn-glass-secondary { background: rgba(255, 255, 255, 0.05); color: white; border: 1px solid rgba(255, 255, 255, 0.1); }
        .btn-glass-secondary:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </>
  );
}
