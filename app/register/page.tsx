"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import PasswordStrength from "@/components/PasswordStrength";
import { StateProvinceSelect, CitySelect } from "@/components/LocationSelects";

// Removed hardcoded provincesData and now using dynamic lib fetching

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dob: string;
  licenseNumber: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
};

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedRole, setDetectedRole] = useState<
    "Driver" | "Dispatcher" | null
  >(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: emailParam || "",
    },
  });

  // Sync email param if it changes (rare but good for UX)
  useEffect(() => {
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [emailParam, setValue]);

  const selectedProvince = watch("province");
  const emailValue = watch("email");

  // Check email for role association
  useEffect(() => {
    const checkEmail = async () => {
      if (!emailValue) {
        setDetectedRole(null);
        setServerError("");
        return;
      }

      const isValid = await trigger("email");
      if (!isValid) {
        setDetectedRole(null);
        setServerError("");
        return;
      }

      setIsCheckingEmail(true);
      try {
        const res = await fetch(
          `/api/auth/check-email?email=${encodeURIComponent(emailValue)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.isPending) {
            setDetectedRole(data.role);
            setServerError("");
          } else {
            setDetectedRole(null);
            setServerError("This account is already registered.");
          }
        } else {
          setDetectedRole(null);
          if (res.status === 404) {
            setServerError("This email has not been invited to join the platform.");
          }
        }
      } catch {
        console.error("Failed to check email");
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [emailValue, trigger]);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`.trim(),
          email: data.email,
          password: data.password,
          phone: data.phone,
          licenseNumber:
            detectedRole === "Driver" ? data.licenseNumber : undefined,
          role: detectedRole,
          dob: data.dob,
          city: data.city,
          province: data.province,
          postalCode: data.postalCode,
          address: data.address,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || "Registration failed");
      } else {
        setSuccess("Account activated! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = (hasError: boolean) =>
    `form-control premium-input py-3 px-4 rounded-3 focus-within-ring shadow-none ${hasError ? "border-danger" : ""}`;

  const errMsg = (msg?: string) =>
    msg ? (
      <p className="text-danger small mt-1 ms-1">
        <i className="bi bi-exclamation-circle me-1"></i>
        {msg}
      </p>
    ) : null;

  return (
    <div className="d-flex flex-column min-vh-100 premium-bg position-relative overflow-hidden py-5">
      {/* Fixed background layer */}
      <div className="position-fixed top-0 start-0 w-100 h-100 z-0">
        <Image
          src="/premium_logistics_bg.webp"
          alt="Background"
          fill
          priority
          className="object-fit-cover"
          quality={75}
        />
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ background: 'linear-gradient(rgba(10, 20, 42, 0.9), rgba(10, 20, 42, 0.8))' }}
        ></div>
      </div>

      <div
        className="glow-orb glow-emerald"
        style={{ top: "5%", left: "-10%", opacity: 0.3 }}
      ></div>
      <div
        className="glow-orb glow-indigo"
        style={{ bottom: "10%", right: "-15%", opacity: 0.2 }}
      ></div>
      <div
        className="glow-orb glow-purple"
        style={{ top: "40%", right: "5%", opacity: 0.1 }}
      ></div>

      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-4 z-1">
        <div className="text-center mb-5 animate-slide-up">
          <Link
            href="/"
            className="d-flex align-items-center justify-content-center gap-3 mb-4 text-decoration-none hover-tilt"
          >
            <div
              className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center shadow-lg border border-white border-opacity-20"
              style={{
                width: "55px",
                height: "55px",
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <img
                src="/truck-logo.png"
                alt="LoadFlow Logo"
                style={{ width: "80%", height: "80%", objectFit: "contain" }}
              />
            </div>
            <span
              className="fs-1 d-flex align-items-center"
              style={{
                fontFamily: "var(--font-syne)",
                letterSpacing: "-0.02em",
              }}
            >
              <span className="brand-text-load">Load</span>
              <span className="brand-text-flow">Flow</span>
            </span>
          </Link>
          <h1
            className="display-6 fw-bold text-white mb-2"
            style={{ fontFamily: "var(--font-syne)" }}
          >
            Join the Fleet
          </h1>
          <p className="text-white text-opacity-75 fs-5">
            Activate your professional driver profile
          </p>
        </div>

        <div
          className="glass-card-stitch p-4 p-md-5 rounded-4 mx-auto animate-slide-up delay-100 mb-5"
          style={{ width: "100%", maxWidth: "800px" }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="row g-4"
            noValidate
          >
            {serverError && (
              <div className="col-12">
                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger py-3 small fw-medium">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {serverError}
                </div>
              </div>
            )}
            {success && (
              <div className="col-12">
                <div className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-20 text-success py-3 small fw-medium">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </div>
              </div>
            )}

            {/* SECTION 1: ACCOUNT */}
            <div className="col-12 mt-2">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white fw-bold mb-0 premium-header-accent small text-uppercase tracking-wider">
                  Account Credentials
                </h5>
                {isCheckingEmail && (
                  <div
                    className="spinner-border spinner-border-sm text-emerald"
                    role="status"
                  >
                    <span className="visually-hidden">Checking...</span>
                  </div>
                )}
                {detectedRole && (
                  <span
                    className={`badge rounded-pill px-3 py-2 animate-fade-in ${detectedRole === "Driver" ? "bg-emerald-glow" : "bg-indigo-glow"}`}
                  >
                    <i
                      className={`bi ${detectedRole === "Driver" ? "bi-truck" : "bi-headset"} me-2`}
                    ></i>
                    {detectedRole} Account Detected
                  </span>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                First Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={fieldClass(!!errors.firstName)}
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errMsg(errors.firstName?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Last Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="Doe"
                className={fieldClass(!!errors.lastName)}
                {...register("lastName", { required: "Last name is required" })}
              />
              {errMsg(errors.lastName?.message)}
            </div>

            <div className="col-12">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Registration Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className={fieldClass(!!errors.email)}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {isCheckingEmail && (
                <p className="text-info small mt-1 ms-1 animate-fade-in">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Verifying invitation...
                </p>
              )}
              {detectedRole && !isCheckingEmail && (
                <p className="text-emerald small mt-1 ms-1 animate-fade-in">
                  <i className="bi bi-patch-check-fill me-2"></i>
                  Invitation confirmed for {detectedRole} role.
                </p>
              )}
              {errMsg(errors.email?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Secure Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={fieldClass(!!errors.password)}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 12,
                    message: "Password must be at least 12 characters",
                  },
                  validate: {
                    hasUppercase: (v) =>
                      /[A-Z]/.test(v) ||
                      "Must contain at least one uppercase letter",
                    hasLowercase: (v) =>
                      /[a-z]/.test(v) ||
                      "Must contain at least one lowercase letter",
                    hasNumber: (v) =>
                      /[0-9]/.test(v) || "Must contain at least one number",
                    hasSpecial: (v) =>
                      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) ||
                      "Must contain at least one special character (!@#$%^&*)",
                  },
                })}
              />
              {errors.password && (
                <p className="text-danger small mt-1 ms-1">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.password.message}
                </p>
              )}
              <PasswordStrength password={watch("password") || ""} />
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`${fieldClass(!!errors.confirmPassword)} ${watch("confirmPassword") && watch("confirmPassword") === watch("password") ? "border-success" : ""}`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === watch("password") || "Passwords do not match",
                })}
              />
              {/* Live real-time match indicator */}
              {watch("confirmPassword") &&
                (watch("confirmPassword") === watch("password") ? (
                  <p className="text-success small mt-1 ms-1">
                    <i className="bi bi-check-circle-fill me-1"></i>Passwords
                    match
                  </p>
                ) : (
                  <p className="text-danger small mt-1 ms-1">
                    <i className="bi bi-x-circle-fill me-1"></i>Passwords do not
                    match
                  </p>
                ))}
            </div>

            {/* SECTION 2: INDUCTION */}
            <div className="col-12 mt-5">
              <h5 className="text-white fw-bold mb-3 premium-header-accent premium-header-accent-emerald small text-uppercase tracking-wider">
                Induction Information
              </h5>
            </div>

            <div className="col-md-4">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className={fieldClass(!!errors.phone)}
                {...register("phone", { required: "Phone number is required" })}
              />
              {errMsg(errors.phone?.message)}
            </div>

            <div className="col-md-4">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Date of Birth <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className={`${fieldClass(!!errors.dob)} color-scheme-dark`}
                {...register("dob", { required: "Date of birth is required" })}
              />
              {errMsg(errors.dob?.message)}
            </div>

            <div className="col-md-4">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                License Number{" "}
                {detectedRole === "Driver" && <span className="text-danger">*</span>}
                {detectedRole === "Dispatcher" && "(Not Required)"}
              </label>
              <input
                type="text"
                placeholder={
                  detectedRole === "Dispatcher" ? "N/A" : "A1234-56789-01234"
                }
                className={`${fieldClass(!!errors.licenseNumber)} ${
                  detectedRole === "Dispatcher" ? "opacity-50" : ""
                }`}
                style={{
                  backgroundColor:
                    detectedRole === "Dispatcher"
                      ? "rgba(255,255,255,0.05)"
                      : undefined,
                }}
                disabled={detectedRole === "Dispatcher"}
                {...register("licenseNumber", {
                  required:
                    detectedRole === "Driver"
                      ? "License number is required"
                      : false,
                })}
                onChange={(e) =>
                  setValue("licenseNumber", e.target.value.toUpperCase())
                }
              />
              {errMsg(errors.licenseNumber?.message)}
            </div>

            {/* SECTION 3: LOCATION */}
            <div className="col-12 mt-5">
              <h5 className="text-white fw-bold mb-3 premium-header-accent small text-uppercase tracking-wider">
                Service Location
              </h5>
            </div>

            <div className="col-md-12">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Residential Address <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="123 Fleet Way"
                className={fieldClass(!!errors.address)}
                {...register("address", { required: "Address is required" })}
              />
              {errMsg(errors.address?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Province <span className="text-danger">*</span>
              </label>
              <Controller
                name="province"
                control={control}
                rules={{ required: "Province is required" }}
                render={({ field }) => (
                  <StateProvinceSelect
                    id="province"
                    value={field.value}
                    className={fieldClass(!!errors.province)}
                    onChange={(v) => {
                      field.onChange(v);
                      setValue("city", ""); // Reset city when province changes
                    }}
                  />
                )}
              />
              {errMsg(errors.province?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                City <span className="text-danger">*</span>
              </label>
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <CitySelect
                    id="city"
                    stateCode={selectedProvince}
                    value={field.value}
                    className={fieldClass(!!errors.city)}
                    onChange={field.onChange}
                  />
                )}
              />
              {errMsg(errors.city?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">
                Postal Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="M5V 2H1"
                className={fieldClass(!!errors.postalCode)}
                {...register("postalCode", {
                  required: "Postal code is required",
                })}
                onChange={(e) =>
                  setValue("postalCode", e.target.value.toUpperCase())
                }
              />
              {errMsg(errors.postalCode?.message)}
            </div>

            <div className="col-12 mt-4 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-lg w-100 fw-bold rounded-3 shadow-lg hover-float transition-all d-flex align-items-center justify-content-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)",
                  border: "none",
                  color: "white",
                  padding: "18px",
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span>Validating Induction...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <i className="bi bi-shield-lock-fill fs-5"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center small text-white text-opacity-60 mb-5 animate-fade-in delay-300">
          {"Already part of the fleet?"}{" "}
          <Link
            href="/login"
            className="text-white fw-bold text-decoration-none hover-glow-emerald border-bottom border-white border-opacity-25 pb-1 ms-1"
          >
            Sign In to Account
          </Link>
        </p>
      </main>

      <style jsx>{`
        .hover-glow-emerald:hover {
          color: var(--accent-emerald) !important;
          border-color: var(--accent-emerald) !important;
          text-shadow: 0 0 10px rgba(43, 221, 102, 0.4);
        }
        .color-scheme-dark {
          color-scheme: dark;
        }
        .tracking-wider {
          letter-spacing: 0.1em;
        }
        select option {
          background-color: #0a142a !important;
        }
        .form-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .transition-all {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .duration-500 {
          transition-duration: 500ms;
        }
        .bg-emerald-glow {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .bg-indigo-glow {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }
        .pointer-events-none {
          pointer-events: none;
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
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-vh-100 premium-bg d-flex align-items-center justify-content-center">
        <div className="spinner-border text-emerald" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
