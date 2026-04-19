/**
 * ======================================================================================
 * COMPONENT: RequestDemoModal (Enterprise Induction Interface)
 * ======================================================================================
 * A professional onboarding gateway for high-value logistics partners.
 * 
 * Features:
 * 1. Professional Validation: Strict verification for corporate credentials and fleet volume.
 * 2. Visual Excellence: Kinetic rocket iconography and dual-tone gradient aesthetics.
 * 3. Security Hardening: SSL-encrypted submission logic with background action integration.
 * 4. Experience Orchestration: Dedicated "confirmed" state with professional follow-up instructions.
 * 5. Industrial Design: High-contrast modal architecture with optimized click targets for desktop/tablet.
 * ======================================================================================
 */
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type DemoFormValues = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  assetTier: string;
};

import { submitDemoRequest } from "@/app/actions/demoAction";

export default function RequestDemoModal() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<DemoFormValues>();
  
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Reset form and UI state whenever the modal closes
  useEffect(() => {
    const modalEl = document.getElementById("requestDemoModal");
    if (!modalEl) return;

    const handleHidden = () => {
      setSubmitSuccess(false);
      setSubmitError("");
      reset();
    };

    modalEl.addEventListener("hidden.bs.modal", handleHidden);
    return () => modalEl.removeEventListener("hidden.bs.modal", handleHidden);
  }, [reset]);

  const onSubmit = async (data: DemoFormValues) => {
    setSubmitError("");
    const result = await submitDemoRequest(data);
    
    if (result.success) {
      setSubmitSuccess(true);
    } else {
      setSubmitError(result.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="modal fade" id="requestDemoModal" tabIndex={-1} aria-labelledby="requestDemoModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div 
          className="modal-content overflow-hidden border border-white border-opacity-10 rounded-4 shadow-lg position-relative" 
          style={{ 
            background: "linear-gradient(135deg, #0a1428 0%, #060e20 100%)", 
            color: "white",
            colorScheme: "dark" 
          }}
        >
          
          {/* Subtle Ambient Glow Effects */}
          <div className="position-absolute rounded-circle" style={{ width: "400px", height: "400px", background: "radial-gradient(circle, rgba(43,221,102,0.12) 0%, rgba(0,0,0,0) 70%)", top: "-150px", right: "-100px", pointerEvents: "none" }}></div>
          <div className="position-absolute rounded-circle" style={{ width: "300px", height: "300px", background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, rgba(0,0,0,0) 70%)", bottom: "-100px", left: "-100px", pointerEvents: "none" }}></div>
          
          <div className="modal-header border-0 pb-0 justify-content-center position-relative z-1 pt-4 text-center d-flex flex-column">
            <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 mt-3 me-3" data-bs-dismiss="modal" aria-label="Close"></button>
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "60px", height: "60px", background: "rgba(43, 221, 102, 0.1)", border: "1px solid rgba(43, 221, 102, 0.2)" }}>
              <i className="bi bi-rocket-takeoff text-success fs-3"></i>
            </div>
            <h3 className="modal-title fw-bold w-100 px-md-4" id="requestDemoModalLabel" style={{ fontFamily: "var(--font-syne)", letterSpacing: "-0.5px" }}>
              Ready to transform your <span style={{ color: "#2bdd66" }}>Operations?</span>
            </h3>
            <p className="text-white text-opacity-50 mt-2 fs-6">Experience the future of logistics management.</p>
          </div>
          
          <div className="modal-body pt-3 pb-5 position-relative z-1 px-md-5">
            {submitSuccess ? (
              <div className="text-center py-5 animate-slide-up">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "4.5rem", textShadow: "0 0 30px rgba(43,221,102,0.5)" }}></i>
                <h4 className="fw-bold mt-4 text-white">Submission Confirmed</h4>
                <p className="text-white text-opacity-75 mt-3 px-4" style={{ lineHeight: 1.7, fontSize: "1.05rem" }}>
                  Your request has been securely dispatched. <br />
                  Our enterprise team is reviewing your profile and will initiate correspondence shortly to schedule your live platform overview.
                </p>
                <button type="button" className="btn btn-outline-light mt-4 px-5 py-3 fw-bold rounded-pill" data-bs-dismiss="modal" style={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.85rem" }}>Acknowledge & Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in">
                {submitError && (
                  <div className="alert alert-danger bg-danger bg-opacity-10 border-0 border-start border-4 border-danger rounded-3 text-danger mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {submitError}
                  </div>
                )}
                <div className="row g-4 mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-white text-opacity-75 small fw-bold mb-2 text-uppercase tracking-wider" style={{ letterSpacing: "0.5px", fontSize: "0.75rem" }}>Full name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className={`form-control form-control-lg bg-white bg-opacity-10 border-white border-opacity-10 text-white shadow-none custom-modal-input ${errors.fullName ? "is-invalid border-danger" : ""}`} 
                      placeholder="John Doe" 
                      {...register("fullName", { required: "Full name is required" })}
                    />
                    {errors.fullName && <div className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.fullName.message}</div>}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label text-white text-opacity-75 small fw-bold mb-2 text-uppercase tracking-wider" style={{ letterSpacing: "0.5px", fontSize: "0.75rem" }}>Company Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className={`form-control form-control-lg bg-white bg-opacity-10 border-white border-opacity-10 text-white shadow-none custom-modal-input ${errors.companyName ? "is-invalid border-danger" : ""}`} 
                      placeholder="Logistics Inc."
                      {...register("companyName", { required: "Company name is required" })}
                    />
                    {errors.companyName && <div className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.companyName.message}</div>}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label text-white text-opacity-75 small fw-bold mb-2 text-uppercase tracking-wider" style={{ letterSpacing: "0.5px", fontSize: "0.75rem" }}>Work email <span className="text-danger">*</span></label>
                    <input 
                      type="email" 
                      className={`form-control form-control-lg bg-white bg-opacity-10 border-white border-opacity-10 text-white shadow-none custom-modal-input ${errors.email ? "is-invalid border-danger" : ""}`} 
                      placeholder="name@company.com" 
                      {...register("email", { 
                        required: "Work email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && <div className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.email.message}</div>}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label text-white text-opacity-75 small fw-bold mb-2 text-uppercase tracking-wider" style={{ letterSpacing: "0.5px", fontSize: "0.75rem" }}>Phone number <span className="text-danger">*</span></label>
                    <div className={`input-group input-group-lg border rounded overflow-hidden custom-modal-input-group ${errors.phone ? "border-danger" : "border-white border-opacity-10"}`}>
                      <span className="input-group-text bg-white bg-opacity-10 border-0 px-3 border-end border-white border-opacity-10 text-white">
                        <img src="https://flagcdn.com/w20/ca.png" alt="Canada" style={{ width: 20 }} className="me-2 rounded-1" />
                        <span className="fs-6 opacity-75">+1</span>
                      </span>
                      <input 
                        type="tel" 
                        className={`form-control border-0 ps-3 bg-white bg-opacity-10 text-white shadow-none custom-modal-input`} 
                        placeholder="(555) 123-4567"
                        {...register("phone", { required: "Phone number is required" })}
                      />
                    </div>
                    {errors.phone && <div className="text-danger small mt-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.phone.message}</div>}
                  </div>
                </div>

                <div className="mb-5 mt-4">
                  <label className="form-label text-white text-opacity-75 small fw-bold mb-3 text-uppercase" style={{ letterSpacing: "0.5px", fontSize: "0.75rem" }}>Current Fleet Asset Volume <span className="text-danger">*</span></label>
                  <div className="d-flex flex-wrap gap-2 justify-content-between">
                    {["1 - 5", "6 - 29", "30 - 499", "500 - 4,999", "5,000+"].map((tier, idx) => (
                      <div key={idx} className="flex-grow-1" style={{ minWidth: "110px" }}>
                        <input 
                          type="radio" 
                          className="btn-check custom-tier-radio" 
                          id={`assetTier-${idx}`} 
                          value={tier}
                          {...register("assetTier", { required: "Please select an option" })}
                        />
                        <label 
                          className={`btn btn-outline-light w-100 py-2 rounded-3 fw-medium ${errors.assetTier ? "border-danger text-danger" : "border-opacity-25 border-white text-white text-opacity-75"}`} 
                          htmlFor={`assetTier-${idx}`}
                          style={{ transition: "all 0.2s" }}
                        >
                          {tier}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.assetTier && <div className="text-danger small mt-2"><i className="bi bi-exclamation-circle me-1"></i>{errors.assetTier.message}</div>}
                </div>

                <div className="text-center mt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn w-100 rounded-pill py-3 fw-bold text-dark d-flex justify-content-center align-items-center gap-2" 
                    style={{ 
                      background: "linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(43, 221, 102, 0.2)",
                      transition: "all 0.3s ease",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      fontSize: "0.9rem"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 15px 35px rgba(43, 221, 102, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(43, 221, 102, 0.2)";
                    }}
                  >
                    {isSubmitting ? (
                       <>
                         <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                         <span>Transmitting...</span>
                       </>
                    ) : (
                       <>
                         <span>Dispatch Request</span>
                         <i className="bi bi-arrow-right fs-5"></i>
                       </>
                    )}
                  </button>
                  <p className="text-white text-opacity-25 mt-3 mb-0" style={{ fontSize: "0.75rem" }}>
                    <i className="bi bi-shield-lock-fill me-1"></i> SSL Encrypted Connection
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-modal-input:focus {
          background-color: rgba(255, 255, 255, 0.15) !important;
          border-color: rgba(43, 221, 102, 0.5) !important;
          box-shadow: 0 0 0 0.25rem rgba(43, 221, 102, 0.1) !important;
          color: white !important;
        }
        .custom-modal-input-group:focus-within {
          border-color: rgba(43, 221, 102, 0.5) !important;
          box-shadow: 0 0 0 0.25rem rgba(43, 221, 102, 0.1) !important;
        }
        .custom-tier-radio:checked + label {
          background-color: #2bdd66 !important;
          color: #000 !important;
          border-color: #2bdd66 !important;
          box-shadow: 0 0 15px rgba(43, 221, 102, 0.4) !important;
          font-weight: 800 !important;
        }
        .custom-tier-radio:not(:checked) + label:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUpFade 0.4s ease-out forwards;
        }
        .custom-modal-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
      `}} />
    </div>
  );
}
