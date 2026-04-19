/**
 * ======================================================================================
 * COMPONENT: CheckPricesModal (Lead Capture Interface)
 * ======================================================================================
 * A high-conversion, multi-step interface for prospective enterprise clients.
 * 
 * Features:
 * 1. Sequential Progression: 5-stage interactive funnel with real-time validation.
 * 2. Visual Feedback: Integrated progress tracking and "success" state orchestration.
 * 3. Premium Form Controls: Custom Tier selectors and international phone input logic.
 * 4. Ambient Aesthetics: Glassmorphic gradients with pulse animations and nebula glows.
 * 5. Lead Transmission: Secure submission to administrative pricing actions for CRM integration.
 * ======================================================================================
 */
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { submitPricingRequest } from "@/app/actions/demoAction";

type PricingFormValues = {
  assetTier: string;
  email: string;
  fullName: string;
  companyName: string;
  phone: string;
};

export default function CheckPricesModal() {
  const [step, setStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting }
  } = useForm<PricingFormValues>({
    mode: "onChange",
    defaultValues: {
      assetTier: "",
      email: "",
      fullName: "",
      companyName: "",
      phone: ""
    }
  });

  const formValues = watch();

  // Steps Configuration
  const steps = [
    { progress: 0, title: "We can definitely help with that! How many vehicles or assets do you have?", field: "assetTier" },
    { progress: 40, title: "Great! What email should we send the info to?", field: "email" },
    { progress: 65, title: "Almost there! What's your name?", field: "fullName" },
    { progress: 75, title: "Which organization are you with?", field: "companyName" },
    { progress: 85, title: "Finally, what's your phone number?", field: "phone" }
  ];

  // Reset form when modal closes
  useEffect(() => {
    const modalEl = document.getElementById("checkPricesModal");
    if (!modalEl) return;
    const handleHidden = () => {
      setStep(0);
      setSubmitSuccess(false);
      setSubmitError("");
      reset();
    };
    // @ts-ignore
    modalEl.addEventListener("hidden.bs.modal", handleHidden);
    // @ts-ignore
    return () => modalEl.removeEventListener("hidden.bs.modal", handleHidden);
  }, [reset]);

  const handleNext = async () => {
    const currentField = steps[step].field as keyof PricingFormValues;
    const isStepValid = await trigger(currentField);
    
    if (isStepValid && step < 4) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: PricingFormValues) => {
    const isFinalValid = await trigger();
    if (!isFinalValid) return;

    setSubmitError("");
    const result = await submitPricingRequest(data);

    if (result.success) {
      setSubmitSuccess(true);
    } else {
      setSubmitError(result.error || "An unexpected error occurred.");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const isNextDisabled = () => {
    const currentField = steps[step].field as keyof PricingFormValues;
    const val = formValues[currentField];
    return !!errors[currentField] || !val;
  };

  const renderCurrentStep = () => {
    if (step === 0) {
      const tiers = ["1 - 5", "6 - 29", "30 - 499", "500 - 4,999", "5,000+"];
      return (
        <div className="d-flex flex-column gap-3 align-items-center w-100 mt-2 position-relative z-1">
          <input type="hidden" {...register("assetTier", { required: true })} />
          {tiers.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => {
                setValue("assetTier", tier, { shouldValidate: true });
              }}
              className="btn w-100 py-3 rounded-2 transition-all position-relative overflow-hidden ghost-btn text-white"
              style={{
                backgroundColor: formValues.assetTier === tier ? "rgba(43,221,102,0.15)" : "rgba(255,255,255,0.03)",
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: formValues.assetTier === tier ? "#2bdd66" : "rgba(255,255,255,0.1)",
                maxWidth: "380px",
                transform: formValues.assetTier === tier ? "scale(1.02)" : "scale(1)"
              }}
            >
              <span className={`fw-medium fs-6 ${formValues.assetTier === tier ? "text-success" : ""}`}>{tier}</span>
              {formValues.assetTier === tier && (
                <i className="bi bi-check-circle-fill text-success position-absolute top-50 translate-middle-y animate-fade-in" style={{ right: "20px" }}></i>
              )}
            </button>
          ))}
        </div>
      );
    }

    if (step === 1) {
      const isEmailValid = formValues.email && !errors.email;
      return (
        <div className="w-100 d-flex flex-column align-items-center position-relative mt-2 z-1">
          <div className="position-relative w-100 focus-within-ring rounded-3" style={{ maxWidth: "420px" }}>
            <i className="bi bi-envelope-open position-absolute top-50 translate-middle-y text-secondary ms-4 fs-5"></i>
            <input
              type="email"
              className="form-control py-3 px-5 rounded-3 premium-input"
              placeholder="example@company.com"
              autoFocus
              {...register("email", { 
                required: "Email is required", 
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" }
              })}
              style={{ paddingLeft: "50px", fontSize: "1.1rem" }}
            />
            {isEmailValid && (
              <i className="bi bi-check-circle-fill text-success position-absolute top-50 translate-middle-y animate-fade-in drop-shadow" style={{ right: "18px", fontSize: "1.3rem", filter: "drop-shadow(0 0 8px rgba(43,221,102,0.4))" }}></i>
            )}
          </div>
          {errors.email && <span className="text-danger mt-2 text-start w-100 fw-medium" style={{maxWidth: "420px", fontSize: "0.85rem"}}>{errors.email.message}</span>}
        </div>
      );
    }

    if (step === 2) {
      const isNameValid = formValues.fullName && !errors.fullName;
      return (
        <div className="w-100 d-flex flex-column align-items-center mt-2 z-1">
          <div className="position-relative w-100 focus-within-ring rounded-3" style={{ maxWidth: "420px" }}>
            <i className="bi bi-person position-absolute top-50 translate-middle-y text-secondary ms-4 fs-4"></i>
            <input
              type="text"
              className="form-control py-3 px-5 rounded-3 premium-input"
              placeholder="John Doe"
              autoFocus
              {...register("fullName", { required: "Name is required" })}
              style={{ paddingLeft: "50px", fontSize: "1.1rem" }}
            />
            {isNameValid && (
              <i className="bi bi-check-circle-fill text-success position-absolute top-50 translate-middle-y animate-fade-in drop-shadow" style={{ right: "18px", fontSize: "1.3rem", filter: "drop-shadow(0 0 8px rgba(43,221,102,0.4))" }}></i>
            )}
          </div>
        </div>
      );
    }

    if (step === 3) {
      const isCompanyValid = formValues.companyName && !errors.companyName;
      return (
        <div className="w-100 d-flex flex-column align-items-center mt-2 z-1">
          <div className="position-relative w-100 focus-within-ring rounded-3" style={{ maxWidth: "420px" }}>
            <i className="bi bi-building position-absolute top-50 translate-middle-y text-secondary ms-4 fs-5"></i>
            <input
              type="text"
              className="form-control py-3 px-5 rounded-3 premium-input"
              placeholder="Your Company Inc."
              autoFocus
              {...register("companyName", { required: "Company name is required" })}
              style={{ paddingLeft: "50px", fontSize: "1.1rem" }}
            />
             {isCompanyValid && (
              <i className="bi bi-check-circle-fill text-success position-absolute top-50 translate-middle-y animate-fade-in drop-shadow" style={{ right: "18px", fontSize: "1.3rem", filter: "drop-shadow(0 0 8px rgba(43,221,102,0.4))" }}></i>
            )}
          </div>
        </div>
      );
    }

    if (step === 4) {
      const isPhoneValid = formValues.phone && !errors.phone;
      return (
        <div className="w-100 d-flex flex-column align-items-center mt-2 z-1">
          <div className="position-relative w-100 d-flex align-items-center rounded-3 premium-input focus-within-ring" style={{ maxWidth: "420px", overflow: "hidden" }}>
            <div className="d-flex align-items-center justify-content-center gap-2" style={{ width: "96px", height: "55px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
              <img src="https://flagcdn.com/ca.svg" alt="Canada" width="24" className="rounded-1 shadow-sm" />
              <span className="text-white fw-medium" style={{ fontSize: "1.05rem" }}>+1</span>
            </div>
            <input
              type="tel"
              className="form-control py-3 px-3 border-0 bg-transparent text-white shadow-none"
              placeholder="(212) 555-5555"
              autoFocus
              {...register("phone", { required: "Phone is required" })}
              style={{
                fontSize: "1.1rem",
                outline: "none",
              }}
            />
            {isPhoneValid && (
              <i className="bi bi-check-circle-fill text-success position-absolute top-50 translate-middle-y animate-fade-in" style={{ right: "15px", fontSize: "1.2rem", filter: "drop-shadow(0 0 8px rgba(43,221,102,0.4))" }}></i>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="modal fade" id="checkPricesModal" tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div 
          className="modal-content border border-white border-opacity-10 rounded-4 shadow-lg overflow-hidden position-relative" 
          style={{ 
             background: "linear-gradient(135deg, #0a1428 0%, #060e20 100%)", 
             minHeight: "520px",
             colorScheme: "dark"
          }}
        >
          {/* Animated Ambient Glow Effects */}
          <div className="position-absolute rounded-circle animate-pulse" style={{ width: "400px", height: "400px", background: "radial-gradient(circle, rgba(43,221,102,0.08) 0%, rgba(0,0,0,0) 70%)", top: "-150px", right: "-100px", pointerEvents: "none" }}></div>
          <div className="position-absolute rounded-circle animate-pulse" style={{ width: "300px", height: "300px", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(0,0,0,0) 70%)", bottom: "-50px", left: "-100px", pointerEvents: "none", animationDelay: "1s" }}></div>

          <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 mt-4 me-4 z-3" data-bs-dismiss="modal" aria-label="Close"></button>

          {submitSuccess ? (
             <div className="modal-body d-flex flex-column align-items-center justify-content-center p-5 text-center h-100 animate-slide-up z-1">
               <div className="position-relative">
                  <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "5rem", filter: "drop-shadow(0 0 30px rgba(43,221,102,0.6))" }}></i>
               </div>
               <h2 className="text-white mt-4 fw-bold" style={{ letterSpacing: "-0.5px", fontFamily: "var(--font-syne)" }}>Estimate Dispatched</h2>
               <p className="text-white text-opacity-75 mt-3 fs-5" style={{ maxWidth: "450px", lineHeight: 1.6 }}>
                 We have securely logged your request. A tailored enterprise pricing proposal will be transmitted to <strong className="text-white">{formValues.email}</strong> shortly.
               </p>
               <button type="button" className="btn btn-outline-light px-5 py-3 mt-4 rounded-pill text-white transition-all fw-bold" data-bs-dismiss="modal">
                 Acknowledge
               </button>
             </div>
          ) : (
            <div className="modal-body p-4 p-md-5 d-flex flex-column align-items-center justify-content-center z-1 position-relative">
              {/* Progress Bar indicator */}
              <div className="d-flex align-items-center gap-3 w-100 mb-5" style={{ maxWidth: "550px" }}>
                <span className="fw-bold" style={{ color: "#2bdd66", minWidth: "35px", fontSize: "1rem" }}>{steps[step].progress}%</span>
                <div className="progress flex-grow-1 overflow-hidden" style={{ height: "6px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${steps[step].progress}%`, 
                      background: "linear-gradient(90deg, #3b82f6 0%, #2bdd66 100%)",
                      transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                      boxShadow: "0 0 10px rgba(43,221,102,0.5)"
                    }}
                  ></div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-center text-white mb-4 fw-normal w-100 px-3 animate-fade-in" style={{ fontSize: "1.45rem", letterSpacing: "0.2px", lineHeight: 1.5 }} key={`title-${step}`}>
                {steps[step].title}
              </h3>

              {/* Content area wrapped in form */}
              <form onSubmit={handleSubmit(onSubmit)} className="w-100 d-flex flex-column align-items-center position-relative">
                {submitError && (
                  <div className="alert bg-danger bg-opacity-10 border-danger border border-opacity-25 w-100 text-center py-2 mb-4 rounded-3 fw-medium text-danger" style={{maxWidth:"450px"}}>
                     <i className="bi bi-exclamation-triangle-fill me-2"></i> {submitError}
                  </div>
                )}
                
                {/* Dynamic Step Content */}
                <div className="w-100 d-flex justify-content-center animate-slide-up" key={`step-${step}`}>
                  {renderCurrentStep()}
                </div>

                {/* Bottom Buttons */}
                <div className="d-flex justify-content-center gap-3 w-100 mt-5 pt-3">
                  {step > 0 && (
                    <button 
                      type="button" 
                      className="btn rounded-pill fw-medium ghost-btn transition-all text-white" 
                      onClick={handleBack}
                      style={{ 
                        border: "1px solid rgba(255,255,255,0.2)", 
                        minWidth: "120px",
                        padding: "10px 40px",
                        background: "rgba(255,255,255,0.05)"
                      }}
                    >
                      Back
                    </button>
                  )}
                  {step < 4 ? (
                    <button 
                      type="button" 
                      className="btn rounded-pill fw-medium border-0 transition-all hover-float" 
                      onClick={handleNext}
                      disabled={isNextDisabled()}
                      style={{ 
                        background: isNextDisabled() ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", 
                        color: isNextDisabled() ? "rgba(255,255,255,0.4)" : "white",
                        minWidth: "130px",
                        padding: "10px 40px",
                        boxShadow: isNextDisabled() ? "none" : "0 4px 15px rgba(59,130,246,0.4)"
                      }}
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="btn rounded-pill fw-medium border-0 transition-all hover-float"
                      disabled={isNextDisabled() || isSubmitting}
                      style={{ 
                        background: (isNextDisabled() || isSubmitting) ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #2bdd66 0%, #059669 100%)", 
                        color: (isNextDisabled() || isSubmitting) ? "rgba(255,255,255,0.4)" : "white",
                        minWidth: "150px",
                        padding: "10px 40px",
                        boxShadow: (isNextDisabled() || isSubmitting) ? "none" : "0 4px 20px rgba(43,221,102,0.4)"
                      }}
                    >
                      {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                      ) : (
                        "Get Estimate"
                      )}
                    </button>
                  )}
                </div>
              </form>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
