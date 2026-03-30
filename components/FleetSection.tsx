"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import ConfirmationModal from "./ConfirmationModal";

// ─── Portal wrapper — renders children directly on document.body ──────────────
function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
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
          background: open ? `rgba(${accentRgb}, 0.07)` : "#0d1117",
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
              ? open
                ? accentColor
                : "rgba(255,255,255,0.92)"
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
            background: open
              ? `rgba(${accentRgb}, 0.18)`
              : "rgba(255,255,255,0.06)",
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
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  marginBottom: "2px",
                  cursor: "pointer",
                  background: selected
                    ? `rgba(${accentRgb}, 0.14)`
                    : "transparent",
                  border: selected
                    ? `1px solid rgba(${accentRgb}, 0.28)`
                    : "1px solid transparent",
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
                    background: selected
                      ? accentColor
                      : "rgba(255,255,255,0.15)",
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
  truckType: "Sleeper Cab" | "Day Cab";
  status: string;
  __v?: number;
}

interface Trailer {
  _id: string;
  trailerNo: string;
  vin: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  trailerType: "Dry Van" | "Reefer" | "Tri Axle" | "Flatbed";
  status: string;
  __v?: number;
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

// ─── Type Styling Helper ──────────────────────────────────────────────────────
const getTypeStyle = (type: string) => {
  const styles: Record<
    string,
    { bg: string; border: string; text: string; shadow: string }
  > = {
    // Trucks
    "Day Cab": {
      bg: "rgba(16, 185, 129, 0.15)",
      border: "rgba(16, 185, 129, 0.35)",
      text: "#10b981",
      shadow: "rgba(16, 185, 129, 0.25)",
    },
    "Sleeper Cab": {
      bg: "rgba(99, 102, 241, 0.15)",
      border: "rgba(99, 102, 241, 0.35)",
      text: "#818cf8", // Lighter indigo for better dark contrast
      shadow: "rgba(99, 102, 241, 0.25)",
    },
    // Trailers
    Reefer: {
      bg: "rgba(6, 182, 212, 0.15)",
      border: "rgba(6, 182, 212, 0.35)",
      text: "#22d3ee",
      shadow: "rgba(6, 182, 212, 0.25)",
    },
    "Dry Van": {
      bg: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.35)",
      text: "#fbbf24",
      shadow: "rgba(245, 158, 11, 0.25)",
    },
    "Tri Axle": {
      bg: "rgba(244, 63, 94, 0.15)",
      border: "rgba(244, 63, 94, 0.35)",
      text: "#fb7185",
      shadow: "rgba(244, 63, 94, 0.25)",
    },
    Flatbed: {
      bg: "rgba(249, 115, 22, 0.15)",
      border: "rgba(249, 115, 22, 0.35)",
      text: "#fb923c",
      shadow: "rgba(249, 115, 22, 0.25)",
    },
  };

  return (
    styles[type] || {
      bg: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.2)",
      text: "#ffffff",
      shadow: "transparent",
    }
  );
};

const FIELD_STYLE =
  "form-control rounded-4 p-3 glass-input-premium text-white shadow-sm focus-ring-emerald transition-all border-white border-opacity-10 shadow-none";
const LABEL_STYLE =
  "small fw-bold text-white mb-2 opacity-100 text-uppercase tracking-wider fs-10";

export default function FleetSection() {
  const [activeTab, setActiveTab] = useState<"trucks" | "trailers">("trucks");
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string | null;
    no: string;
  } | null>(null);

  // Pagination & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState<
    "all" | "no" | "vin" | "plate" | "type"
  >("all");
  const [criteriaOpen, setCriteriaOpen] = useState(false);
  const criteriaRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [asyncErrors, setAsyncErrors] = useState<{
    no?: string;
    vin?: string;
    plate?: string;
  }>({});

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FleetFormValues>({
    defaultValues: {
      no: "",
      vin: "",
      plate: "",
      year: new Date().getFullYear(),
      make: "",
      model: "",
      type: "",
    },
  });
  const watchedType = watch("type");

  // Watch for auto-uppercase
  const watchedVin = watch("vin");
  const watchedPlate = watch("plate");
  const watchedNo = watch("no");

  useEffect(() => {
    if (watchedVin) {
      const upperVin = watchedVin.toUpperCase();
      setValue("vin", upperVin, { shouldValidate: true });
      
      // Real-time uniqueness check across ALL fleet
      const duplicate = [...trucks, ...trailers].find(v => v.vin === upperVin && v._id !== editingId);
      setAsyncErrors(prev => ({
        ...prev,
        vin: duplicate ? `VIN already exists on ${"truckNo" in duplicate ? "Truck" : "Trailer"} ${"truckNo" in duplicate ? duplicate.truckNo : duplicate.trailerNo}` : undefined
      }));
    } else {
      setAsyncErrors(prev => ({ ...prev, vin: undefined }));
    }
  }, [watchedVin, setValue, trucks, trailers, editingId]);

  useEffect(() => {
    if (watchedPlate) {
      const upperPlate = watchedPlate.toUpperCase();
      setValue("plate", upperPlate, { shouldValidate: true });

      // Real-time uniqueness check across ALL fleet
      const duplicate = [...trucks, ...trailers].find(v => v.plate === upperPlate && v._id !== editingId);
      setAsyncErrors(prev => ({
        ...prev,
        plate: duplicate ? `Plate already exists on ${"truckNo" in duplicate ? "Truck" : "Trailer"} ${"truckNo" in duplicate ? duplicate.truckNo : duplicate.trailerNo}` : undefined
      }));
    } else {
      setAsyncErrors(prev => ({ ...prev, plate: undefined }));
    }
  }, [watchedPlate, setValue, trucks, trailers, editingId]);

  useEffect(() => {
    if (watchedNo) {
      const upperNo = watchedNo.toUpperCase();
      setValue("no", upperNo, { shouldValidate: true });

      // Real-time uniqueness check within active category
      const currentArray = activeTab === "trucks" ? trucks : trailers;
      const duplicate = currentArray.find(v => 
        ("truckNo" in v ? v.truckNo : v.trailerNo) === upperNo && v._id !== editingId
      );
      setAsyncErrors(prev => ({
        ...prev,
        no: duplicate ? `${activeTab === "trucks" ? "Truck" : "Trailer"} number already exists` : undefined
      }));
    } else {
      setAsyncErrors(prev => ({ ...prev, no: undefined }));
    }
  }, [watchedNo, setValue, activeTab, trucks, trailers, editingId]);

  useEffect(() => {
    fetchFleet();
    setSearchQuery(""); // Clear search on tab switch
    setSearchCriteria("all"); // Reset criteria on tab switch
    setCurrentPage(1); // Reset page on tab switch
    setCriteriaOpen(false);
  }, [activeTab]);

  // Click outside handler for criteria dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        criteriaRef.current &&
        !criteriaRef.current.contains(e.target as Node)
      ) {
        setCriteriaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      ? activeTab === "trucks"
        ? `/api/trucks/${editingId}`
        : `/api/trailers/${editingId}`
      : activeTab === "trucks"
        ? "/api/trucks"
        : "/api/trailers";

    const body = {
      ...(activeTab === "trucks"
        ? { truckNo: data.no }
        : { trailerNo: data.no }),
      vin: data.vin,
      plate: data.plate,
      year: data.year,
      make: data.make,
      model: data.model,
      ...(activeTab === "trucks"
        ? { truckType: data.type }
        : { trailerType: data.type }),
      __v: isEdit
        ? (activeTab === "trucks" ? trucks : trailers).find(
            (v) => v._id === editingId,
          )?.__v
        : undefined,
    };

    try {
      // Final client-side check before submission
      const hasErrors = Object.values(asyncErrors).some(err => err !== undefined);
      if (hasErrors) {
        alert("Please fix the errors before saving.");
        return;
      }

      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 409) {
        const err = await res.json();
        const errorMessage = err.error || "Conflict detected.";
        alert(errorMessage);
        
        // If it's a version conflict, we must refresh. 
        // If it's a "already exists" uniqueness error, stay in form to allow correction.
        if (errorMessage.includes("modified by another user")) {
          setShowForm(false);
          setEditingId(null);
          fetchFleet();
        }
        return;
      }

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        reset({
          no: "",
          vin: "",
          plate: "",
          year: new Date().getFullYear(),
          make: "",
          model: "",
          type: "",
        });
        setAsyncErrors({}); // Clear validation errors on success
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
      type: "truckType" in vehicle ? vehicle.truckType : vehicle.trailerType,
    });
    setAsyncErrors({}); // Clear any previous validation errors
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirm?.id) return;
    try {
      const endpoint =
        activeTab === "trucks"
          ? `/api/trucks/${deleteConfirm.id}`
          : `/api/trailers/${deleteConfirm.id}`;
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

  // ─── Search & Pagination Logic ─────────────────────────────────────────────
  const currentArray = activeTab === "trucks" ? trucks : trailers;

  const filteredData = currentArray.filter((item) => {
    const query = searchQuery.toLowerCase();
    const assetNo = "truckNo" in item ? item.truckNo : item.trailerNo;
    const type = "truckType" in item ? item.truckType : item.trailerType;

    if (searchCriteria === "no") return assetNo.toLowerCase().includes(query);
    if (searchCriteria === "vin") return item.vin.toLowerCase().includes(query);
    if (searchCriteria === "plate")
      return item.plate.toLowerCase().includes(query);
    if (searchCriteria === "type") return type.toLowerCase().includes(query);

    return (
      assetNo.toLowerCase().includes(query) ||
      item.vin.toLowerCase().includes(query) ||
      item.plate.toLowerCase().includes(query) ||
      type.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE),
  );
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="container-fluid py-4 px-md-5 animate-slide-up">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <h2 className="display-6 fw-black text-white mb-1 tracking-tight">
            Fleet Management
          </h2>
          <p className="text-white opacity-50 mb-0 small text-uppercase tracking-widest fw-bold">
            Manage trucks and trailers
          </p>
        </div>
        <div className="d-flex align-items-center">
          <button
            onClick={() => {
              if (showForm) {
                setEditingId(null);
                reset({
                  no: "",
                  vin: "",
                  plate: "",
                  year: new Date().getFullYear(),
                  make: "",
                  model: "",
                  type: "",
                });
              }
              setAsyncErrors({}); // Clear errors when toggling form
              setShowForm(!showForm);
            }}
            className="btn btn-emerald rounded-pill px-4 py-2 fw-black shadow-glow-emerald transition-all hover-scale text-uppercase w-100 w-md-auto"
            style={{ letterSpacing: "1px", fontSize: "12px" }}
            title={
              showForm
                ? "Close Form"
                : `Add New ${activeTab === "trucks" ? "Truck" : "Trailer"}`
            }
          >
            {showForm
              ? "CLOSE FORM"
              : `ADD NEW ${activeTab === "trucks" ? "TRUCK" : "TRAILER"}`}
          </button>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 mb-5">
        <div
          className="d-flex gap-2 p-1 rounded-pill flex-grow-1 flex-md-grow-0"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            width: "100%",
            maxWidth: "400px"
          }}
        >
          <button
            onClick={() => setActiveTab("trucks")}
            className="btn rounded-pill px-3 px-md-5 py-2 fw-black transition-all border-0 flex-grow-1"
            style={{
              letterSpacing: "2px",
              fontSize: "11px",
              backgroundColor:
                activeTab === "trucks" ? "#10b981" : "transparent",
              color:
                activeTab === "trucks" ? "#000000" : "rgba(255,255,255,0.7)",
              boxShadow:
                activeTab === "trucks"
                  ? "0 0 25px rgba(16,185,129,0.3)"
                  : "none",
              minWidth: "100px",
            }}
            title="View Trucks"
          >
            TRUCKS
          </button>
          <button
            onClick={() => setActiveTab("trailers")}
            className="btn rounded-pill px-3 px-md-5 py-2 fw-black transition-all border-0 flex-grow-1"
            style={{
              letterSpacing: "2px",
              fontSize: "11px",
              backgroundColor:
                activeTab === "trailers" ? "#6366f1" : "transparent",
              color:
                activeTab === "trailers" ? "#ffffff" : "rgba(255,255,255,0.7)",
              boxShadow:
                activeTab === "trailers"
                  ? "0 0 25px rgba(99,102,241,0.3)"
                  : "none",
              minWidth: "100px",
            }}
            title="View Trailers"
          >
            TRAILERS
          </button>
        </div>

        {/* 🔍 Premium Glass Search Bar with Criteria Selector */}
        <div
          className="d-flex align-items-center rounded-pill transition-all search-container-premium flex-grow-1 flex-md-grow-0"
          style={{
            width: "100%",
            maxWidth: "500px",
            minWidth: "200px",
            background: "rgba(13, 17, 23, 0.85)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Premium Custom Criteria Selector */}
          <div
            ref={criteriaRef}
            className="position-relative border-end border-white border-opacity-10"
            style={{ minWidth: "100px" }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setCriteriaOpen(!criteriaOpen);
              }}
              className="d-flex align-items-center justify-content-between py-2 ps-3 pe-3 transition-all"
              style={{
                cursor: "pointer",
                background: criteriaOpen
                  ? "rgba(255,255,255,0.03)"
                  : "transparent",
                borderRadius: "50px 0 0 50px", // Maintain pill shape on left
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "1.2px",
                  color: activeTab === "trucks" ? "#10b981" : "#818cf8",
                  textTransform: "uppercase",
                }}
              >
                {searchCriteria === "all"
                  ? "ALL FIELDS"
                  : searchCriteria === "no"
                    ? "UNIT #"
                    : searchCriteria === "plate"
                      ? "PLATE"
                      : searchCriteria.toUpperCase()}
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  opacity: 0.6,
                  transform: criteriaOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {/* Floating Glass Dropdown Panel */}
            {criteriaOpen && (
              <div
                className="position-absolute animate-scale-in"
                style={{
                  top: "calc(100% + 10px)",
                  left: "8px",
                  minWidth: "200px",
                  background: "rgba(13, 17, 23, 0.96)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "16px",
                  boxShadow:
                    "0 15px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                  padding: "8px",
                  zIndex: 2000,
                }}
              >
                {[
                  { value: "all", label: "ALL FIELDS" },
                  { value: "no", label: "TRUCK #" },
                  { value: "vin", label: "VIN" },
                  { value: "plate", label: "LICENSE PLATE" },
                  { value: "type", label: "VEHICLE TYPE" },
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      setSearchCriteria(opt.value as any);
                      setCriteriaOpen(false);
                      setCurrentPage(1);
                    }}
                    className="d-flex align-items-center px-3 py-2 rounded-3 mb-1 transition-all"
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                      cursor: "pointer",
                      background:
                        searchCriteria === opt.value
                          ? "rgba(255,255,255,0.06)"
                          : "transparent",
                      color:
                        searchCriteria === opt.value
                          ? activeTab === "trucks"
                            ? "#10b981"
                            : "#818cf8"
                          : "rgba(255,255,255,0.7)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        searchCriteria === opt.value
                          ? "rgba(255,255,255,0.06)"
                          : "transparent";
                      e.currentTarget.style.color =
                        searchCriteria === opt.value
                          ? activeTab === "trucks"
                            ? "#10b981"
                            : "#818cf8"
                          : "rgba(255,255,255,0.7)";
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Input Area */}
          <div className="position-relative flex-grow-1">
            <div
              className="position-absolute translate-middle-y"
              style={{
                top: "50%",
                left: "18px",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.4 }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={
                searchCriteria === "all"
                  ? `Search ${activeTab}...`
                  : searchCriteria === "no"
                    ? `Search by ${activeTab === "trucks" ? "truck" : "trailer"} #...`
                    : `Search by ${searchCriteria}...`
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="form-control bg-transparent text-white border-0 shadow-none py-2 ps-5 pe-5"
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="btn btn-sm position-absolute end-0 top-50 translate-middle-y me-2 border-0 bg-transparent text-white opacity-40 hover-opacity-100 transition-all p-2 d-flex align-items-center justify-content-center"
                title="Clear Search"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <ModalPortal>
          {/* Transparent backdrop for floating effect */}
          <div
            onClick={(e) => {
              // Only close if clicking exactly on this backdrop div
              if (e.target === e.currentTarget) {
                setShowForm(false);
                setEditingId(null);
                reset({
                  no: "",
                  vin: "",
                  plate: "",
                  year: new Date().getFullYear(),
                  make: "",
                  model: "",
                  type: "",
                });
                setAsyncErrors({});
              }
            }}
            style={{
              position: "fixed",
              inset: 0, // Shorthand for top/left/right/bottom: 0
              zIndex: 999999, // Extremely high to stay above sidebar
              background: "transparent",
              backdropFilter: "blur(12px)", // Stronger blur
              WebkitBackdropFilter: "blur(12px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center", // Centered
              overflowY: "auto",
              padding: "24px 16px", // Standard padding
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
                padding: "clamp(24px, 5vw, 40px)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-white fw-black mb-0">
                  {editingId ? "Edit" : "Add"}{" "}
                  {activeTab === "trucks" ? "Truck" : "Trailer"}
                </h4>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    reset({
                      no: "",
                      vin: "",
                      plate: "",
                      year: new Date().getFullYear(),
                      make: "",
                      model: "",
                    });
                  }}
                  className="btn btn-link text-white opacity-75 p-0 hover-opacity-100 transition-all"
                  title="Close"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
                <div className="col-md-4">
                  <label className={LABEL_STYLE}>
                    IDENTIFIER (
                    {activeTab === "trucks" ? "TRUCK #" : "TRAILER #"})
                  </label>
                  <input
                    {...register("no", {
                      required: "Required",
                      pattern: {
                        value: /^[A-Z0-9-]+$/,
                        message: "Must be Alphanumeric/Hyphen",
                      },
                    })}
                    className="form-control glass-input-premium text-white py-2 text-uppercase"
                    style={{ background: "#0d1117", color: "white" }}
                    placeholder={activeTab === "trucks" ? "TRK-001" : "TRL-001"}
                  />
                  {errors.no && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {errors.no.message}
                    </p>
                  )}
                  {asyncErrors.no && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {asyncErrors.no}
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <label className={LABEL_STYLE}>VIN NUMBER (17 CHARS)</label>
                  <input
                    {...register("vin", {
                      required: "VIN is required",
                      pattern: {
                        value: /^[A-HJ-NPR-Z0-9]{17}$/,
                        message: "Invalid VIN",
                      },
                    })}
                    maxLength={17}
                    className="form-control glass-input-premium text-white py-2 text-uppercase font-monospace"
                    style={{
                      background: "#0d1117",
                      color: "white",
                      letterSpacing: "0.1em",
                    }}
                    placeholder="17 CHARS"
                  />
                  {errors.vin && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {errors.vin.message}
                    </p>
                  )}
                  {asyncErrors.vin && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {asyncErrors.vin}
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <label className={LABEL_STYLE}>LICENSE PLATE</label>
                  <input
                    {...register("plate", {
                      required: "Plate is required",
                    })}
                    maxLength={10}
                    className="form-control glass-input-premium text-white py-2 text-uppercase font-monospace"
                    style={{ background: "#0d1117", color: "white" }}
                    placeholder="PLATE-01"
                  />
                  {errors.plate && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {errors.plate.message}
                    </p>
                  )}
                  {asyncErrors.plate && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {asyncErrors.plate}
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <label className={LABEL_STYLE}>YEAR</label>
                  <input
                    type="number"
                    {...register("year", {
                      required: true,
                      min: 1900,
                    })}
                    className="form-control glass-input-premium text-white py-2"
                    style={{ background: "#0d1117", color: "white" }}
                  />
                  {errors.year && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <label className={LABEL_STYLE}>MAKE</label>
                  <input
                    {...register("make", { required: true })}
                    className="form-control glass-input-premium text-white py-2"
                    style={{ background: "#0d1117", color: "white" }}
                    placeholder="e.g. Peterbilt"
                  />
                  {errors.make && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {errors.make.message}
                    </p>
                  )}
                </div>

                <div className="col-md-4">
                  <label className={LABEL_STYLE}>MODEL</label>
                  <input
                    {...register("model", { required: true })}
                    className="form-control glass-input-premium text-white py-2"
                    style={{ background: "#0d1117", color: "white" }}
                    placeholder="e.g. 579"
                  />
                  {errors.model && (
                    <p className="text-danger small mt-1 mb-0 fw-bold">
                      {errors.model.message}
                    </p>
                  )}
                </div>

                <div className="col-md-12">
                  <label className={LABEL_STYLE}>VEHICLE CLASSIFICATION</label>
                  {/* Hidden RHF field for validation */}
                  <input
                    type="hidden"
                    {...register("type", {
                      required: "Classification is required",
                    })}
                  />
                  <FleetGlassSelect
                    value={watchedType}
                    onChange={(v) =>
                      setValue("type", v, { shouldValidate: true })
                    }
                    options={
                      activeTab === "trucks"
                        ? ["Sleeper Cab", "Day Cab"]
                        : ["Dry Van", "Reefer", "Tri Axle", "Flatbed"]
                    }
                    placeholder="Select Category..."
                    accentColor={activeTab === "trucks" ? "#10b981" : "#6366f1"}
                    accentRgb={
                      activeTab === "trucks" ? "16, 185, 129" : "99, 102, 241"
                    }
                    error={errors.type?.message}
                  />
                </div>

                <div className="col-12 text-end mt-4 d-flex gap-3 justify-content-end align-items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null); // Reset editingId when canceling
                      reset({
                        no: "",
                        vin: "",
                        plate: "",
                        year: new Date().getFullYear(),
                        make: "",
                        model: "",
                      });
                      setAsyncErrors({}); // Clear errors when canceling
                    }}
                    className="btn btn-outline-white rounded-pill px-4 py-2 hover-scale transition-all fw-bold text-white border-white border-opacity-25 text-decoration-none"
                    title="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={Object.values(asyncErrors).some(err => err !== undefined)}
                    className={`btn btn-emerald rounded-pill px-5 py-3 fw-bold shadow-lg transition-all ${
                      Object.values(asyncErrors).some(err => err !== undefined)
                        ? "opacity-50 grayscale cursor-not-allowed"
                        : "hover-scale"
                    }`}
                    title={editingId ? "Update Asset" : "Save Vehicle"}
                  >
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
          background: "rgba(13, 17, 23, 0.9)",
          backdropFilter: "blur(60px) saturate(250%) brightness(0.8)",
          WebkitBackdropFilter: "blur(60px) saturate(250%) brightness(0.8)",
          border: "1px solid rgba(255,255,255,0.20)",
          boxShadow:
            "0 30px 80px -10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="table-responsive">
          <table
            className="table m-0 text-white"
            style={{ borderCollapse: "separate", borderSpacing: "0" }}
          >
            <thead>
              <tr className="border-bottom border-white border-opacity-10 align-middle">
                <th
                  className="py-4 text-uppercase text-center"
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    width: "100px",
                    color: activeTab === "trucks" ? "#10b981" : "#818cf8",
                    opacity: 1,
                  }}
                >
                  {activeTab === "trucks" ? "Truck #" : "Trailer #"}
                </th>
                <th
                  className="py-4 text-uppercase text-center"
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    color: activeTab === "trucks" ? "#10b981" : "#818cf8",
                    opacity: 1,
                  }}
                >
                  VIN
                </th>
                <th
                  className="py-4 text-uppercase text-center"
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    color: activeTab === "trucks" ? "#10b981" : "#818cf8",
                    opacity: 1,
                  }}
                >
                  License Plate
                </th>
                <th
                  className="py-4 text-uppercase text-center"
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    width: "180px",
                    color: activeTab === "trucks" ? "#10b981" : "#818cf8",
                    opacity: 1,
                  }}
                >
                  Type
                </th>
                <th
                  className="py-4 text-uppercase text-center"
                  style={{
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    color: activeTab === "trucks" ? "#10b981" : "#818cf8",
                    opacity: 1,
                  }}
                >
                  Vehicle Matrix
                </th>
                <th
                  className="py-4 text-uppercase text-center"
                  style={{
                    fontSize: "11px",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                    width: "180px",
                    color: activeTab === "trucks" ? "#10b981" : "#818cf8",
                    opacity: 1,
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="d-flex flex-column align-items-center gap-3">
                      <div
                        className="spinner-border spinner-border-sm text-emerald"
                        role="status"
                      ></div>
                      <span className="text-white opacity-75 fw-bold tracking-wider fs-6">
                        Establishing Fleet Sync...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : activeTab === "trucks" ? (
                paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="py-4" style={{ opacity: 0.6 }}>
                        <h3
                          className="text-white fw-black tracking-tighter mb-1"
                          style={{ fontSize: "1.1rem" }}
                        >
                          {searchQuery
                            ? "NO MATCHING ASSETS"
                            : "ZERO ASSETS DETECTED"}
                        </h3>
                        <p className="text-white-50 fw-bold small">
                          {searchQuery
                            ? "Refine your search parameters to find the unit you're looking for."
                            : "Populate your logistics fleet to begin operations."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (paginatedData as Truck[]).map((t: Truck) => (
                    <tr
                      key={t._id}
                      className="premium-row border-bottom border-white border-opacity-5 transition-all align-middle"
                      style={{ background: "rgba(255,255,255,0.01)" }}
                    >
                      <td className="py-4 text-center">
                        <span
                          className="fw-black text-white"
                          style={{ letterSpacing: "-0.2px", fontSize: "16.5px" }}
                        >
                          {t.truckNo}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className="font-monospace text-white"
                          style={{ fontSize: "13.5px", letterSpacing: "0.5px" }}
                        >
                          {t.vin}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span
                          className="font-monospace fw-black px-3 py-1 bg-white bg-opacity-10 rounded border border-white border-opacity-20 text-white shadow-sm"
                          style={{
                            fontSize: "13.5px",
                            letterSpacing: "0.5px",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {t.plate}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        {(() => {
                          const s = getTypeStyle(t.truckType);
                          return (
                            <div
                              className="d-inline-flex align-items-center px-4 py-1 rounded-pill fw-bold"
                              style={{
                                fontSize: "12.5px",
                                letterSpacing: "0.5px",
                                background: s.bg,
                                border: `1px solid ${s.border}`,
                                color: s.text,
                                boxShadow: `0 0 12px ${s.shadow}`,
                                textTransform: "uppercase",
                              }}
                            >
                              <svg
                                className="me-2"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                              </svg>
                              {t.truckType}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-4 text-center">
                        <div className="d-flex flex-column align-items-center">
                          <span
                            className="fw-black text-white text-uppercase"
                            style={{
                              letterSpacing: "0.5px",
                              fontSize: "14.5px",
                            }}
                          >
                            {t.make}{" "}
                            <span className="text-white-50 fw-medium">
                              / {t.model}
                            </span>
                          </span>
                          <span
                            className="text-white-50 fw-bold"
                            style={{ fontSize: "11.5px", letterSpacing: "1px" }}
                          >
                            EDITION {t.year}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            onClick={() => handleEdit(t)}
                            className="btn d-inline-flex align-items-center justify-content-center px-4 py-1 rounded-pill fw-black transition-all border-0"
                            style={{
                              fontSize: "12px",
                              letterSpacing: "1px",
                              backgroundColor: "rgba(16, 185, 129, 0.1)",
                              border:
                                "1px solid rgba(16, 185, 129, 0.25) !important",
                              color: "#10b981",
                              minWidth: "80px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(16, 185, 129, 0.2)";
                              e.currentTarget.style.boxShadow =
                                "0 0 15px rgba(16, 185, 129, 0.3)";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(16, 185, 129, 0.1)";
                              e.currentTarget.style.boxShadow = "none";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({ id: t._id, no: t.truckNo })
                            }
                            className="btn d-inline-flex align-items-center justify-content-center px-4 py-1 rounded-pill fw-black transition-all border-0"
                            style={{
                              fontSize: "11px",
                              letterSpacing: "1px",
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              border:
                                "1px solid rgba(239, 68, 68, 0.25) !important",
                              color: "#ef4444",
                              minWidth: "80px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(239, 68, 68, 0.2)";
                              e.currentTarget.style.boxShadow =
                                "0 0 15px rgba(239, 68, 68, 0.3)";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(239, 68, 68, 0.1)";
                              e.currentTarget.style.boxShadow = "none";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="py-4" style={{ opacity: 0.6 }}>
                      <h3
                        className="text-white fw-black tracking-tighter mb-1"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {searchQuery
                          ? "NO MATCHING ASSETS"
                          : `NO ${activeTab.toUpperCase()} IN INVENTORY`}
                      </h3>
                      <p className="text-white-50 fw-bold small">
                        {searchQuery
                          ? "Refine your search parameters to find the unit you're looking for."
                          : "Populate your logistics fleet to begin operations."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                (paginatedData as Trailer[]).map((t: Trailer) => (
                  <tr
                    key={t._id}
                    className="premium-row border-bottom border-white border-opacity-5 transition-all align-middle"
                    style={{ background: "rgba(255,255,255,0.01)" }}
                  >
                    <td className="py-4 text-center">
                      <span
                        className="fw-black text-white"
                        style={{ letterSpacing: "-0.2px", fontSize: "16.5px" }}
                      >
                        {t.trailerNo}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className="font-monospace text-white"
                        style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                      >
                        {t.vin}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className="font-monospace fw-black px-3 py-1 bg-white bg-opacity-10 rounded border border-white border-opacity-20 text-white shadow-sm"
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.5px",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {t.plate}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      {(() => {
                        const s = getTypeStyle(t.trailerType);
                        return (
                          <div
                            className="d-inline-flex align-items-center px-4 py-1 rounded-pill fw-bold shadow-sm"
                            style={{
                              fontSize: "11px",
                              letterSpacing: "0.5px",
                              background: s.bg,
                              border: `1px solid ${s.border}`,
                              color: s.text,
                              boxShadow: `0 0 12px ${s.shadow}`,
                              textTransform: "uppercase",
                            }}
                          >
                            {t.trailerType}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-4 text-center">
                      <div className="d-flex flex-column align-items-center">
                        <span
                          className="fw-black text-white text-uppercase"
                          style={{ letterSpacing: "0.5px", fontSize: "13px" }}
                        >
                          {t.make}{" "}
                          <span className="text-white-50 fw-medium">
                            / {t.model}
                          </span>
                        </span>
                        <span
                          className="text-white-50 fw-bold"
                          style={{ fontSize: "10px", letterSpacing: "1px" }}
                        >
                          EDITION {t.year}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => handleEdit(t)}
                          className="btn d-inline-flex align-items-center justify-content-center px-4 py-1 rounded-pill fw-black transition-all border-0"
                          style={{
                            fontSize: "12px",
                            letterSpacing: "1px",
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            border:
                              "1px solid rgba(16, 185, 129, 0.25) !important",
                            color: "#10b981",
                            minWidth: "80px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(16, 185, 129, 0.2)";
                            e.currentTarget.style.boxShadow =
                              "0 0 15px rgba(16, 185, 129, 0.3)";
                            e.currentTarget.style.transform =
                              "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(16, 185, 129, 0.1)";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({ id: t._id, no: t.trailerNo })
                          }
                          className="btn d-inline-flex align-items-center justify-content-center px-4 py-1 rounded-pill fw-black transition-all border-0"
                          style={{
                            fontSize: "11px",
                            letterSpacing: "1px",
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            border:
                              "1px solid rgba(239, 68, 68, 0.25) !important",
                            color: "#ef4444",
                            minWidth: "80px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(239, 68, 68, 0.2)";
                            e.currentTarget.style.boxShadow =
                              "0 0 15px rgba(239, 68, 68, 0.3)";
                            e.currentTarget.style.transform =
                              "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(239, 68, 68, 0.1)";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          DELETE
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

      {/* ─── Pagination Controls ───────────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-5 px-4">
          <div className="d-flex w-100 justify-content-center align-items-center gap-2">
            {/* First Page */}
            <button
              title="First Page"
              aria-label="First Page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all"
              style={{
                width: "40px",
                height: "40px",
                background: "rgba(255, 255, 255, 0.05)",
                color: currentPage === 1 ? "rgba(255,255,255,0.2)" : "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
              </svg>
            </button>

            {/* Prev Page */}
            <button
              title="Previous Page"
              aria-label="Previous Page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all"
              style={{
                width: "40px",
                height: "40px",
                background: "rgba(255, 255, 255, 0.05)",
                color: currentPage === 1 ? "rgba(255,255,255,0.2)" : "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Current Page Circle */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-black shadow-lg"
              style={{
                width: "48px",
                height: "48px",
                background: activeTab === "trucks" ? "#10b981" : "#6366f1",
                color: "#000",
                fontSize: "16px",
                boxShadow: `0 0 20px -2px ${activeTab === "trucks" ? "rgba(16,185,129,0.5)" : "rgba(99,102,241,0.5)"}`,
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {currentPage}
            </div>

            {/* Next Page */}
            <button
              title="Next Page"
              aria-label="Next Page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all"
              style={{
                width: "40px",
                height: "40px",
                background: "rgba(255, 255, 255, 0.05)",
                color:
                  currentPage === totalPages ? "rgba(255,255,255,0.2)" : "#fff",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {/* Last Page */}
            <button
              title="Last Page"
              aria-label="Last Page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center border-0 transition-all"
              style={{
                width: "40px",
                height: "40px",
                background: "rgba(255, 255, 255, 0.05)",
                color:
                  currentPage === totalPages ? "rgba(255,255,255,0.2)" : "#fff",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m13 17 5-5-5-5M6 17l5-5-5-5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle?"
        message={`Are you sure you want to remove ${activeTab === "trucks" ? "Truck" : "Trailer"} ${deleteConfirm?.no}? This action cannot be undone.`}
        confirmText="Remove Vehicle"
        type="danger"
      />

      <style jsx global>{`
        .premium-row {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease !important;
        }

        .premium-row:hover {
          background: rgba(255, 255, 255, 0.04) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .premium-row td {
          vertical-align: middle !important;
        }

        .row-action-btn {
          opacity: 0.6;
          transition: all 0.2s ease !important;
        }

        .premium-row:hover .row-action-btn {
          opacity: 1;
        }

        .row-action-btn:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-1px);
        }

        @keyframes blink-soft {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top left;
        }

        .blink-soft {
          animation: blink-soft 2s ease-in-out infinite;
        }

        .glass-input-premium {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }

        .search-container-premium input::placeholder {
          font-size: 11px !important;
          text-transform: capitalize !important;
          opacity: 0.45 !important;
          letter-spacing: 0.2px !important;
          font-weight: 500 !important;
        }
      `}</style>
    </div>
  );
}
