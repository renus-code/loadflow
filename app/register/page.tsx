"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PasswordStrength from "@/components/PasswordStrength";

const provincesData: Record<string, string[]> = {
  "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat"],
  "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond", "Abbotsford"],
  "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie"],
  "New Brunswick": ["Moncton", "Saint John", "Fredericton", "Dieppe", "Riverview"],
  "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook", "Grand Falls-Windsor"],
  "Nova Scotia": ["Halifax", "Sydney", "Truro", "New Glasgow", "Glace Bay"],
  "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan", "Kitchener", "Windsor"],
  "Prince Edward Island": ["Charlottetown", "Summerside", "Stratford", "Cornwall"],
  "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay", "Levis"],
  "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current"],
  "Northwest Territories": ["Yellowknife", "Hay River", "Inuvik", "Fort Smith"],
  "Nunavut": ["Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake"],
  "Yukon": ["Whitehorse", "Dawson City", "Watson Lake", "Haines Junction"]
};

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

export default function Register() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const selectedProvince = watch("province");

  // Reset city when province changes
  useEffect(() => {
    setValue("city", "");
  }, [selectedProvince, setValue]);

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
          licenseNumber: data.licenseNumber,
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
    `form-control premium-input py-3 px-4 rounded-3 focus-within-ring shadow-none ${hasError ? 'border-danger' : ''}`;
  const selectClass = (hasError: boolean) =>
    `form-select premium-input py-3 px-4 rounded-3 focus-within-ring shadow-none ${hasError ? 'border-danger' : ''}`;
  const errMsg = (msg?: string) =>
    msg ? <p className="text-danger small mt-1 ms-1"><i className="bi bi-exclamation-circle me-1"></i>{msg}</p> : null;

  return (
    <div className="d-flex flex-column min-vh-100 premium-bg position-relative overflow-hidden py-5">
      <div className="glow-orb glow-emerald" style={{ top: '5%', left: '-10%', opacity: 0.3 }}></div>
      <div className="glow-orb glow-indigo" style={{ bottom: '10%', right: '-15%', opacity: 0.2 }}></div>
      <div className="glow-orb glow-purple" style={{ top: '40%', right: '5%', opacity: 0.1 }}></div>

      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center px-4 z-1">
        <div className="text-center mb-5 animate-slide-up">
          <Link href="/" className="d-flex align-items-center justify-content-center gap-3 mb-4 text-decoration-none hover-tilt">
            <div className="rounded-3 overflow-hidden d-flex align-items-center justify-content-center shadow-lg border border-white border-opacity-20" style={{ width: "55px", height: "55px", background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <img src="/truck-logo.png" alt="LoadFlow Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            </div>
            <span className="fs-1 d-flex align-items-center" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.02em' }}>
              <span className="brand-text-load">Load</span><span className="brand-text-flow">Flow</span>
            </span>
          </Link>
          <h1 className="display-6 fw-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>Join the Fleet</h1>
          <p className="text-white text-opacity-75 fs-5">Activate your professional driver profile</p>
        </div>

        <div className="glass-card-stitch p-4 p-md-5 rounded-4 mx-auto animate-slide-up delay-100 mb-5" style={{ width: "100%", maxWidth: "800px" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="row g-4" noValidate>
            {serverError && (
              <div className="col-12">
                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger py-3 small fw-medium">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{serverError}
                </div>
              </div>
            )}
            {success && (
              <div className="col-12">
                <div className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-20 text-success py-3 small fw-medium">
                  <i className="bi bi-check-circle-fill me-2"></i>{success}
                </div>
              </div>
            )}

            {/* SECTION 1: ACCOUNT */}
            <div className="col-12 mt-2">
              <h5 className="text-white fw-bold mb-3 premium-header-accent small text-uppercase tracking-wider">Account Credentials</h5>
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">First Name</label>
              <input type="text" placeholder="John" className={fieldClass(!!errors.firstName)}
                {...register("firstName", { required: "First name is required" })} />
              {errMsg(errors.firstName?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Last Name</label>
              <input type="text" placeholder="Doe" className={fieldClass(!!errors.lastName)}
                {...register("lastName", { required: "Last name is required" })} />
              {errMsg(errors.lastName?.message)}
            </div>

            <div className="col-12">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Registration Email</label>
              <input type="email" placeholder="you@company.com" className={fieldClass(!!errors.email)}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" }
                })} />
              {errMsg(errors.email?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Secure Password</label>
              <input type="password" placeholder="••••••••" className={fieldClass(!!errors.password)}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 12, message: "Password must be at least 12 characters" },
                  validate: {
                    hasUppercase: (v) => /[A-Z]/.test(v) || "Must contain at least one uppercase letter",
                    hasLowercase: (v) => /[a-z]/.test(v) || "Must contain at least one lowercase letter",
                    hasNumber:    (v) => /[0-9]/.test(v) || "Must contain at least one number",
                    hasSpecial:   (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) || "Must contain at least one special character (!@#$%^&*)",
                  }
                })} />
              {errors.password && <p className="text-danger small mt-1 ms-1"><i className="bi bi-exclamation-circle me-1"></i>{errors.password.message}</p>}
              <PasswordStrength password={watch("password") || ""} />
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Confirm Password</label>
              <input type="password" placeholder="••••••••"
                className={`${fieldClass(!!errors.confirmPassword)} ${watch("confirmPassword") && watch("confirmPassword") === watch("password") ? 'border-success' : ''}`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === watch("password") || "Passwords do not match"
                })} />
              {/* Live real-time match indicator */}
              {watch("confirmPassword") && (
                watch("confirmPassword") === watch("password")
                  ? <p className="text-success small mt-1 ms-1"><i className="bi bi-check-circle-fill me-1"></i>Passwords match</p>
                  : <p className="text-danger small mt-1 ms-1"><i className="bi bi-x-circle-fill me-1"></i>Passwords do not match</p>
              )}
            </div>

            {/* SECTION 2: INDUCTION */}
            <div className="col-12 mt-5">
              <h5 className="text-white fw-bold mb-3 premium-header-accent premium-header-accent-emerald small text-uppercase tracking-wider">Driver Induction Data</h5>
            </div>

            <div className="col-md-4">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Phone Number</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className={fieldClass(!!errors.phone)}
                {...register("phone", { required: "Phone number is required" })} />
              {errMsg(errors.phone?.message)}
            </div>

            <div className="col-md-4">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Date of Birth</label>
              <input type="date" className={`${fieldClass(!!errors.dob)} color-scheme-dark`}
                {...register("dob", { required: "Date of birth is required" })} />
              {errMsg(errors.dob?.message)}
            </div>

            <div className="col-md-4">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">License Number</label>
              <input type="text" placeholder="A1234-56789-01234" className={fieldClass(!!errors.licenseNumber)}
                {...register("licenseNumber", { required: "License number is required" })}
                onChange={(e) => setValue("licenseNumber", e.target.value.toUpperCase())} />
              {errMsg(errors.licenseNumber?.message)}
            </div>

            {/* SECTION 3: LOCATION */}
            <div className="col-12 mt-5">
              <h5 className="text-white fw-bold mb-3 premium-header-accent small text-uppercase tracking-wider">Service Location</h5>
            </div>

            <div className="col-md-12">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Residential Address</label>
              <input type="text" placeholder="123 Fleet Way" className={fieldClass(!!errors.address)}
                {...register("address", { required: "Address is required" })} />
              {errMsg(errors.address?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Province</label>
              <select className={selectClass(!!errors.province)}
                {...register("province", { required: "Province is required" })}>
                <option value="" className="bg-dark text-white text-opacity-50">Select Province / Territory</option>
                {Object.keys(provincesData).sort().map((prov) => (
                  <option key={prov} value={prov} className="bg-dark text-white">{prov}</option>
                ))}
              </select>
              {errMsg(errors.province?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">City</label>
              <select className={selectClass(!!errors.city)} disabled={!selectedProvince}
                {...register("city", { required: "City is required" })}>
                <option value="" className="bg-dark text-white text-opacity-50">
                  {!selectedProvince ? "Select Province First" : "Select City"}
                </option>
                {selectedProvince && provincesData[selectedProvince]?.map((cityName) => (
                  <option key={cityName} value={cityName} className="bg-dark text-white">{cityName}</option>
                ))}
                {selectedProvince && <option value="Other" className="bg-dark text-white">Other...</option>}
              </select>
              {errMsg(errors.city?.message)}
            </div>

            <div className="col-md-6">
              <label className="form-label text-white text-opacity-80 fw-medium small mb-2 ms-1">Postal Code</label>
              <input type="text" placeholder="M5V 2H1" className={fieldClass(!!errors.postalCode)}
                {...register("postalCode", { required: "Postal code is required" })}
                onChange={(e) => setValue("postalCode", e.target.value.toUpperCase())} />
              {errMsg(errors.postalCode?.message)}
            </div>

            <div className="col-12 mt-4 pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-lg w-100 fw-bold rounded-3 shadow-lg hover-float transition-all d-flex align-items-center justify-content-center gap-2"
                style={{ background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)', border: 'none', color: 'white', padding: '18px' }}
              >
                {isLoading ? (
                  <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span><span>Validating Induction...</span></>
                ) : (
                  <><span>Complete Driver Onboarding</span><i className="bi bi-shield-lock-fill fs-5"></i></>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center small text-white text-opacity-60 mb-5 animate-fade-in delay-300">
          {"Already part of the fleet?"}{" "}
          <Link href="/login" className="text-white fw-bold text-decoration-none hover-glow-emerald border-bottom border-white border-opacity-25 pb-1 ms-1">
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
        .color-scheme-dark { color-scheme: dark; }
        .tracking-wider { letter-spacing: 0.1em; }
        select option { background-color: #0a142a !important; }
        .form-select:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
