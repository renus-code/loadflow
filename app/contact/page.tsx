/**
 * ======================================================================================
 * PAGE: Contact & Support (User Engagement)
 * ======================================================================================
 * The centralized hub for user inquiries, technical support, and demo requests.
 * 
 * Features:
 * 1. Intelligent Routing: Categorizes inquiries (Demo, Support, Billing) via CustomSelect.
 * 2. Visual Quality: Features a custom-engineered dropdown and hero banner with radial glows.
 * 3. Responsive Layout: Dual-column architecture optimized for desktop and mobile viewing.
 * 4. Contact Vectors: Provides direct access to email, phone, and physical office intelligence.
 * ======================================================================================
 */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const TOPICS = [
  { value: "support", label: "Technical Support" },
  { value: "demo", label: "Request a Demo" },
  { value: "billing", label: "Billing Inquiry" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];

// Smooth custom dropdown replacing the native <select>
function CustomSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = TOPICS.find((t) => t.value === value);

  return (
    <div ref={ref} className="position-relative" style={{ userSelect: "none" }}>
      {/* Trigger button */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="d-flex align-items-center justify-content-between rounded-3 px-3 py-2"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${open ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.12)"}`,
          color: selected ? "#fff" : "rgba(255,255,255,0.4)",
          cursor: "pointer",
          minHeight: 42,
          transition: "border-color 0.2s",
        }}
      >
        <span style={{ fontSize: "0.9rem" }}>
          {selected ? selected.label : "Select a topic..."}
        </span>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.4)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          expand_more
        </span>
      </div>

      {/* Dropdown list */}
      <div
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          right: 0,
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 100,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          // Smooth height animation
          maxHeight: open ? 300 : 0,
          opacity: open ? 1 : 0,
          transition: "max-height 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {TOPICS.map((topic) => (
          <div
            key={topic.value}
            onClick={() => { onChange(topic.value); setOpen(false); }}
            className="px-3 py-2 d-flex align-items-center gap-2"
            style={{
              color: value === topic.value ? "#10b981" : "rgba(255,255,255,0.8)",
              background: value === topic.value ? "rgba(16,185,129,0.08)" : "transparent",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "background 0.15s, color 0.15s",
              minHeight: 40,
            }}
            onMouseEnter={(e) => {
              if (value !== topic.value)
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                value === topic.value ? "rgba(16,185,129,0.08)" : "transparent";
            }}
          >
            {value === topic.value && (
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#10b981" }}>
                check
              </span>
            )}
            {topic.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [subject, setSubject] = useState("");

  return (
    <div className="d-flex flex-column min-vh-100 bg-dashboard-soft">
      <Navbar />

      <main className="flex-grow-1">
        {/* HERO BANNER */}
        <section
          className="position-relative d-flex align-items-center justify-content-center text-white text-center overflow-hidden"
          style={{
            minHeight: "340px",
            background: "linear-gradient(135deg, #0a0f1e 0%, #0d2137 60%, #0a3d2b 100%)",
          }}
        >
          <div
            className="position-absolute rounded-circle"
            style={{
              width: 400,
              height: 400,
              background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
          <div className="position-relative z-1 py-5">
            <h1 className="display-4 fw-bold mb-3">
              Contact <span style={{ color: "#10b981" }}>LoadFlow</span>
            </h1>
            <p className="lead text-white-50 mb-0" style={{ maxWidth: 520, margin: "0 auto" }}>
              Have a question, need support, or want to schedule a demo? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-5 py-lg-6" style={{ background: "#0d1117" }}>
          <div className="container" style={{ maxWidth: 1100 }}>
            <div className="row g-5 align-items-start">
              {/* LEFT — Contact Info Cards */}
              <div className="col-lg-5">
                <h2 className="fs-4 fw-bold text-white mb-4">Reach Us Directly</h2>
                {[
                  { icon: "mail", label: "Email Support", value: "support@loadflow.ca", sub: "We reply within 24 hours", href: "mailto:support@loadflow.ca" },
                  { icon: "phone", label: "Phone", value: "+1 (437) 383-1996", sub: "Mon–Fri, 9am – 6pm EST", href: "tel:+14373831996" },
                  { icon: "location_on", label: "Office", value: "Toronto, Ontario, Canada", sub: "CargoConnect HQ", href: null },
                ].map(({ icon, label, value, sub, href }) => (
                  <div
                    key={label}
                    className="d-flex align-items-start gap-3 p-4 rounded-4 mb-3"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", transition: "border-color 0.2s" }}
                  >
                    <span
                      className="material-symbols-outlined flex-shrink-0 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ fontSize: 22, color: "#10b981", background: "rgba(16,185,129,0.12)", width: 44, height: 44 }}
                    >
                      {icon}
                    </span>
                    <div>
                      <p className="text-white-50 small mb-1 fw-medium text-uppercase" style={{ letterSpacing: "0.05em", fontSize: "0.7rem" }}>
                        {label}
                      </p>
                      {href ? (
                        <a href={href} className="text-white fw-semibold text-decoration-none" style={{ fontSize: "0.95rem" }}>{value}</a>
                      ) : (
                        <p className="text-white fw-semibold mb-0" style={{ fontSize: "0.95rem" }}>{value}</p>
                      )}
                      <p className="text-white-50 small mb-0">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT — Contact Form */}
              <div className="col-lg-7">
                <div className="p-4 p-lg-5 rounded-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h2 className="fs-4 fw-bold text-white mb-1">Send Us a Message</h2>
                  <p className="text-white-50 small mb-4">Fill in the form and our team will reach out as soon as possible.</p>

                  <form>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label className="form-label text-white-50 small fw-medium">First Name</label>
                        <input type="text" className="form-control rounded-3" placeholder="Jane"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label text-white-50 small fw-medium">Last Name</label>
                        <input type="text" className="form-control rounded-3" placeholder="Driver"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-white-50 small fw-medium">Email Address</label>
                        <input type="email" className="form-control rounded-3" placeholder="jane@company.ca"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
                      </div>

                      {/* Custom smooth dropdown */}
                      <div className="col-12">
                        <label className="form-label text-white-50 small fw-medium">Subject</label>
                        <CustomSelect value={subject} onChange={setSubject} />
                      </div>

                      <div className="col-12">
                        <label className="form-label text-white-50 small fw-medium">Message</label>
                        <textarea className="form-control rounded-3" rows={5} placeholder="Tell us how we can help..."
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", resize: "none" }} />
                      </div>
                      <div className="col-12 pt-2">
                        <button type="submit" className="btn fw-semibold w-100 py-3 rounded-3"
                          style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", fontSize: "0.95rem", letterSpacing: "0.02em" }}>
                          Send Message
                          <span className="material-symbols-outlined ms-2" style={{ fontSize: 18, verticalAlign: "middle" }}>send</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    </div>
  );
}
