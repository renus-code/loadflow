"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import DispatchTable from "@/components/DispatchTable";
import LoadDetailsModal from "@/components/LoadDetailsModal";
import AdminVisualSummary from "@/components/AdminVisualSummary";
import ConfirmationModal from "@/components/ConfirmationModal";
import FleetSection from "@/components/FleetSection";
import { useSearch } from "@/context/SearchContext";
import { ILoad, IStop } from "@/models/Load";
import { useForm, useFieldArray, Controller, Control, useWatch, UseFormRegister } from "react-hook-form";
// import { resolveState } from "@/lib/location";
import { StateProvinceSelect, CitySelect } from "@/components/LocationSelects";

// Removed redundant US_STATES and CA_PROVINCES - now using lib/location

// Removed redundant resolveState

const FIELD =
  "form-control rounded-4 p-3 glass-input-premium text-white shadow-sm focus-ring-emerald transition-all border-white border-opacity-10 shadow-none";

// Shared components are now used from @/components/LocationSelects

interface SelectOption { value: string; label: string; }

function GlassySelect({ options, value, onChange, id }: { options: SelectOption[]; value: string; onChange: (v: string) => void; id?: string }) {
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
    <div ref={ref} className="position-relative w-100">
      <button
        type="button"
        id={id}
        className="form-select form-select-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none w-100 text-start d-flex justify-content-between align-items-center"
        style={{
          background: "#0d1117",
          color: "white",
          backgroundImage: "none",
        }}
        onClick={() => setOpen(!open)}
      >
        <span>
          {options.find((o) => o.value === value)?.label || "Select..."}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: 0.5,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          className="list-unstyled position-absolute w-100 bg-dark border border-white border-opacity-10 rounded-4 shadow-2xl mt-1 py-1"
          style={{ zIndex: 9999, maxHeight: "250px", overflowY: "auto" }}
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                className={`btn btn-link text-decoration-none w-100 text-start px-3 py-2 small fw-medium hover-bg-white-5 ${
                  value === opt.value ? "text-emerald fw-black" : "text-white"
                }`}
                onMouseDown={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LocationBlock({
  type,
  index,
  control,
  register,
  onRemove,
  isRemovable,
}: {
  type: "pickups" | "deliveries";
  index: number;
  control: Control<LoadFormData>;
  register: UseFormRegister<LoadFormData>;
  onRemove: () => void;
  isRemovable: boolean;
}) {
  const isPickup = type === "pickups";
  const prefix = `${type}.${index}` as const;

  const stateCode = useWatch({
    control,
    name: `${prefix}.state`,
  });

  return (
    <div
      className={`shadow-sm rounded-4 p-4 stop-card h-100 position-relative transition-all`}
      style={{
        borderLeft: `6px solid ${isPickup ? "#6366f1" : "#10b981"}`,
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.05) !important",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="badge rounded-pill bg-light text-primary fw-bold px-3 py-2 border shadow-sm stop-label d-flex align-items-center gap-2">
          {type === "pickups" ? "📦 PICKUP" : "🚚 DELIVERY"} #{index + 1}
        </span>
        {isRemovable && (
          <button
            type="button"
            className="btn btn-link text-danger p-0 text-decoration-none opacity-50 hover-opacity-100 transition-all"
            onClick={onRemove}
            title="Remove Stop"
          >
            <svg
              width="18"
              height="18"
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
        )}
      </div>
      <div className="d-flex flex-column gap-3">
        <div className="row g-3">
          <div className="col-12">
            <label
              htmlFor={`${prefix}.address`}
              className="small fw-black text-white mb-1 px-1 opacity-50 text-uppercase tracking-wider"
              style={{ fontSize: "10px" }}
            >
              Address *
            </label>
            <input
              id={`${prefix}.address`}
              required
              className={FIELD}
              style={{ background: "#0d1117", color: "white" }}
              placeholder="123 Industrial Way"
              {...register(`${prefix}.address`, { required: true })}
            />
          </div>
          <div className="col-md-6">
            <label
              htmlFor={`${prefix}.state`}
              className="small fw-black text-white mb-1 px-1 opacity-50 text-uppercase tracking-wider"
              style={{ fontSize: "10px" }}
            >
              State / Province *
            </label>
            <Controller
              name={`${prefix}.state`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <StateProvinceSelect
                  id={`${prefix}.state`}
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v);
                    // Reset city when state changes
                    // Reset city when state changes
                    // field.onChange(v);
                  }}
                />
              )}
            />
          </div>
          <div className="col-md-6">
            <label
              htmlFor={`${prefix}.city`}
              className="small fw-black text-white mb-1 px-1 opacity-50 text-uppercase tracking-wider"
              style={{ fontSize: "10px" }}
            >
              City *
            </label>
            <Controller
              name={`${prefix}.city`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => {
                return (
                  <CitySelect
                    id={`${prefix}.city`}
                    stateCode={stateCode}
                    value={field.value}
                    onChange={field.onChange}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-5">
            <label
              className="small fw-black text-white mb-1 opacity-50 text-uppercase tracking-wider"
              style={{ fontSize: "10px" }}
            >
              Postal Code *
            </label>
            <input
              required
              className={FIELD}
              style={{ background: "#0d1117", color: "white" }}
              placeholder="M5V 2L7"
              {...register(`${prefix}.postalCode`, { required: true })}
            />
          </div>
          <div className="col-md-7">
            <label
              className="small fw-black text-white mb-1 opacity-50 text-uppercase tracking-wider"
              style={{ fontSize: "10px" }}
            >
              Appt / PO # *
            </label>
            <input
              required
              className={FIELD}
              style={{ background: "#0d1117", color: "white" }}
              placeholder="A-998811"
              {...register(`${prefix}.appointmentNumber`, { required: true })}
            />
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-7">
            <label
              className="small fw-black text-white mb-1 opacity-50 text-uppercase tracking-wider"
              style={{ fontSize: "10px" }}
            >
              Date *
            </label>
            <input
              required
              type="date"
              className={FIELD}
              style={{ background: "#0d1117", color: "white" }}
              {...register(`${prefix}.date`, { required: true })}
            />
          </div>
          <div className="col-md-5">
            <label
              className="small fw-black text-white mb-1 opacity-50 text-uppercase tracking-wider"
              style={{ fontSize: "10px" }}
            >
              Time *
            </label>
            <input
              required
              type="time"
              className={FIELD}
              style={{ background: "#0d1117", color: "white" }}
              {...register(`${prefix}.time`, { required: true })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Interfaces are now imported from @/models/Load
// Helper type for form stops where date is a string (from input type="date")
type FormStop = Omit<IStop, "date" | "status"> & { 
  date: string;
  status: "PENDING" | "PICKED_UP" | "DELIVERED";
};

type LoadFormData = {
  loadNumber: string;
  pickups: FormStop[]; 
  deliveries: FormStop[];
  quantity: string;
  quantityUnit: string;
  weight: string;
  weightUnit: string;
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [loads, setLoads] = useState<ILoad[]>([]);
  const [drivers, setDrivers] = useState<{ _id: string; name: string; email?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { searchTerm, setSearchTerm } = useSearch();
  const [selectedLoad, setSelectedLoad] = useState<ILoad | null>(null);
  const [editingLoadId, setEditingLoadId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentView, setCurrentView] = useState<"loads" | "fleet">("loads");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "warning" | "danger";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });
  const initialStop = useMemo<FormStop>(
    () => ({
      address: "",
      city: "",
      state: "",
      postalCode: "",
      appointmentNumber: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
      status: "PENDING",
    }),
    [],
  );

  const { register, handleSubmit, control, reset } = useForm<LoadFormData>({
    defaultValues: {
      loadNumber: "",
      pickups: [{ ...initialStop }],
      deliveries: [{ ...initialStop }],
      quantity: "",
      quantityUnit: "pallets",
      weight: "",
      weightUnit: "lbs",
    },
  });

  const {
    fields: pickupFields,
    append: appendPickup,
    remove: removePickup,
  } = useFieldArray({ control, name: "pickups" });
  const {
    fields: deliveryFields,
    append: appendDelivery,
    remove: removeDelivery,
  } = useFieldArray({ control, name: "deliveries" });

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchLoads = useCallback(async () => {
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
  }, []); // removed unnecessary user dependency

  const fetchDrivers = useCallback(async () => {
    try {
      if (user?.role === "Admin" || user?.role === "Dispatcher") {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setDrivers(
            data.filter(
              (u: { _id: string; role: string; isPending?: boolean; email?: string }) =>
                u.role === "Driver" && u.isPending !== true,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    }
  }, [user?.role]);

  const availableDrivers = useMemo(() => {
    // Current busy drivers (assigned to other active loads)
    const busyDriverIds = new Set(
      loads
        .filter((l) => l.status !== "COMPLETED" && String(l._id) !== editingLoadId)
        .map((l) => {
          const driverId = (l.assignedDriverId as unknown as { _id: string })?._id || l.assignedDriverId;
          return driverId?.toString();
        })
        .filter(Boolean),
    );

    return drivers.filter((d) => !busyDriverIds.has(d._id.toString()));
  }, [drivers, loads, editingLoadId]);

  useEffect(() => {
    if (user) {
      fetchLoads();
      fetchDrivers();
      const interval = setInterval(fetchLoads, 15000);
      return () => clearInterval(interval);
    }
  }, [user, fetchLoads, fetchDrivers]);

  // Keep selectedLoad in sync with updated loads data
  useEffect(() => {
    if (selectedLoad) {
      const currentLoad = loads.find((l) => String(l._id) === String(selectedLoad._id));
      if (currentLoad && currentLoad !== selectedLoad) {
        setSelectedLoad(currentLoad);
      }
    }
  }, [loads, selectedLoad]); // added selectedLoad to dependencies

  useEffect(() => {
    const handleOpenModal = () => {
      setEditingLoadId(null);
      reset({
        loadNumber: "",
        pickups: [{ ...initialStop }],
        deliveries: [{ ...initialStop }],
        quantity: "",
        quantityUnit: "pallets",
        weight: "",
        weightUnit: "lbs",
      });
      setShowModal(true);
    };
    window.addEventListener("open-create-load", handleOpenModal);
    return () =>
      window.removeEventListener("open-create-load", handleOpenModal);
  }, [reset, initialStop]);

  const onSubmit = async (data: LoadFormData) => {
    try {
      const url = editingLoadId ? `/api/loads/${editingLoadId}` : "/api/loads";
      const method = editingLoadId ? "PUT" : "POST";
      
      const payload = {
        ...data,
        quantity: Number(data.quantity),
        weight: Number(data.weight),
        pickups: data.pickups.map(p => ({
          ...p,
          date: new Date(p.date)
        })),
        deliveries: data.deliveries.map(d => ({
          ...d,
          date: new Date(d.date)
        }))
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowModal(false);
        setEditingLoadId(null);
        reset();
        fetchLoads();
      }
    } catch (error) {
      console.error("Failed to save load:", error);
    }
  };

  const handleEditLoad = (load: ILoad) => {
    setEditingLoadId(String(load._id));
    reset({
      loadNumber: load.loadNumber,
      pickups: load.pickups.map((p) => ({
        ...p,
        date: new Date(p.date).toISOString().split("T")[0],
      })),
      deliveries: load.deliveries.map((d) => ({
        ...d,
        date: new Date(d.date).toISOString().split("T")[0],
      })),
      quantity: load.quantity.toString(),
      quantityUnit: load.quantityUnit,
      weight: load.weight.toString(),
      weightUnit: load.weightUnit,
    });
    setShowModal(true);
  };

  const handleDeleteLoad = async (load: ILoad) => {
    const isAdmin = user?.role === "Admin";
    const title = isAdmin ? "Delete Load?" : "Cancel Load?";
    const message = isAdmin
      ? "Are you sure you want to DELETE this load PERMANENTLY? This action cannot be undone."
      : "Are you sure you want to CANCEL this load? It will be removed from the active dashboard.";

    setConfirmModal({
      isOpen: true,
      title,
      message,
      type: isAdmin ? "danger" : "warning",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/loads/${load._id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            if (selectedLoad && String(selectedLoad._id) === String(load._id)) {
              setSelectedLoad(null);
            }
            fetchLoads();
          } else {
            const data = await res.json();
            alert(data.error || `${isAdmin ? "Deletion" : "Cancellation"} failed`);
          }
        } catch (err) {
          console.error(`${isAdmin ? "Deletion" : "Cancellation"} failed:`, err);
          alert(`Error ${isAdmin ? "deleting" : "cancelling"} load`);
        }
      },
    });
  };

  const filteredLoads = loads.filter((l) => {
    const searchLower = (searchTerm || "").toLowerCase().trim();
    if (!searchLower) return true;

    // Restrict search EXCLUSIVELY to Load Number as requested
    return (l.loadNumber || "").toLowerCase().includes(searchLower);
  });

  const totalLoadsCount = loads.length;
  const pendingCount = loads.filter(
    (l) => l.status === "PENDING" || !l.status,
  ).length;
  const transitCount = loads.filter(
    (l) => l.status === "IN_TRANSIT" || l.status === "PICKED_UP",
  ).length;
  const deliveredCount = loads.filter((l) => l.status === "DELIVERED").length;
  const completedCount = loads.filter((l) => l.status === "COMPLETED").length;

  return (
    <div
      className="container-fluid px-0 animate-fade-in"
      style={{ maxWidth: "1600px" }}
    >
      {/* DASHBOARD HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 mt-1 gap-2 border-bottom pb-3 border-opacity-10 border-white">
        <div className="text-start">
          <h1
            className="display-6 fw-black text-white m-0 tracking-tight"
            style={{ fontFamily: "var(--font-syne)", letterSpacing: "-0.04em" }}
          >
            <span className="text-gradient-emerald">{user?.role || "User"}</span>{" "}
            Dashboard
          </h1>
          <p
            className="text-white mt-1 fw-bold mb-0 opacity-35 text-uppercase small"
            style={{ letterSpacing: "0.15rem", fontSize: "0.7rem" }}
          >
            {todayStr}
          </p>
        </div>

        {user?.role === "Admin" && (
          <div className="d-flex glass-card p-1 rounded-pill border border-white border-opacity-10 shadow-sm" style={{ background: "rgba(255,255,255,0.03)" }}>
            <button 
              onClick={() => setCurrentView("loads")}
              className={`btn rounded-pill px-4 py-2 fw-bold transition-all border-0 ${currentView === "loads" ? "btn-emerald shadow-lg" : "text-white opacity-50"}`}
              style={{ fontSize: "0.8rem" }}
            >
              Loads
            </button>
            <button 
              onClick={() => setCurrentView("fleet")}
              className={`btn rounded-pill px-4 py-2 fw-bold transition-all border-0 ${currentView === "fleet" ? "btn-emerald shadow-lg" : "text-white opacity-50"}`}
              style={{ fontSize: "0.8rem" }}
            >
              Fleet
            </button>
          </div>
        )}
      </div>

      {currentView === "fleet" && user?.role === "Admin" ? (
        <FleetSection />
      ) : (
        <>
          {user?.role === "Admin" && (
            <div className="mb-5">
              <AdminVisualSummary loads={loads} drivers={drivers} />
            </div>
          )}

          {/* STATS CARDS GRID - PREMIUM GLASS V4 */}
      <div className="row g-4 mb-5">
        {[
          {
            label: "All Loads",
            value: totalLoadsCount,
            color: "var(--accent-emerald)",
            glow: "nebula-glow-emerald",
            icon: "inventory_2",
            bg: "linear-gradient(135deg, rgba(43, 221, 102, 0.12) 0%, rgba(43, 221, 102, 0.05) 100%)",
          },

          {
            label: "Pending",
            value: pendingCount,
            color: "#00d4ff",
            glow: "nebula-glow-cyan",
            icon: "pending_actions",
            bg: "linear-gradient(135deg, rgba(0, 212, 255, 0.12) 0%, rgba(0, 212, 255, 0.05) 100%)",
          },

          {
            label: "In Transit",
            value: transitCount,
            color: "var(--accent-orange)",
            glow: "nebula-glow-orange",
            icon: "route",
            bg: "linear-gradient(135deg, rgba(255, 140, 0, 0.12) 0%, rgba(255, 140, 0, 0.05) 100%)",
          },

          {
            label: "Awaiting Verify",
            value: deliveredCount,
            color: "#9093ff",
            glow: "nebula-glow-indigo",
            icon: "verified_user",
            bg: "linear-gradient(135deg, rgba(144, 147, 255, 0.12) 0%, rgba(144, 147, 255, 0.05) 100%)",
          },

          {
            label: "Completed",
            value: completedCount,
            color: "#dee5ff",
            glow: "",
            icon: "task_alt",
            bg: "rgba(255, 255, 255, 0.03)",
          },
        ].map((stat, i) => (
          <div key={i} className="col-12 col-sm-6 col-md-4 col-xl">
            <div
              className={`glass-card-stitch p-4 rounded-4 position-relative overflow-hidden group ${stat.glow} h-100 d-flex flex-column animate-slide-up hover-float transition-all`}
              style={{ animationDelay: `${i * 100}ms`, background: stat.bg }}
            >
              <div
                className="position-absolute top-0 start-0 h-100"
                style={{ width: "6px", background: stat.color }}
              ></div>
              <p
                className="text-uppercase fw-black mb-4"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.15rem",
                  color: "#ffffff",
                  opacity: 0.6,
                }}
              >
                {stat.label}
              </p>
              <div className="d-flex align-items-end justify-content-between mt-auto position-relative z-index-2">
                <h3
                  className="fw-black mb-0"
                  style={{
                    color: "#fff",
                    fontSize: "3.5rem",
                    fontFamily: "var(--font-syne)",
                    letterSpacing: "-0.05em",
                    lineHeight: "1",
                  }}
                >
                  {stat.value}
                </h3>
                <span className="material-symbols-outlined stat-icon-bg">
                  {stat.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DISPATCH table SECTION - GLASS V4 */}
      <div className="card border border-white border-opacity-10 shadow-2xl rounded-5 overflow-hidden animate-slide-up bg-transparent">
        <div className="card-header border-bottom border-white border-opacity-10 px-5 py-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex flex-column">
              <h2
                className="fs-2 fw-black text-white m-0 tracking-tight"
                style={{
                  fontFamily: "var(--font-syne)",
                  letterSpacing: "-0.03em",
                }}
              >
                Real-time <span className="text-gradient-emerald">Board</span>
              </h2>
            </div>
          </div>

          <div className="ms-auto d-flex align-items-center gap-3">
            {/* COMPACT PREMIUM SEARCH */}
            <div
              className="glass-card-stitch p-1 rounded-pill d-flex align-items-center border border-white border-opacity-10 shadow-lg"
              style={{
                width: "320px",
                background: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="ps-2" style={{ color: "#2bdd66" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                className="form-control bg-transparent border-0 text-white shadow-none py-1 px-3 fw-bold placeholder-white-40"
                placeholder="Search by Load # only..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: "0.85rem" }}
              />
              {searchTerm && (
                <button
                  className="btn btn-link text-white opacity-30 p-1 me-1 hover-opacity-100 transition-all shadow-none border-0"
                  onClick={() => setSearchTerm("")}
                  title="Clear search"
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            {isLoading || !user ? (
              <div className="d-flex justify-content-center p-5">
                <div className="spinner-border text-emerald" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredLoads.length === 0 ? (
              <div className="text-center py-5">
                <div className="opacity-10 mb-4 d-flex justify-content-center text-white">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="20"
                      height="14"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h3 className="fs-5 fw-black text-white opacity-40">
                  No Dispatch Records
                </h3>
                <p className="small text-white opacity-70 m-0">
                  Real-time logistics analytics. Satellite systems are clear.
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <DispatchTable
                loads={filteredLoads}
                drivers={drivers}
                user={user}
                onDetails={(load) => setSelectedLoad(load)}
                onEdit={
                  user?.role === "Dispatcher" ? handleEditLoad : undefined
                }
                onDelete={
                  user.role === "Admin" || user.role === "Dispatcher"
                    ? handleDeleteLoad
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {selectedLoad && user && (
        <LoadDetailsModal
          load={selectedLoad as ILoad}
          user={user}
          drivers={availableDrivers}
          onClose={() => setSelectedLoad(null)}
          onUpdate={fetchLoads}
        />
      )}

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center p-3 p-md-5 animate-fade-in"
          style={{ zIndex: 99999 }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100 backdrop-blur-[2px]"
            style={{
              position: "fixed",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
            onClick={() => {
              setShowModal(false);
              window.dispatchEvent(new CustomEvent("close-create-load"));
            }}
          ></div>
          <div
            className="card border-0 shadow-2xl glass-modal-v4 position-relative z-index-modal animate-slide-up overflow-hidden d-flex flex-column"
            style={{
              maxWidth: "1000px",
              width: "100%",
              maxHeight: "95vh",
              borderRadius: "2rem",
            }}
          >
            {/* STICKY GLASS HEADER */}
            <div
              className="d-flex justify-content-between align-items-center sticky-top glass-header-v4 p-4 p-md-5 pb-4"
              style={{ zIndex: 20 }}
            >
              <h3
                className="fs-1 fw-black text-white m-0 d-flex align-items-center gap-2"
                style={{
                  fontFamily: "var(--font-syne)",
                  letterSpacing: "-0.05em",
                }}
              >
                {editingLoadId ? "EDIT" : "CREATE NEW"}{" "}
                <span className="text-gradient-emerald">LOAD</span>
              </h3>
              <button
                className="btn-close btn-close-white shadow-none opacity-40 hover-opacity-100 transition-all scale-125"
                onClick={() => {
                  setShowModal(false);
                  setEditingLoadId(null);
                  reset();
                  window.dispatchEvent(new CustomEvent("close-create-load"));
                }}
                title="TERMINATE MISSION"
              ></button>
            </div>

            <div
              className="modal-body-scroll no-scrollbar p-0 flex-grow-1"
              style={{ overflowY: "auto" }}
            >
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-4 p-md-5 pt-0 row g-5"
              >
                {/* SECTION: GENERAL */}
                <div className="col-12 text-start">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center shadow-sm glass-icon-bg"
                      style={{ width: "45px", height: "45px" }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2bdd66"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <h5
                      className="fw-black text-white m-0 text-uppercase tracking-widest opacity-80"
                      style={{ fontSize: "0.85rem" }}
                    >
                      General Information
                    </h5>
                  </div>
                  <hr className="mt-2 mb-4 border-white opacity-10" />
                  <div className="px-1">
                    <label
                      htmlFor="loadNumberField"
                      className="small fw-bold text-white-50 mb-2 px-1 text-uppercase tracking-wider"
                    >
                      Load Reference Number *
                    </label>
                    <input
                      id="loadNumberField"
                      required
                      className="form-control form-control-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none"
                      style={{ background: "#0d1117", color: "white" }}
                      placeholder="e.g. #LD-882299"
                      {...register("loadNumber", { required: true })}
                    />
                  </div>
                </div>

                {/* SECTION: PICKUP */}
                <div className="col-12 text-start">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm glass-icon-bg-indigo"
                        style={{ width: "45px", height: "45px" }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                          <path d="M3.27 6.96 12 12.01l8.73-5.05"></path>
                          <path d="M12 22.08V12"></path>
                        </svg>
                      </div>
                      <h5
                        className="fw-black text-white m-0 text-uppercase tracking-widest opacity-80"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Pickup Stations
                      </h5>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-emerald fw-bold d-flex align-items-center gap-2 hover-float px-4 py-2 rounded-pill shadow-lg transition-all border-0"
                      onClick={() => appendPickup({ ...initialStop })}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      ADD PICKUP
                    </button>
                  </div>
                  <hr className="mt-2 mb-4 border-white opacity-10" />
                  <div className="row g-4">
                    {pickupFields.map((field, idx) => (
                      <div key={field.id} className="col-lg-6">
                        <LocationBlock
                          type="pickups"
                          index={idx}
                          control={control}
                          register={register}
                          onRemove={() => removePickup(idx)}
                          isRemovable={pickupFields.length > 1}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION: DELIVERY */}
                <div className="col-12 mt-4 text-start">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center shadow-sm glass-icon-bg-emerald"
                        style={{ width: "45px", height: "45px" }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <h5
                        className="fw-black text-white m-0 text-uppercase tracking-widest opacity-80"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Delivery Terminals
                      </h5>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-emerald fw-bold d-flex align-items-center gap-2 hover-float px-4 py-2 rounded-pill shadow-lg transition-all border-0"
                      onClick={() => appendDelivery({ ...initialStop })}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      ADD DELIVERY
                    </button>
                  </div>
                  <hr className="mt-2 mb-4 border-white opacity-10" />
                  <div className="row g-4">
                    {deliveryFields.map((field, idx) => (
                      <div key={field.id} className="col-lg-6">
                        <LocationBlock
                          type="deliveries"
                          index={idx}
                          control={control}
                          register={register}
                          onRemove={() => removeDelivery(idx)}
                          isRemovable={deliveryFields.length > 1}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION: CARGO */}
                <div className="col-12 mt-5 text-start">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center shadow-sm glass-icon-bg-orange"
                      style={{ width: "35px", height: "35px" }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </div>
                    <h5
                      className="fw-black text-white m-0 text-uppercase tracking-widest opacity-80"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Logistics Payload
                    </h5>
                  </div>
                  <hr className="mt-1 mb-3 border-white opacity-10" />
                  <div className="row g-3 px-1">
                    <div className="col-md-3">
                      <label className="small fw-bold text-white-50 mb-2 text-uppercase tracking-wider">
                        Quantity *
                      </label>
                      <input
                        required
                        type="number"
                        min={0}
                        className="form-control form-control-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none"
                        style={{ background: "#0d1117", color: "white" }}
                        placeholder="24"
                        {...register("quantity", { required: true, min: 0 })}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-white-50 mb-2 text-uppercase tracking-wider">
                        Unit *
                      </label>
                      <Controller
                        name="quantityUnit"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <GlassySelect
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                              { value: "skids", label: "Skids" },
                              { value: "pallets", label: "Pallets" },
                              { value: "packages", label: "Packages" },
                              { value: "pieces", label: "Pieces" },
                              { value: "box", label: "Box" },
                              { value: "cases", label: "Cases" },
                            ]}
                          />
                        )}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-white-50 mb-2 text-uppercase tracking-wider">
                        Weight *
                      </label>
                      <input
                        required
                        type="number"
                        min={0}
                        className="form-control form-control-lg glass-input-premium text-white px-4 py-3 border-white border-opacity-10 shadow-none"
                        style={{ background: "#0d1117", color: "white" }}
                        placeholder="45000"
                        {...register("weight", { required: true, min: 0 })}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold text-white-50 mb-2 text-uppercase tracking-wider">
                        Weight Unit *
                      </label>
                      <Controller
                        name="weightUnit"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <GlassySelect
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                              { value: "lbs", label: "lbs" },
                              { value: "kg", label: "kg" },
                            ]}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 mt-5 pb-5 px-1">
                  <button
                    type="submit"
                    className="btn btn-emerald w-100 rounded-pill py-3 fw-black fs-5 shadow-glow-emerald transition-all hover-float hover-scale active-scale-95 d-flex align-items-center justify-content-center gap-3 border-0"
                  >
                    <div className="bg-dark bg-opacity-10 p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    {editingLoadId ? "UPDATE LOAD" : "DISPATCH LOAD"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
      />

      <style jsx global>{`
        input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
        .section-label {
          font-family: var(--font-syne);
        }
        .hover-float:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1) !important;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
        .active-scale-95:active {
          transform: scale(0.95);
        }
        .tracking-tight {
          letter-spacing: -0.025em;
        }
        .z-index-modal {
          z-index: 100000;
        }
        .glass-modal-v4 {
          background: rgba(8, 10, 15, 0.98) !important;
          backdrop-filter: blur(80px);
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow:
            0 40px 100px rgba(0, 0, 0, 0.8),
            inset 0 0 0 1px rgba(255, 255, 255, 0.05) !important;
        }
        .btn-emerald {
          background: #2bdd66 !important;
          color: #0d1117 !important;
          border: none !important;
        }
        .shadow-glow-emerald {
          box-shadow: 0 0 30px rgba(43, 221, 102, 0.4) !important;
        }
        .btn-emerald:hover {
          background: #10b981 !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 25px rgba(43, 221, 102, 0.4) !important;
        }
        .glass-header-v4 {
          background: rgba(255, 255, 255, 0.03) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
        }
        .glass-input-premium {
          background: #0d1117 !important;
          background-color: #0d1117 !important;
          backdrop-filter: blur(10px);
          border-radius: 1rem !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          transition: all 0.3s ease;
        }
        .glass-input-premium:focus {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: #2bdd66 !important;
          box-shadow: 0 0 25px rgba(43, 221, 102, 0.2) !important;
        }
        .glass-input-premium option {
          background: #0d1117 !important;
          color: white !important;
        }
        .glass-icon-bg {
          background: rgba(43, 221, 102, 0.1);
          border: 1px solid rgba(43, 221, 102, 0.2);
        }
        .glass-icon-bg-indigo {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .glass-icon-bg-emerald {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .glass-icon-bg-orange {
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }
        .text-gradient-emerald {
          background: linear-gradient(135deg, #2bdd66 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stop-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important;
        }
        .fw-black {
          font-weight: 900;
        }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
        select.glass-input-premium {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e") !important;
          background-repeat: no-repeat !important;
          background-position: right 1rem center !important;
          background-size: 16px 12px !important;
          appearance: none !important;
        }
      `}</style>
    </div>
  );
}
