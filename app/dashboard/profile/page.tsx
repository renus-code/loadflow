"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PasswordStrength from "@/components/PasswordStrength";

type ProfileFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

const locationData: Record<string, string[]> = {
  "Alberta": ["Calgary", "Edmonton", "Red Deer", "Lethbridge"],
  "British Columbia": ["Vancouver", "Victoria", "Kelowna", "Abbotsford"],
  "Manitoba": ["Winnipeg", "Brandon", "Steinbach", "Thompson"],
  "New Brunswick": ["Moncton", "Saint John", "Fredericton", "Dieppe"],
  "Newfoundland and Labrador": ["St. John's", "Mount Pearl", "Corner Brook"],
  "Nova Scotia": ["Halifax", "Sydney", "Truro", "New Glasgow"],
  "Ontario": ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London"],
  "Prince Edward Island": ["Charlottetown", "Summerside", "Stratford", "Cornwall"],
  "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke"],
  "Saskatchewan": ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw"],
  "Northwest Territories": ["Yellowknife"],
  "Nunavut": ["Iqaluit"],
  "Yukon": ["Whitehorse"]
};

export default function ProfilePage() {
  const user = useAuth((state) => state.user);
  const refreshUser = useAuth((state) => state.refreshUser);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);

  // 2FA State
  const [twoFactorQr, setTwoFactorQr] = useState<string>('');
  const [twoFactorSecret, setTwoFactorSecret] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [isGenerating2FA, setIsGenerating2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<ProfileFormData>({
    mode: "onChange"
  });

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");
  const selectedProvince = watch("province");

  useEffect(() => {
    if (user) {
      const names = (user.name || "").split(" ");
      setValue("firstName", names[0] || "");
      setValue("lastName", names.slice(1).join(" ") || "");
      setValue("phone", (user as any).phone || "");
      setValue("address", (user as any).address || "");
      setValue("province", (user as any).province || "");
      setValue("postalCode", (user as any).postalCode || "");
      setTimeout(() => {
        setValue("city", (user as any).city || "");
      }, 0);
    }
  }, [user, setValue]);

  // Reset city when province changes
  useEffect(() => {
    if (selectedProvince && user && (user as any).province !== selectedProvince) {
       setValue("city", "");
    }
  }, [selectedProvince, setValue, user]);

  const checkCurrentPassword = async () => {
    if (!currentPassword) return;
    setIsCheckingPassword(true);
    try {
      const res = await fetch("/api/auth/profile/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword }),
      });
      const data = await res.json();
      if (!data.isValid) {
        setError("currentPassword", { type: "manual", message: "Incorrect current password" });
      } else {
        clearErrors("currentPassword");
      }
    } catch (err) {
      console.error("Password check failed", err);
    } finally {
      setIsCheckingPassword(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    const payload = {
      ...data,
      name: `${data.firstName} ${data.lastName}`.trim()
    };

    try {
      const res = await fetch('/api/auth/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        await refreshUser();
        setValue("currentPassword", "");
        setValue("newPassword", "");
        setValue("confirmPassword", "");
      } else {
        setMessage({ type: "danger", text: json.error || "Failed to update profile" });
      }
    } catch (err) {
      setMessage({ type: "danger", text: "Connection error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const generate2FA = async () => {
    setIsGenerating2FA(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/auth/2fa/generate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTwoFactorQr(data.qrCode);
        setTwoFactorSecret(data.secret);
      } else {
        setMessage({ type: "danger", text: data.error || "Failed to generate 2FA" });
      }
    } catch {
      setMessage({ type: "danger", text: "Connection error" });
    } finally {
      setIsGenerating2FA(false);
    }
  };

  const verify2FA = async () => {
    if (!twoFactorCode) return;
    setIsVerifying2FA(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: twoFactorCode })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Two-Factor Authentication successfully enabled!" });
        setTwoFactorQr('');
        refreshUser();
      } else {
        setMessage({ type: "danger", text: data.error || "Failed to verify 2FA code" });
      }
    } catch {
      setMessage({ type: "danger", text: "Connection error" });
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!user) return null;

  // Icons
  const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
  const PhoneIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
  const MapPinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
  const LockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
  const ShieldCheckIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>;
  const SaveIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
  const MapIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
  const HashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line></svg>;

  return (
    <div className="container py-2 animate-fade-in dashboard-page-container">
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-1 gap-2 border-bottom pb-4 border-opacity-10 border-white">
        <div className="text-start">
          <h1
            className="display-6 fw-black text-white m-0 tracking-tight"
            style={{ fontFamily: "var(--font-syne)", letterSpacing: "-0.04em", fontWeight: 900 }}
          >
            My <span className="text-gradient-emerald" style={{ fontWeight: 900 }}>Profile</span>
          </h1>
          <p
            className="text-white mt-1 fw-bold mb-0 opacity-35 text-uppercase small"
            style={{ letterSpacing: "0.15rem", fontSize: "0.7rem" }}
          >
            {todayStr} • PERSONAL SETTINGS
          </p>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div className="glass-card main-profile-card rounded-4 border border-white border-opacity-10 shadow-2xl overflow-hidden position-relative p-3">
            <div className="position-relative z-index-1">
              {message.text && (
                <div className={`alert alert-premium alert-${message.type === 'danger' ? 'error' : 'success'} mb-4 py-2 small`}>
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-1 rounded-circle bg-white bg-opacity-10"><ShieldCheckIcon /></div>
                    <span className="fw-bold">{message.text}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                {/* PERSONAL INFO SECTION */}
                <div className="col-12">
                   <h5 className="label-modern text-emerald d-flex align-items-center gap-2">
                      <div className="bg-emerald bg-opacity-20 p-1 rounded-circle" style={{ width: '6px', height: '6px' }}></div>
                      Personal Details
                   </h5>
                </div>

                <div className="col-md-6">
                  <div className="input-group-premium">
                    <label className="label-modern">First Name</label>
                    <div className="position-relative">
                      <div className="input-icon-left text-white-50 opacity-50"><UserIcon /></div>
                      <input type="text" className={`form-control glass-input icon-indent ${errors.firstName ? 'border-danger' : ''}`}
                        {...register("firstName", { required: "First name is required" })} />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="input-group-premium">
                    <label className="label-modern">Last Name</label>
                    <div className="position-relative">
                      <div className="input-icon-left text-white-50 opacity-50"><UserIcon /></div>
                      <input type="text" className={`form-control glass-input icon-indent ${errors.lastName ? 'border-danger' : ''}`}
                        {...register("lastName", { required: "Last name is required" })} />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                   <div className="input-group-premium">
                    <label className="label-modern">Phone Number</label>
                    <div className="position-relative">
                      <div className="input-icon-left text-white-50 opacity-50"><PhoneIcon /></div>
                      <input type="text" className="form-control glass-input icon-indent" placeholder="+1 (555) 000-0000"
                        {...register("phone")} />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="input-group-premium">
                    <label className="label-modern">Residential Address</label>
                    <div className="position-relative">
                      <div className="input-icon-left text-white-50 opacity-50"><MapPinIcon /></div>
                      <input type="text" className="form-control glass-input icon-indent" placeholder="123 Street, Apt 1"
                        {...register("address")} />
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="input-group-premium">
                    <label className="label-modern">Province</label>
                    <div className="position-relative">
                      <div className="input-icon-left text-white-50 opacity-50"><MapPinIcon /></div>
                      <select className="form-control glass-input icon-indent" {...register("province")}>
                        <option value="" className="bg-dark">Province</option>
                        {Object.keys(locationData).map(prov => (
                          <option key={prov} value={prov} className="bg-dark">{prov}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="input-group-premium">
                    <label className="label-modern">City</label>
                    <div className="position-relative">
                      <div className="input-icon-left text-white-50 opacity-50"><MapIcon /></div>
                      <select className="form-control glass-input icon-indent" {...register("city")} disabled={!selectedProvince}>
                        <option value="" className="bg-dark">{selectedProvince ? "City" : "Select Prov"}</option>
                        {selectedProvince && locationData[selectedProvince]?.map(city => (
                          <option key={city} value={city} className="bg-dark">{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="input-group-premium">
                    <label className="label-modern">Postal Code</label>
                    <div className="position-relative">
                      <div className="input-icon-left text-white-50 opacity-50"><HashIcon /></div>
                      <input type="text" className="form-control glass-input icon-indent" placeholder="M5V 2L7"
                        {...register("postalCode")} />
                    </div>
                  </div>
                </div>

                {/* SECURITY SECTION */}
                <div className="col-12 mt-3">
                   <h5 className="label-modern text-danger d-flex align-items-center gap-2">
                      <div className="bg-danger bg-opacity-20 p-1 rounded-circle" style={{ width: '6px', height: '6px' }}></div>
                      Security Settings
                   </h5>
                </div>

                <div className="col-12">
                  <div className="security-section rounded-3 p-3 border border-white border-opacity-05 position-relative overflow-hidden">
                    <div className="position-relative z-index-1">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="input-group-premium">
                            <label className="label-modern">Current Password</label>
                            <div className="position-relative">
                              <div className="input-icon-left text-white-50 opacity-50"><ShieldCheckIcon /></div>
                              <input type="password" 
                                className={`form-control glass-input icon-indent ${errors.currentPassword ? 'border-danger' : ''}`}
                                placeholder="Required to update"
                                {...register("currentPassword")}
                                onBlur={checkCurrentPassword} />
                              {isCheckingPassword && (
                                <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                                  <div className="spinner-border spinner-border-sm text-emerald" role="status"></div>
                                </div>
                              )}
                            </div>
                            {errors.currentPassword && <p className="text-danger x-small mt-1 mb-0 fw-bold">{errors.currentPassword.message}</p>}
                          </div>
                        </div>

                        <div className="col-md-6">
                           <div className="input-group-premium">
                            <label className="label-modern">New Password</label>
                            <div className="position-relative">
                              <div className="input-icon-left text-white-50 opacity-50"><LockIcon /></div>
                              <input type="password" 
                                className={`form-control glass-input icon-indent ${errors.newPassword ? 'border-danger' : ''}`}
                                placeholder="12+ Characters"
                                {...register("newPassword", {
                                  validate: {
                                    notSame: (val) => !val || val !== watch("currentPassword") || "Different from current required",
                                    minLength: (val) => !val || val.length >= 12 || "Min 12 chars",
                                    uppercase: (val) => !val || /[A-Z]/.test(val) || "Uppercase required",
                                    lowercase: (val) => !val || /[a-z]/.test(val) || "Lowercase required",
                                    number: (val) => !val || /[0-9]/.test(val) || "Number required",
                                    special: (val) => !val || /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val) || "Spec char required"
                                  }
                                })} />
                            </div>
                            {errors.newPassword && <p className="text-danger x-small mt-1 mb-0 fw-bold">{errors.newPassword.message}</p>}
                            <PasswordStrength password={newPassword || ""} />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="input-group-premium">
                            <label className="label-modern">Confirm Password</label>
                            <div className="position-relative">
                              <div className="input-icon-left text-white-50 opacity-50"><LockIcon /></div>
                              <input type="password" 
                                className={`form-control glass-input icon-indent ${errors.confirmPassword ? 'border-danger' : ''}`}
                                placeholder="Match new"
                                {...register("confirmPassword", {
                                  validate: (val) => !watch("newPassword") || val === watch("newPassword") || "No match"
                                })} />
                            </div>
                            {errors.confirmPassword && <p className="text-danger x-small mt-1 mb-0 fw-bold">{errors.confirmPassword.message}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <button type="submit" disabled={isLoading}
                    className="btn btn-emerald-premium w-100 py-2.5 rounded-pill fw-black shadow-emerald-large transition-all hover-float d-flex align-items-center justify-content-center gap-3 border-0">
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                    ) : (
                      <>
                        <SaveIcon />
                        <span className="fs-6 tracking-widest text-dark">UPDATE PROFILE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* TWO-FACTOR AUTHENTICATION SECTION */}
              <div className="row g-3 mt-4">
                <div className="col-12">
                   <h5 className="label-modern text-orange d-flex align-items-center gap-2">
                      <div className="bg-orange bg-opacity-20 p-1 rounded-circle flex-shrink-0" style={{ width: '6px', height: '6px' }}></div>
                      Two-Factor Authentication (2FA)
                   </h5>
                </div>

                <div className="col-12">
                  <div className="security-section rounded-3 p-4 border border-white border-opacity-05 position-relative overflow-hidden">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                      <div>
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 44, height: 44, background: (user as any).isTwoFactorEnabled ? 'rgba(43, 221, 102, 0.15)' : 'rgba(255, 255, 255, 0.05)', border: `1px solid ${(user as any).isTwoFactorEnabled ? 'rgba(43, 221, 102, 0.3)' : 'rgba(255, 255, 255, 0.1)'}` }}>
                            <ShieldCheckIcon />
                          </div>
                          <div>
                            <h6 className="text-white fw-bold mb-1 fs-5">Authenticator App</h6>
                            <p className={`mb-0 small fw-bold ${(user as any).isTwoFactorEnabled ? 'text-emerald' : 'text-white-50'}`}>
                              {(user as any).isTwoFactorEnabled ? 'Status: Active and Securing Your Account' : 'Status: Disabled — Setup Recommended'}
                            </p>
                          </div>
                        </div>
                        <p className="text-white text-opacity-60 small mt-3 mb-0" style={{ maxWidth: '400px' }}>
                          Add an extra layer of security to your account by requiring a 6-digit code from your authenticator app (like Google Authenticator or Authy) when signing in.
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        {!(user as any).isTwoFactorEnabled && !twoFactorQr && (
                          <button 
                            type="button" 
                            className="btn btn-outline-light px-4 py-2 rounded-pill fw-bold"
                            onClick={generate2FA}
                            disabled={isGenerating2FA}
                          >
                            {isGenerating2FA ? 'Generating...' : 'Setup 2FA Now'}
                          </button>
                        )}
                        {(user as any).isTwoFactorEnabled && (
                          <div className="badge rounded-pill fw-black px-3 py-2 text-uppercase" style={{ background: '#2bdd66', color: '#0d1117', letterSpacing: '0.1em' }}>
                            <i className="bi bi-shield-lock-fill me-2"></i>Enabled
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR Code Setup Area */}
                    {twoFactorQr && (
                      <div className="mt-4 pt-4 border-top border-white border-opacity-10 animate-fade-in">
                        <div className="row align-items-center">
                          <div className="col-md-5 text-center text-md-start mb-4 mb-md-0">
                            <h6 className="text-white fw-bold">1. Scan the QR Code</h6>
                            <p className="text-white-50 small mb-3">Open your authenticator app and scan this code.</p>
                            <div className="bg-white p-2 rounded-4 d-inline-block shadow-lg mx-auto mx-md-0">
                              <img src={twoFactorQr} alt="2FA QR Code" width="160" height="160" className="rounded-3" />
                            </div>
                            <div className="mt-3">
                              <span className="text-white-50 x-small text-uppercase tracking-widest d-block mb-1">Manual Secret Key</span>
                              <code className="text-orange user-select-all bg-dark px-2 py-1 rounded border border-white border-opacity-10">{twoFactorSecret}</code>
                            </div>
                          </div>
                          <div className="col-md-7">
                            <h6 className="text-white fw-bold">2. Enter Verification Code</h6>
                            <p className="text-white-50 small mb-3">Type the 6-digit code generated by the app.</p>
                            <div className="d-flex gap-3 max-w-sm">
                              <input 
                                type="text" 
                                className="form-control glass-input text-center fs-4 letter-spacing-2 flex-grow-1" 
                                placeholder="000 000" 
                                maxLength={6}
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                style={{ letterSpacing: '0.25em' }}
                              />
                              <button 
                                type="button" 
                                className="btn btn-emerald-premium rounded-3 px-4 fw-bold"
                                onClick={verify2FA}
                                disabled={isVerifying2FA || twoFactorCode.length !== 6}
                              >
                                {isVerifying2FA ? 'Verifying...' : 'Verify'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page-container { min-height: auto; }
        .main-profile-card { background: rgba(9, 19, 40, 0.93); backdrop-filter: blur(40px); transition: transform 0.4s ease; }
        .glass-input { 
          background: rgba(255, 255, 255, 0.03) !important; 
          border: 1px solid rgba(255, 255, 255, 0.08) !important; 
          color: white !important; 
          padding: 0.8rem 1.2rem; 
          border-radius: 14px; 
          transition: all 0.3s ease; 
          font-size: 0.95rem;
          appearance: none;
        }
        select.glass-input { cursor: pointer; }
        .glass-input:focus { 
          background: rgba(255, 255, 255, 0.06) !important; 
          border-color: #2bdd66 !important; 
          box-shadow: 0 0 15px rgba(43, 221, 102, 0.15); 
        }
        .icon-indent { padding-left: 3rem; }
        .input-icon-left { position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); z-index: 10; opacity: 0.4; pointer-events: none; }
        .label-modern { 
          display: block; 
          font-size: 0.8rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 0.08em; 
          color: rgba(255, 255, 255, 0.4); 
          margin-bottom: 0.5rem; 
          margin-left: 0.25rem; 
        }
        .badge-premium { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); color: white; font-weight: 800; text-transform: uppercase; }
        .bg-emerald { background-color: #2bdd66 !important; }
        .security-section { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); }
        .btn-emerald-premium { background: linear-gradient(135deg, #2bdd66 0%, #10b981 100%); box-shadow: 0 8px 30px rgba(43, 221, 102, 0.3); color: #0d1117 !important; }
        .text-orange { color: #ff6b00; }
        .bg-orange { background-color: #ff6b00 !important; }
        .alert-premium { border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
        .alert-success { background: rgba(43, 221, 102, 0.08); color: #2bdd66; }
        .alert-error { background: rgba(239, 68, 68, 0.08); color: #f87171; }
        .x-small { font-size: 0.7rem; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
