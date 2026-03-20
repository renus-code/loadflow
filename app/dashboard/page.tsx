"use client";

import { useEffect, useState } from "react";

// Update the interface to match MongoDB model
interface Load {
  _id: string;
  pickupLocation: string;
  deliveryLocation: string;
  trailerNumber: string;
  truckNumber: string;
  pickupAppointmentNumber: string;
  pickupTime: string;
  deliveryTime: string;
  deliveryAppointmentTime: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  weight: number;
  quantity: number;
  status: 'Pending' | 'Assigned' | 'Transit' | 'Delivered';
  createdAt: string;
}

function formatStatus(status: string) {
  const baseClasses = "badge rounded-pill py-2 px-3 fw-bold border shadow-sm transition-all hover-glow";
  switch (status) {
    case "Transit":
    case "In Transit":
      return (
        <span className={`${baseClasses} bg-info bg-opacity-10 text-info border-info border-opacity-25`}>
          <span className="d-inline-block rounded-circle bg-info me-2 pulse-slow" style={{ width: '8px', height: '8px' }}></span>
          In Transit
        </span>
      );
    case "Delivered":
      return (
        <span className={`${baseClasses} bg-success bg-opacity-10 text-success border-success border-opacity-25`}>
          <span className="d-inline-block rounded-circle bg-success me-2" style={{ width: '8px', height: '8px' }}></span>
          Delivered
        </span>
      );
    case "Pending":
      return (
        <span className={`${baseClasses} bg-warning bg-opacity-10 text-dark border-warning border-opacity-25`}>
          <span className="d-inline-block rounded-circle bg-warning me-2" style={{ width: '8px', height: '8px' }}></span>
          Pending
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25`}>
          <span className="d-inline-block rounded-circle bg-secondary me-2" style={{ width: '8px', height: '8px' }}></span>
          {status}
        </span>
      );
  }
}

export default function Dashboard() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    trailerNumber: "",
    truckNumber: "",
    pickupAppointmentNumber: "",
    pickupTime: "",
    deliveryTime: "",
    deliveryAppointmentTime: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    appointmentTime: new Date().toISOString().split('T')[0],
    weight: "",
    quantity: ""
  });

  const fetchLoads = async () => {
    try {
      const res = await fetch("/api/loads");
      if (res.ok) {
        const data = await res.json();
        setLoads(data);
      }
    } catch (error) {
      console.error("Failed to fetch loads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchLoads();
  }, []);

  const handleCreateLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/loads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          pickupLocation: "",
          deliveryLocation: "",
          trailerNumber: "",
          truckNumber: "",
          pickupAppointmentNumber: "",
          pickupTime: "",
          deliveryTime: "",
          deliveryAppointmentTime: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          appointmentTime: new Date().toISOString().split('T')[0],
          weight: "",
          quantity: ""
        });
        fetchLoads();
      }
    } catch (error) {
      console.error("Failed to create load:", error);
    }
  };

  const handleDeleteLoad = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dispatch?")) return;
    try {
      const res = await fetch(`/api/loads/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchLoads();
      }
    } catch (error) {
      console.error("Failed to delete load:", error);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/loads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLoads();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const todayStr = mounted ? new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "Loading...";

  const totalLoads = loads.length;
  const inTransit = loads.filter(l => (l.status as string) === "In Transit" || l.status === "Transit").length;
  const delivered = loads.filter(l => l.status === "Delivered").length;
  const pending = loads.filter(l => l.status === "Pending").length;

  return (
    <div className="container-fluid px-0 px-md-3 pb-5" style={{ maxWidth: '1280px' }}>
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3 animate-fade-in">
        <div>
          <h1 className="fs-1 fw-bold text-dark m-0 tracking-tight text-glow-primary" style={{ fontFamily: 'var(--font-syne)' }}>
            Overview
          </h1>
          <p className="text-secondary mt-1 fw-medium mb-0 opacity-75">{todayStr}</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn border-0 text-white fw-bold px-4 py-3 d-inline-flex align-items-center gap-2 rounded-4 shadow-lg hover-shadow-sm transition-all bg-gradient-primary hover-float" 
          style={{ letterSpacing: '0.02em' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create Load
        </button>
      </div>

      {/* ... (stats cards remain same) ... */}

      {/* STATS CARDS */}
      <div className="row g-4 mb-5">
        {[
          { 
            label: "Total Loads", value: totalLoads, sub: "Real-time sync",
            gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
            trend: "+12%"
          },
          { 
            label: "In Transit", value: inTransit, sub: "Live tracking",
            gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
            trend: "+4%"
          },
          { 
            label: "Delivered", value: delivered, sub: "Full validation",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 10 0 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
            trend: "+22%"
          },
          { 
            label: "Pending", value: pending, sub: "Awaiting action",
            gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
            trend: "-2%"
          },
        ].map((stat, i) => (
          <div key={i} className={`col-12 col-sm-6 col-lg-3 animate-slide-up delay-${(i + 1) * 100}`}>
            <div className="card h-100 border-0 shadow-lg rounded-4 p-4 glass-card hover-float overflow-hidden" style={{ transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
              <div 
                className="position-absolute top-0 end-0 opacity-10" 
                style={{ transform: 'translate(20%, -20%) scale(2)', color: 'white' }}
              >
                {stat.icon}
              </div>
              <div className="card-body p-0 d-flex flex-column position-relative z-1">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div 
                    className="rounded-4 shadow-lg d-flex align-items-center justify-content-center text-white" 
                    style={{ width: '56px', height: '56px', background: stat.gradient }}
                  >
                    {stat.icon}
                  </div>
                  <div className={`d-flex align-items-center ${stat.trend.startsWith('+') ? 'text-success' : 'text-danger'} fw-bold gap-1 bg-white bg-opacity-75 px-3 py-1 rounded-pill shadow-sm border border-light`}>
                    {stat.trend}
                  </div>
                </div>
                <div className="fs-1 fw-bold text-dark mb-1 tracking-tight" style={{ fontFamily: 'var(--font-syne)', lineHeight: 1 }}>{stat.value}</div>
                <div className="text-secondary fw-bold mb-1 opacity-75">{stat.label}</div>
                <div className="text-muted small fw-medium opacity-50">{stat.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LOADS TABLE CONTAINER */}
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden glass-card animate-slide-up delay-500">
        <div className="card-header bg-white bg-opacity-50 border-bottom border-secondary border-opacity-10 px-4 px-md-5 py-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <h2 className="fs-4 fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-syne)' }}>Recent Dispatches</h2>
          <div className="d-flex flex-wrap gap-2 p-1 bg-dark bg-opacity-5 rounded-4 border border-secondary border-opacity-10">
            {['All', 'In Transit', 'Pending', 'Delivered'].map((filter, i) => (
              <button 
                key={filter}
                className={`btn btn-sm rounded-3 px-4 py-2 fw-bold transition-all ${i === 0 ? 'bg-white shadow-sm text-dark' : 'text-secondary border-0 hover-bg-white'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead>
                <tr className="bg-light bg-opacity-50">
                  <th className="fw-bold text-secondary py-4 px-4 px-md-5 border-0 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Route</th>
                  <th className="fw-bold text-secondary py-4 px-3 px-md-4 border-0 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Trailer</th>
                  <th className="fw-bold text-secondary py-4 px-3 px-md-4 border-0 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Weight</th>
                  <th className="fw-bold text-secondary py-4 px-3 px-md-4 border-0 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Pickup</th>
                  <th className="fw-bold text-secondary py-4 px-3 px-md-4 border-0 text-uppercase tracking-widest text-end" style={{ fontSize: '0.7rem' }}>Actions</th>
                  <th className="fw-bold text-secondary py-4 px-4 px-md-5 border-0 text-uppercase tracking-widest text-end" style={{ fontSize: '0.7rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-5 text-center">
                      <div className="animate-pulse text-secondary fw-medium">Loading live dispatch data...</div>
                    </td>
                  </tr>
                ) : loads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-5 text-center text-muted fw-medium">
                      No loads found. Click &quot;Create Load&quot; to get started.
                    </td>
                  </tr>
                ) : (
                  loads.map((load, index) => (
                    <tr 
                      key={load._id} 
                      className={`animate-fade-in delay-${(index % 4 + 1) * 100} hover-row transition-all`}
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                    >
                      <td className="px-4 px-md-5 py-4">
                        <div className="fw-bold text-dark fs-6">{load.pickupLocation}</div>
                        <div className="small text-muted fw-medium mt-1 d-flex align-items-center gap-2">
                           <span className="opacity-50 bg-secondary rounded-circle d-inline-block" style={{width: '4px', height: '4px'}}></span>
                           {load.deliveryLocation}
                        </div>
                      </td>
                      <td className="px-3 px-md-4 py-4">
                        <span className="fw-bold text-secondary" style={{fontSize: '0.9rem'}}>{load.trailerNumber}</span>
                      </td>
                      <td className="px-3 px-md-4 py-4">
                        <span className="badge bg-light text-dark border-0 fw-bold px-3 py-2 rounded-3">{load.weight} lbs</span>
                      </td>
                      <td className="px-3 px-md-4 py-4 text-secondary fw-semibold">
                        {new Date(load.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 px-md-4 py-4 text-end">
                        <button 
                          onClick={() => handleDeleteLoad(load._id)}
                          className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2 hover-shadow-sm transition-all"
                          title="Delete Dispatch"
                          aria-label="Delete Dispatch"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </td>
                      <td className="px-4 px-md-5 py-4 text-end">
                        <div className="dropdown d-inline-block">
                          <div 
                            className="cursor-pointer" 
                            data-bs-toggle="dropdown" 
                            style={{ cursor: 'pointer' }}
                          >
                            {formatStatus(load.status)}
                          </div>
                          <ul className="dropdown-menu dropdown-menu-end rounded-4 shadow-lg border-0 p-2 animate-slide-up">
                            <li><h6 className="dropdown-header small text-uppercase opacity-50 fw-bold">Update Status</h6></li>
                            {['Pending', 'In Transit', 'Delivered'].map(s => (
                              <li key={s}>
                                <button 
                                  className="dropdown-item rounded-3 fw-bold small py-2" 
                                  onClick={() => handleStatusUpdate(load._id, s)}
                                >
                                  {s}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* NEW DISPATCH MODAL */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center animate-fade-in" style={{ zIndex: 2000 }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="card border-0 shadow-2xl rounded-5 p-4 p-md-5 glass-card position-relative z-1 animate-slide-up" style={{ width: '95%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fs-3 fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-syne)' }}>Create New Load</h3>
              <button className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleCreateLoad} className="row g-4">
              <div className="col-12">
                <h5 className="fw-bold text-primary mb-0" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h5>
                <hr className="mt-2 mb-0 opacity-10" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Pickup Location</label>
                <input required className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.pickupLocation} onChange={e => setFormData({...formData, pickupLocation: e.target.value})} placeholder="Origin City, State" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Delivery Location</label>
                <input required className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.deliveryLocation} onChange={e => setFormData({...formData, deliveryLocation: e.target.value})} placeholder="Destination City, State" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Truck Number</label>
                <input required className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.truckNumber} onChange={e => setFormData({...formData, truckNumber: e.target.value})} placeholder="TRK-999" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Trailer Number</label>
                <input required className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.trailerNumber} onChange={e => setFormData({...formData, trailerNumber: e.target.value})} placeholder="TRL-12345" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Weight (lbs)</label>
                <input required type="number" className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="45000" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Quantity</label>
                <input required type="number" className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="24" />
              </div>

              <div className="col-12 mt-5">
                <h5 className="fw-bold text-primary mb-0" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appointments & Logistics</h5>
                <hr className="mt-2 mb-0 opacity-10" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Pickup Appt #</label>
                <input className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.pickupAppointmentNumber} onChange={e => setFormData({...formData, pickupAppointmentNumber: e.target.value})} placeholder="P-123456" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Pickup Time</label>
                <input type="time" className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.pickupTime} onChange={e => setFormData({...formData, pickupTime: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Pickup Date</label>
                <input required type="date" className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.appointmentTime} onChange={e => setFormData({...formData, appointmentTime: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Delivery Time</label>
                <input type="time" className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.deliveryTime} onChange={e => setFormData({...formData, deliveryTime: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Delivery Appt Time</label>
                <input type="time" className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.deliveryAppointmentTime} onChange={e => setFormData({...formData, deliveryAppointmentTime: e.target.value})} />
              </div>

              <div className="col-12 mt-5">
                <h5 className="fw-bold text-primary mb-0" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destination Details</h5>
                <hr className="mt-2 mb-0 opacity-10" />
              </div>
              <div className="col-md-6">
                <label className="small fw-bold text-secondary mb-2 px-1">Address</label>
                <input className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Trucker Way" />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold text-secondary mb-2 px-1">City</label>
                <input className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="Chicago" />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold text-secondary mb-2 px-1">State</label>
                <input className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="IL" />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-2 px-1">Postal Code</label>
                <input className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} placeholder="60601" />
              </div>

              <div className="col-12 mt-5">
                <button type="submit" className="btn btn-dark w-100 rounded-4 py-3 fw-bold fs-5 shadow-lg bg-gradient-primary border-0 transition-all hover-float">
                  Create Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .hover-bg-white:hover { background-color: white !important; }
        .hover-row:hover { 
          background-color: rgba(99, 102, 241, 0.02) !important;
          transform: scale(1.002);
          box-shadow: inset 4px 0 0 #6366f1;
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .hover-float:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
        .tracking-tight { letter-spacing: -0.025em; }
        .tracking-widest { letter-spacing: 0.1em; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .pulse-slow { animation: pulse-slow 2s infinite; }
        .backdrop-blur-sm { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      `}</style>
    </div>
  );
}
