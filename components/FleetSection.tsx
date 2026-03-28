"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import ConfirmationModal from "./ConfirmationModal";

// ─── Portal wrapper — renders children directly on document.body ──────────────
function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

// ─── Premium Glass Dropdown ──────────────────────────────────────────────────
function FleetGlassSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  accentColor = "#10b981",
  accentRgb = "16, 185, 129",
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  accentColor?: string;
  accentRgb?: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: open ? 2000 : 1 }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "11px 16px",
          borderRadius: "14px",
          border: open
            ? `1.5px solid rgba(${accentRgb}, 0.65)`
            : error
            ? "1.5px solid rgba(220,53,69,0.6)"
            : "1.5px solid rgba(255,255,255,0.1)",
          background: open
            ? `rgba(${accentRgb}, 0.07)`
            : "#0d1117",
          boxShadow: open
            ? `0 0 0 3px rgba(${accentRgb}, 0.12), 0 4px 24px rgba(${accentRgb}, 0.15)`
            : "0 2px 10px rgba(0,0,0,0.25)",
          cursor: "pointer",
          userSelect: "none",
          transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
          minHeight: "46px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            color: value
              ? open ? accentColor : "rgba(255,255,255,0.92)"
              : "rgba(255,255,255,0.28)",
            transition: "color 0.2s ease",
          }}
        >
          {value || placeholder}
        </span>

        {/* Pill chevron */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: open ? `rgba(${accentRgb}, 0.18)` : "rgba(255,255,255,0.06)",
            flexShrink: 0,
            transition: "background 0.2s ease",
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke={open ? accentColor : "rgba(255,255,255,0.35)"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            borderRadius: "16px",
            border: `1px solid rgba(${accentRgb}, 0.22)`,
            background: "rgba(6, 9, 20, 0.94)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            boxShadow: `0 24px 64px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(${accentRgb}, 0.12)`,
            padding: "8px",
            overflow: "hidden",
            zIndex: 2001,
            animation: "glassDropdownOpen 0.2s cubic-bezier(0.4,0,0.2,1) both",
          }}
        >
          {/* Top shimmer line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "20px",
              right: "20px",
              height: "1px",
              background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.7), transparent)`,
            }}
          />

          {options.map((opt) => {
            const selected = value === opt;
            return (
              <div
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  marginBottom: "2px",
                  cursor: "pointer",
                  background: selected ? `rgba(${accentRgb}, 0.14)` : "transparent",
                  border: selected ? `1px solid rgba(${accentRgb}, 0.28)` : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    e.currentTarget.style.background = `rgba(${accentRgb}, 0.08)`;
                    e.currentTarget.style.border = `1px solid rgba(${accentRgb}, 0.18)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.border = "1px solid transparent";
                  }
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: selected ? accentColor : "rgba(255,255,255,0.15)",
                    boxShadow: selected ? `0 0 8px ${accentColor}` : "none",
                    transition: "all 0.15s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: selected ? accentColor : "rgba(255,255,255,0.6)",
                    transition: "color 0.15s ease",
                    flex: 1,
                  }}
                >
                  {opt}
                </span>
                {/* Checkmark */}
                {selected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={accentColor} strokeWidth="3.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="text-danger small mt-1 mb-0 fw-bold">{error}</p>}
    </div>
  );
}


interface Truck {
  _id: string;
  truckNo: string;
  vin: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  truckType: 'Sleeper Cab' | 'Day Cab';
  status: string;
}

interface Trailer {
  _id: string;
  trailerNo: string;
  vin: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  trailerType: 'Dry Van' | 'Reefer' | 'Tri Axle' | 'Flatbed';
  status: string;
}

interface FleetFormValues {
  no: string;
  vin: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  type: string;
}

const FIELD_STYLE = "form-control rounded-4 p-3 glass-input-premium text-white shadow-sm focus-ring-emerald transition-all border-white border-opacity-10 shadow-none";
const LABEL_STYLE = "small fw-bold text-white mb-2 opacity-100 text-uppercase tracking-wider fs-10";

export default function FleetSection() {
  const [activeTab, setActiveTab] = useState<"trucks" | "trailers">("trucks");
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string | null; no: string } | null>(null);
  
  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<FleetFormValues>({
    defaultValues: { no: "", vin: "", plate: "", year: new Date().getFullYear(), make: "", model: "", type: "" }
  });
  const watchedType = watch("type");

  // Watch for auto-uppercase
  const watchedVin = watch("vin");
  const watchedPlate = watch("plate");
  const watchedNo = watch("no");

  useEffect(() => {
    if (watchedVin) setValue("vin", watchedVin.toUpperCase(), { shouldValidate: true });
  }, [watchedVin, setValue]);

  useEffect(() => {
    if (watchedPlate) setValue("plate", watchedPlate.toUpperCase(), { shouldValidate: true });
  }, [watchedPlate, setValue]);

  useEffect(() => {
    if (watchedNo) setValue("no", watchedNo.toUpperCase(), { shouldValidate: true });
  }, [watchedNo, setValue]);

  useEffect(() => {
    fetchFleet();
  }, [activeTab]);

  const fetchFleet = async () => {
    setLoading(true);
    try {
      const [trucksRes, trailersRes] = await Promise.all([
        fetch("/api/trucks"),
        fetch("/api/trailers"),
      ]);
      if (trucksRes.ok) setTrucks(await trucksRes.json());
      if (trailersRes.ok) setTrailers(await trailersRes.json());
    } catch (error) {
      console.error("Error fetching fleet:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FleetFormValues) => {
    const isEdit = !!editingId;
    const endpoint = isEdit 
      ? (activeTab === "trucks" ? `/api/trucks/${editingId}` : `/api/trailers/${editingId}`)
      : (activeTab === "trucks" ? "/api/trucks" : "/api/trailers");
    
    const body = {
      ...(activeTab === "trucks" ? { truckNo: data.no } : { trailerNo: data.no }),
      vin: data.vin,
      plate: data.plate,
      year: data.year,
      make: data.make,
      model: data.model,
      ...(activeTab === "trucks" ? { truckType: data.type } : { trailerType: data.type }),
    };

    try {
      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        reset({ no: "", vin: "", plate: "", year: new Date().getFullYear(), make: "", model: "", type: "" });
        fetchFleet();
      } else {
        const err = await res.json();
        alert(err.error || `Failed to ${isEdit ? "update" : "add"} vehicle`);
      }
    } catch (error) {
      alert(`Error ${isEdit ? "updating" : "adding"} vehicle`);
    }
  };

  const handleEdit = (vehicle: Truck | Trailer) => {
    setEditingId(vehicle._id);
    reset({
      no: "truckNo" in vehicle ? vehicle.truckNo : vehicle.trailerNo,
      vin: vehicle.vin,
      plate: vehicle.plate,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      type: "truckType" in vehicle ? vehicle.truckType : vehicle.trailerType
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm?.id) return;
    try {
      const endpoint = activeTab === "trucks" ? `/api/trucks/${deleteConfirm.id}` : `/api/trailers/${deleteConfirm.id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchFleet();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete vehicle");
      }
    } catch (error) {
      alert("Error deleting vehicle");
    }
  };

  return (
    <div className="container-fluid py-4 px-md-5 animate-slide-up">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="display-6 fw-black text-white mb-1 tracking-tight">Fleet Management</h2>
          <p className="text-white opacity-50 mb-0 small text-uppercase tracking-widest fw-bold">Manage trucks and trailers</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button 
            onClick={() => {
              if (showForm) {
                setEditingId(null);
                reset({ no: "", vin: "", plate: "", year: new Date().getFullYear(), make: "", model: "", type: "" });
              }
              setShowForm(!showForm);
            }}
            className="btn btn-emerald rounded-pill px-4 py-2 fw-black shadow-glow-emerald transition-all hover-scale text-uppercase"
            style={{ letterSpacing: "1px", fontSize: "12px" }}
            title={showForm ? "Close Form" : `Add New ${activeTab === "trucks" ? "Truck" : "Trailer"}`}
          >
            {showForm ? "CLOSE FORM" : `ADD NEW ${activeTab === "trucks" ? "TRUCK" : "TRAILER"}`}
          </button>
        </div>
      </div>

      <div className="d-flex gap-3 mb-5 p-1 rounded-pill" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.05)", width: "fit-content" }}>
        <button 
          onClick={() => setActiveTab("trucks")}
          className="btn rounded-pill px-5 py-2 fw-black transition-all border-0"
          style={{ 
            letterSpacing: "2px", 
            fontSize: "12px", 
            backgroundColor: activeTab === "trucks" ? "#10b981" : "transparent",
            color: activeTab === "trucks" ? "#000000" : "rgba(255,255,255,0.7)",
            boxShadow: activeTab === "trucks" ? "0 0 25px rgba(16,185,129,0.3)" : "none",
            minWidth: "160px"
          }}
          title="View Trucks"
        >
          TRUCKS
        </button>
        <button 
          onClick={() => setActiveTab("trailers")}
          className="btn rounded-pill px-5 py-2 fw-black transition-all border-0"
          style={{ 
            letterSpacing: "2px", 
            fontSize: "12px", 
            backgroundColor: activeTab === "trailers" ? "#6366f1" : "transparent",
            color: activeTab === "trailers" ? "#ffffff" : "rgba(255,255,255,0.7)",
            boxShadow: activeTab === "trailers" ? "0 0 25px rgba(99,102,241,0.3)" : "none",
            minWidth: "160px"
          }}
          title="View Trailers"
        >
          TRAILERS
        </button>
      </div>

      {showForm && (
        <ModalPortal>
          {/* Dark dimmed blurred backdrop */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100001,
              background: "rgba(3, 6, 18, 0.72)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflowY: "auto",
              padding: "24px 16px",
            }}
          >
            {/* Solid dark modal card */}
            <div
              className="animate-scale-in w-100"
              style={{
                maxWidth: "760px",
                flexShrink: 0,
                background: "rgb(13, 18, 38)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
                padding: "36px 40px",
              }}
            >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white fw-black mb-0">{editingId ? "Edit" : "Add"} {activeTab === "trucks" ? "Truck" : "Trailer"}</h4>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  reset({ no: "", vin: "", plate: "", year: new Date().getFullYear(), make: "", model: "" });
                }}
                className="btn btn-link text-white opacity-75 p-0 hover-opacity-100 transition-all"
                title="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
              <div className="col-md-4">
                <label className={LABEL_STYLE}>IDENTIFIER ({activeTab === "trucks" ? "TRUCK #" : "TRAILER #"})</label>
                <input 
                  {...register("no", { 
                    required: "Required",
                    pattern: {
                      value: /^[A-Z0-9-]+$/,
                      message: "Must be Alphanumeric/Hyphen"
                    }
                  })}
                  className="form-control glass-input-premium text-white py-2 text-uppercase" 
                  style={{ background: "#0d1117", color: "white" }}
                  placeholder={activeTab === "trucks" ? "TRK-001" : "TRL-001"}
                />
                {errors.no && <p className="text-danger small mt-1 mb-0 fw-bold">{errors.no.message}</p>}
              </div>

              <div className="col-md-4">
                <label className={LABEL_STYLE}>VIN NUMBER (17 CHARS)</label>
                <input 
                  {...register("vin", { 
                    required: "VIN is required",
                    pattern: {
                      value: /^[A-HJ-NPR-Z0-9]{17}$/,
                      message: "Invalid VIN"
                    },
                  })}
                  maxLength={17}
                  className="form-control glass-input-premium text-white py-2 text-uppercase font-monospace" 
                  style={{ background: "#0d1117", color: "white", letterSpacing: "0.1em" }}
                  placeholder="17 CHARS"
                />
                {errors.vin && <p className="text-danger small mt-1 mb-0 fw-bold">{errors.vin.message}</p>}
              </div>

              <div className="col-md-4">
                <label className={LABEL_STYLE}>LICENSE PLATE</label>
                <input 
                  {...register("plate", { 
                    required: "Plate is required"
                  })}
                  maxLength={10}
                  className="form-control glass-input-premium text-white py-2 text-uppercase font-monospace" 
                  style={{ background: "#0d1117", color: "white" }}
                  placeholder="PLATE-01"
                />
                {errors.plate && <p className="text-danger small mt-1 mb-0 fw-bold">{errors.plate.message}</p>}
              </div>

              <div className="col-md-4">
                <label className={LABEL_STYLE}>YEAR</label>
                <input 
                  type="number"
                  {...register("year", { 
                    required: true,
                    min: 1900
                  })}
                  className="form-control glass-input-premium text-white py-2" 
                  style={{ background: "#0d1117", color: "white" }}
                />
                {errors.year && <p className="text-danger small mt-1 mb-0 fw-bold">{errors.year.message}</p>}
              </div>

              <div className="col-md-4">
                <label className={LABEL_STYLE}>MAKE</label>
                <input 
                  {...register("make", { required: true })}
                  className="form-control glass-input-premium text-white py-2" 
                  style={{ background: "#0d1117", color: "white" }}
                  placeholder="e.g. Peterbilt"
                />
                {errors.make && <p className="text-danger small mt-1 mb-0 fw-bold">{errors.make.message}</p>}
              </div>

              <div className="col-md-4">
                <label className={LABEL_STYLE}>MODEL</label>
                <input 
                  {...register("model", { required: true })}
                  className="form-control glass-input-premium text-white py-2" 
                  style={{ background: "#0d1117", color: "white" }}
                  placeholder="e.g. 579"
                />
                {errors.model && <p className="text-danger small mt-1 mb-0 fw-bold">{errors.model.message}</p>}
              </div>

              <div className="col-md-12">
                <label className={LABEL_STYLE}>VEHICLE CLASSIFICATION</label>
                {/* Hidden RHF field for validation */}
                <input type="hidden" {...register("type", { required: "Classification is required" })} />
                <FleetGlassSelect
                  value={watchedType}
                  onChange={(v) => setValue("type", v, { shouldValidate: true })}
                  options={
                    activeTab === "trucks"
                      ? ["Sleeper Cab", "Day Cab"]
                      : ["Dry Van", "Reefer", "Tri Axle", "Flatbed"]
                  }
                  placeholder="Select Category..."
                  accentColor={activeTab === "trucks" ? "#10b981" : "#6366f1"}
                  accentRgb={activeTab === "trucks" ? "16, 185, 129" : "99, 102, 241"}
                  error={errors.type?.message}
                />
              </div>

              <div className="col-12 text-end mt-4 d-flex gap-3 justify-content-end align-items-center">
                <button 
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null); // Reset editingId when canceling
                    reset({ no: "", vin: "", plate: "", year: new Date().getFullYear(), make: "", model: "" });
                  }}
                  className="btn btn-outline-white rounded-pill px-4 py-2 hover-scale transition-all fw-bold text-white border-white border-opacity-25 text-decoration-none"
                  title="Cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald rounded-pill px-5 py-3 fw-bold shadow-lg hover-scale transition-all" title={editingId ? "Update Asset" : "Save Vehicle"}>
                  {editingId ? "UPDATE ASSET" : "Save Vehicle"}
                </button>
              </div>
            </form>
            </div>
          </div>
        </ModalPortal>
      )}

      <div
        className="overflow-hidden rounded-5 shadow-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.07)",
          backdropFilter: "blur(60px) saturate(250%) brightness(1.1)",
          WebkitBackdropFilter: "blur(60px) saturate(250%) brightness(1.1)",
          border: "1px solid rgba(255,255,255,0.20)",
          boxShadow: "0 30px 80px -10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle border-0">
            <thead>
              <tr className="border-bottom border-white border-opacity-10" style={{ background: "rgba(255,255,255,0.05)" }}>
                <th className="ps-4 py-4 text-white text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>{activeTab === "trucks" ? "Truck #" : "Trailer #"}</th>
                <th className="py-4 text-white text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>VIN Number</th>
                <th className="py-4 text-white text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>License Plate</th>
                <th className="py-4 text-white text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>Classification</th>
                <th className="py-4 text-white text-uppercase" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>Vehicle Details (Year / Make / Model)</th>
                <th className="pe-4 py-4 text-white text-uppercase text-center" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <div className="d-flex flex-column align-items-center gap-3">
                      <div className="spinner-border spinner-border-sm text-emerald" role="status"></div>
                      <span className="text-white opacity-75 fw-bold tracking-wider fs-6">Refreshing Data Link...</span>
                    </div>
                  </td>
                </tr>
              ) : activeTab === "trucks" ? (
                trucks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="py-4" style={{ opacity: 0.8 }}>
                         <h3 className="text-white fw-black tracking-tighter mb-1" style={{ fontSize: "1.25rem" }}>ZERO TRUCKS CONNECTED</h3>
                         <p className="text-white-50 fw-bold small">Initialize your fleet matrix to see assets here.</p>
                      </div>
                    </td>
                  </tr>
                ) : trucks.map((t: Truck) => (
                  <tr key={t._id} className="border-bottom border-white border-opacity-5 transition-all text-white" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <td className="ps-4 py-2 fw-bold text-emerald" style={{ letterSpacing: "1px" }}>{t.truckNo}</td>
                    <td className="py-2 opacity-90 small font-monospace tracking-wide text-white">{t.vin}</td>
                    <td className="py-2 text-white font-monospace fw-bold" style={{ letterSpacing: "1px" }}>{t.plate}</td>
                    <td className="py-2">
                       <span className="px-2 py-1 rounded bg-emerald bg-opacity-10 border border-emerald border-opacity-20 text-emerald fw-black text-uppercase x-small">
                         {t.truckType}
                       </span>
                    </td>
                    <td className="py-2 text-white fw-medium">
                      <span className="opacity-50 me-2">{t.year}</span>
                      {t.make} / {t.model}
                    </td>
                    <td className="pe-4 py-2 text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="btn btn-link text-emerald p-2 opacity-50 hover-opacity-100 transition-all scale-110"
                          title={`Edit Truck ${t.truckNo}`}
                        >
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ id: t._id, no: t.truckNo })}
                          className="btn btn-link text-danger p-2 opacity-50 hover-opacity-100 transition-all scale-110"
                          title={`Delete Truck ${t.truckNo}`}
                        >
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                trailers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="py-4" style={{ opacity: 0.8 }}>
                         <h3 className="text-white fw-black tracking-tighter mb-1" style={{ fontSize: "1.25rem" }}>ZERO TRAILERS CONNECTED</h3>
                         <p className="text-white-50 fw-bold small">Initialize your fleet matrix to see assets here.</p>
                      </div>
                    </td>
                  </tr>
                ) : trailers.map((t: Trailer) => (
                  <tr key={t._id} className="border-bottom border-white border-opacity-5 transition-all text-white" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <td className="ps-4 py-2 fw-bold text-indigo" style={{ letterSpacing: "1px" }}>{t.trailerNo}</td>
                    <td className="py-2 opacity-90 small font-monospace tracking-wide text-white">{t.vin}</td>
                    <td className="py-2 text-white font-monospace fw-bold" style={{ letterSpacing: "1px" }}>{t.plate}</td>
                    <td className="py-2">
                       <span className="px-2 py-1 rounded bg-indigo bg-opacity-10 border border-indigo border-opacity-20 text-indigo fw-black text-uppercase x-small">
                         {t.trailerType}
                       </span>
                    </td>
                    <td className="py-2 text-white fw-medium">
                      <span className="opacity-50 me-2">{t.year}</span>
                      {t.make} / {t.model}
                    </td>
                    <td className="pe-4 py-2 text-center">
                      <div className="d-flex justify-content-center gap-1">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="btn btn-link text-indigo p-2 opacity-50 hover-opacity-100 transition-all scale-110"
                          title="Edit"
                        >
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm({ id: t._id, no: t.trailerNo })}
                          className="btn btn-link text-danger p-2 opacity-50 hover-opacity-100 transition-all scale-110"
                          title="Delete"
                        >
                           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle?"
        message={`Are you sure you want to remove ${activeTab === "trucks" ? "Truck" : "Trailer"} ${deleteConfirm?.no}? This action cannot be undone.`}
        confirmText="Remove Vehicle"
        type="danger"
      />
    </div>
  );
}
