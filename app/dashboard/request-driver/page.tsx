/**
 * ======================================================================================
 * PAGE: Fleet Expansion Request (/dashboard/request-driver)
 * ======================================================================================
 * The dispatcher portal for initiating driver recruitment and induction pipelines.
 * 
 * Features:
 * 1. Visual Storytelling: Implements a dual-panel layout with premium CSS illustrations.
 * 2. Form Validation: Uses react-hook-form to ensure candidate emails are syntactically sound.
 * 3. Status Delegation: Submits requests to the administrator queue rather than direct creation.
 * ======================================================================================
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import SystemTimeDisplay from "@/components/SystemTimeDisplay";
import { useForm, SubmitHandler } from "react-hook-form";

interface DriverRequestFields {
  firstName: string;
  lastName: string;
  email: string;
}

const UserPlusIcon = ({ active }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? "#2bdd66" : "currentColor"}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="80"
    height="80"
    style={
      active ? { filter: "drop-shadow(0 0 15px rgba(43, 221, 102, 0.8))" } : {}
    }
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

export default function RequestDriverPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { register, handleSubmit: hookSubmit, formState: { errors }, reset } = useForm<DriverRequestFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    }
  });

  const onSubmit: SubmitHandler<DriverRequestFields> = async (data) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/driver-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Driver request sent successfully to Administrator." });
        reset();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to send driver request." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while sending the request." });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "Dispatcher") {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-emerald" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }



  return (
    <div className="container-fluid px-0 px-md-3 animate-fade-in position-relative d-flex flex-column" style={{ maxWidth: "1600px", height: "100%" }}>
      
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 mt-1 gap-2 border-bottom pb-3 border-opacity-10 border-white">
        <div className="text-start">
          <h1
            className="display-6 fw-black text-white m-0 tracking-tight"
            style={{ 
              fontFamily: "var(--font-syne)", 
              letterSpacing: "-0.04em",
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)" 
            }}
          >
            <span className="text-gradient-emerald">Dispatcher</span> Dashboard
          </h1>
          <SystemTimeDisplay />
        </div>
        
        <div className="d-flex gap-2">
           <Link href="/dashboard" className="btn btn-outline-white-20 rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 small hover-float">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
               <line x1="19" y1="12" x2="5" y2="12"></line>
               <polyline points="12 19 5 12 12 5"></polyline>
             </svg>
             Dashboard Return
           </Link>
        </div>
      </div>

      <div className="row justify-content-center flex-grow-1 align-items-start mt-2">
        <div className="col-12 col-xl-11 px-2">
          {/* PREMIUM SPLIT CONTENT CARD */}
          <div className="card border-0 shadow-2xl rounded-5 overflow-hidden glass-card animate-slide-up h-100" style={{ background: "rgba(6, 10, 20, 0.85)" }}>
            <div className="row g-0 h-100">
              
              {/* LEFT ILLUSTRATION PANEL */}
              <div className="col-md-5 d-none d-md-flex flex-column justify-content-center align-items-center p-5 position-relative overflow-hidden min-vh-50" 
                   style={{ 
                     background: "linear-gradient(145deg, rgba(8, 20, 35, 0.9) 0%, rgba(4, 9, 18, 0.95) 100%)", 
                     borderRight: "1px solid rgba(255,255,255,0.05)" 
                   }}>
                 {/* Decorative background elements */}
                 <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "radial-gradient(circle at top left, rgba(43, 221, 102, 0.12), transparent 70%)" }}></div>
                 <div className="position-absolute bottom-0 end-0 w-100 h-100" style={{ background: "radial-gradient(circle at bottom right, rgba(43, 221, 102, 0.05), transparent 50%)" }}></div>
                 
                 <div className="position-relative z-1 text-center d-flex flex-column align-items-center">
                   <div 
                     className="p-4 rounded-circle border border-emerald border-opacity-20 d-inline-flex mb-4 text-emerald position-relative" 
                     style={{ 
                       background: "rgba(43, 221, 102, 0.1)", // Fix for the solid green circle issue
                       boxShadow: "0 0 50px rgba(45,221,102,0.15)" 
                     }}
                   >
                     <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 rounded-circle border border-emerald border-opacity-30 ping-animation"></div>
                     <UserPlusIcon active />
                   </div>
                   
                   <h2 className="display-6 text-white tracking-tight fw-black mb-3" style={{ fontFamily: 'var(--font-syne)', textShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
                     <span className="text-gradient-emerald">Grow</span> Your Fleet
                   </h2>
                   
                   <p className="text-white opacity-60 px-4 lh-lg" style={{ fontSize: "0.95rem" }}>
                     Submit a new driver candidate for administrative review. Once authorized, they will receive full access to navigate the LoadFlow dispatch network.
                   </p>
                 </div>
              </div>

              {/* RIGHT FORM PANEL */}
              <div className="col-md-7 p-4 p-md-5 d-flex flex-column justify-content-center">
                {message && (
                  <div className={`alert-custom ${message.type === 'success' ? 'alert-success-premium' : 'alert-danger-premium'} rounded-4 px-3 py-2 mb-3 d-flex align-items-center gap-2 animate-fade-in shadow-sm small`}>
                    <div className="flex-shrink-0">
                      {message.type === 'success' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      )}
                    </div>
                    <div className="fw-bold">{message.text}</div>
                  </div>
                )}
                
                <div className="mb-2">
                  <h3 className="fs-4 fw-black text-white tracking-widest text-uppercase d-md-none mb-2 border-bottom border-white border-opacity-10 pb-2">
                    <span className="text-emerald pe-2">✦</span> Request Driver
                  </h3>
                  <p className="text-white opacity-40 small fw-bold tracking-widest text-uppercase mb-1">Complete candidate details</p>
                </div>

                <form onSubmit={hookSubmit(onSubmit)} className="mt-0">
                  <div className="row g-4">
                    {/* FIRST NAME */}
                    <div className="col-md-6 form-group">
                      <label className="form-label text-white fw-bold mb-2 xx-small opacity-80 tracking-widest text-uppercase">First Name</label>
                      <div className={`input-icon-wrapper rounded-4 overflow-hidden border border-opacity-10 shadow-sm transition-all focus-ring-emerald ${errors.firstName ? 'border-danger' : 'border-white'}`}>
                        <input
                          type="text"
                          {...register("firstName", { required: "First name is required" })}
                          className="form-control bg-transparent text-white border-0 px-4 py-3 shadow-none w-100 fw-medium"
                          placeholder="e.g. John"
                          disabled={loading}
                        />
                      </div>
                      {errors.firstName && <div className="text-danger xx-small mt-1 ps-2 fw-bold animate-fade-in">{errors.firstName.message}</div>}
                    </div>

                    {/* LAST NAME */}
                    <div className="col-md-6 form-group">
                      <label className="form-label text-white fw-bold mb-2 xx-small opacity-80 tracking-widest text-uppercase">Last Name</label>
                      <div className={`input-icon-wrapper rounded-4 overflow-hidden border border-opacity-10 shadow-sm transition-all focus-ring-emerald ${errors.lastName ? 'border-danger' : 'border-white'}`}>
                        <input
                          type="text"
                          {...register("lastName", { required: "Last name is required" })}
                          className="form-control bg-transparent text-white border-0 px-4 py-3 shadow-none w-100 fw-medium"
                          placeholder="e.g. Doe"
                          disabled={loading}
                        />
                      </div>
                      {errors.lastName && <div className="text-danger xx-small mt-1 ps-2 fw-bold animate-fade-in">{errors.lastName.message}</div>}
                    </div>

                    {/* EMAIL */}
                    <div className="col-12 form-group">
                      <label className="form-label text-white fw-bold mb-2 xx-small opacity-80 tracking-widest text-uppercase">Direct Email Address</label>
                      <div className={`input-icon-wrapper rounded-4 overflow-hidden border border-opacity-10 shadow-sm transition-all focus-ring-emerald ${errors.email ? 'border-danger' : 'border-white'}`}>
                        <input
                          type="email"
                          {...register("email", { 
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          })}
                          className="form-control bg-transparent text-white border-0 px-4 py-3 shadow-none w-100 fw-medium"
                          placeholder="john.doe@loadflow.com"
                          disabled={loading}
                        />
                      </div>
                      {errors.email && <div className="text-danger xx-small mt-1 ps-2 fw-bold animate-fade-in">{errors.email.message}</div>}
                    </div>
                    
                    {/* SUBMIT BUTTON */}
                    <div className="col-12 mt-4 pt-4 border-top border-white border-opacity-10 d-flex justify-content-end gap-3">
                      <button
                        type="submit"
                        className="btn btn-emerald rounded-4 fw-black px-5 py-3 shadow-lg hover-float transition-all position-relative overflow-hidden w-100 w-md-auto tracking-widest text-uppercase small"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="d-flex align-items-center justify-content-center">
                             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                             Transmitting...
                          </div>
                        ) : (
                          "Send Request to Admin"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card { 
          background: rgba(10, 15, 30, 0.85); 
          backdrop-filter: blur(30px); 
          -webkit-backdrop-filter: blur(30px); 
          border: 1px solid rgba(255, 255, 255, 0.08) !important; 
        }
        
        .fw-black { font-weight: 900; }
        .text-gradient-emerald { background: linear-gradient(135deg, #2bdd66 0%, #10b981 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .text-emerald { color: #2bdd66 !important; }
        .bg-emerald-solid { background-color: #2bdd66 !important; }
        .alert-success-premium { background: rgba(43, 221, 102, 0.15); color: #2bdd66; border: 1px solid rgba(43, 221, 102, 0.3); }
        .alert-danger-premium { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
        .alert-custom { backdrop-filter: blur(10px); }
        .xx-small { font-size: 0.7rem; }
        
        .btn-emerald {
          background: linear-gradient(135deg, #2bdd66, #10b981) !important;
          color: #060A14 !important;
          border: none;
        }
        .btn-emerald:hover {
          box-shadow: 0 0 25px rgba(43, 221, 102, 0.5);
          transform: translateY(-2px);
        }
        .btn-emerald:disabled {
          opacity: 0.7;
          box-shadow: none;
          transform: none;
        }
        
        .btn-outline-white-20 { border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.75); }
        .btn-outline-white-20:hover { background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.5); }
        
        .input-icon-wrapper { 
          background: rgba(0, 0, 0, 0.3) !important; 
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          transition: all 0.3s ease;
        }
        .input-icon-wrapper:hover {
          background: rgba(255,255,255,0.04);
        }
        .focus-ring-emerald:focus-within {
          border-color: rgba(43, 221, 102, 0.5) !important;
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 4px rgba(43, 221, 102, 0.1) !important;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #0a101f inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
        }

        .hover-float:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.4) !important; }
        .hover-bg-white-5:hover { background: rgba(255,255,255,0.05); }
        
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        
        .ping-animation {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
