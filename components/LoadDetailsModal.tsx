"use client";

import React, { useState, useRef, useEffect } from "react";
import ProofOfDeliveryUpload from "@/components/ProofOfDeliveryUpload";
import ConfirmationModal from "@/components/ConfirmationModal";
import { ILoad, IStop } from "@/models/Load";
import { User } from "@/context/AuthContext";

interface Driver {
  _id: string;
  name: string;
  email?: string;
}

interface LoadDetailsModalProps {
  load: ILoad;
  user: User;
  drivers: Driver[];
  onClose: () => void;
  onUpdate: () => void;
}

interface GlassSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

function GlassSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: GlassSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="position-relative" ref={ref}>
      <div
        className="form-control border border-white border-opacity-20 text-white fw-bold shadow-none py-1 px-2 rounded-3 transition-all d-flex justify-content-between align-items-center"
        style={{
          fontSize: "12px",
          background: "rgba(255,255,255,0.05)",
          cursor: "pointer",
          minHeight: "28px",
        }}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(!isOpen);
            e.preventDefault();
          }
        }}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={placeholder}
      >
        <span className={selectedOption ? "opacity-100" : "opacity-50"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {isOpen && (
        <div
          className="position-absolute w-100 mt-1 rounded-3 overflow-hidden glass-card-premium border border-white border-opacity-10 shadow-lg"
          style={{
            zIndex: 1050,
            maxHeight: "200px",
            overflowY: "auto",
            background: "rgba(20, 20, 35, 0.95)",
            backdropFilter: "blur(12px)",
          }}
        >
          {options.map((o) => (
            <div
              key={o.value}
              className={`px-3 py-2 text-white cursor-pointer transition-all ${value === o.value ? "bg-emerald bg-opacity-20 text-emerald" : ""}`}
              style={{ fontSize: "12px" }}
              onClick={() => {
                onChange(o.value);
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                if (value !== o.value) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (value !== o.value) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LoadDetailsModal({
  load,
  user,
  drivers,
  onClose,
  onUpdate,
}: LoadDetailsModalProps) {
  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    (() => {
      const ad = load.assignedDriverId as Driver | string | null | undefined;
      if (!ad) return "";
      return typeof ad === "object" ? ad._id.toString() : ad.toString();
    })(),
  );
  const [truckNumber, setTruckNumber] = useState(load.truckNumber || "");
  const [trailerNumber, setTrailerNumber] = useState(load.trailerNumber || "");
  const [truckType, setTruckType] = useState(load.truckType || "");
  const [trailerType, setTrailerType] = useState(load.trailerType || "");
  const [showPODUpload, setShowPODUpload] = useState(false);
  const [showEditAssignment, setShowEditAssignment] = useState(false);
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

  useEffect(() => {
    const ad = load.assignedDriverId as Driver | string | null | undefined;
    const driverId = !ad
      ? ""
      : typeof ad === "object"
        ? ad._id.toString()
        : ad.toString();

    if (driverId !== selectedDriverId) setSelectedDriverId(driverId);
    if (load.truckNumber !== truckNumber)
      setTruckNumber(load.truckNumber || "");
    if (load.trailerNumber !== trailerNumber)
      setTrailerNumber(load.trailerNumber || "");
    if (load.truckType !== truckType) setTruckType(load.truckType || "");
    if (load.trailerType !== trailerType)
      setTrailerType(load.trailerType || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const handleAssign = async () => {
    try {
      const res = await fetch(`/api/loads/${load._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedDriverId: selectedDriverId,
          truckNumber,
          trailerNumber,
          truckType,
          trailerType,
          status: selectedDriverId ? "IN_TRANSIT" : "PENDING",
        }),
      });
      if (res.ok) {
        onUpdate();
        setShowEditAssignment(false);
      } else {
        const data = await res.json();
        alert(data.error || "Assignment failed");
      }
    } catch (err) {
      console.error("Assignment failed:", err);
      alert("Error assigning load");
    }
  };

  useEffect(() => {
    if (load) {
      console.log("[LoadDetailsModal] Rendering with role:", user?.role, "Load status:", load?.status);
    }
  }, [load, user?.role]);

  const handleUpdateStopStatus = async (
    type: "pickups" | "deliveries",
    index: number,
    stopStatus: string,
  ) => {
    try {
      const res = await fetch(`/api/loads/${load._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stopType: type, stopIndex: index, stopStatus }),
      });
      if (res.ok) {
        onUpdate();
      } else {
        const data = await res.json();
        alert(data.error || "Status update failed");
      }
    } catch (err) {
      console.error("Error updating stop status:", err);
      alert("Error updating status");
    }
  };

  const handleCompleteLoad = async () => {
    setConfirmModal({
      isOpen: true,
      title: "Complete Load?",
      message:
        "Are you sure you want to mark this load as COMPLETED? Once completed, it cannot be modified.",
      type: "warning",
      onConfirm: async () => {
        // The server-side API now handles the POD requirement for COMPLETED status
        try {
          const res = await fetch(`/api/loads/${load._id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "COMPLETED" }),
          });
          if (res.ok) {
            onUpdate();
            onClose();
          } else {
            const data = await res.json();
            alert(data.error || "Completion failed");
          }
        } catch (err) {
          console.error("Error completing load:", err);
          alert("Error completing load");
        }
      },
    });
  };

  const allPickupsDone = load.pickups.every(
    (p: IStop) => p.status === "PICKED_UP",
  );
  const allDeliveriesDone = load.deliveries.every(
    (d: IStop) => d.status === "DELIVERED",
  );

  const statusWorkflow = ["PENDING", "IN_TRANSIT", "DELIVERED", "COMPLETED"];
  const currentStatusIndex = statusWorkflow.indexOf(load.status);

  return (
    <React.Fragment>
      <div
        className="modal fade show d-block p-0"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(30px)",
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div
          className="modal-content border border-white border-opacity-10 shadow-2xl rounded-5 glass-card-solid animate-slide-up"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(43,221,102,0.1), transparent 50%), radial-gradient(circle at bottom left, rgba(99,102,241,0.1), transparent 50%), rgba(6, 14, 32, 0.90)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.15) !important",
            boxShadow:
              "0 0 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {/* HEADER WITH SHIMMER */}
          <div
            className="modal-header p-4 border-0 glass-wash"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-4 d-flex align-items-center justify-content-center p-2 border border-emerald border-opacity-40 shadow-glow-emerald"
                style={{
                  background: "rgba(43, 221, 102, 0.1)",
                  width: "48px",
                  height: "48px",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2bdd66"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <h5
                  className="modal-title fw-black mb-0 fs-3 text-gradient-emerald"
                  style={{
                    letterSpacing: "-0.02em",
                    fontFamily: "var(--font-syne)",
                  }}
                >
                  Load #{load.loadNumber}
                </h5>
                <p className="small text-white opacity-40 mb-0 d-flex align-items-center gap-2">
                  {load.pickups[0]?.city}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-emerald animate-pulse"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  {load.deliveries[load.deliveries.length - 1]?.city}
                </p>
              </div>
            <div className="d-flex align-items-center gap-3 ms-auto pe-4">
              {(user.role === "Admin" || user.role === "Dispatcher") && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title:
                        user.role === "Admin"
                          ? "Delete Permanently?"
                          : "Cancel Load?",
                      message:
                        user.role === "Admin"
                          ? "Are you sure you want to DELETE this load PERMANENTLY? This action cannot be undone."
                          : "Are you sure you want to CANCEL this load? It will be removed from the active dashboard.",
                      type: user.role === "Admin" ? "danger" : "warning",
                      onConfirm: async () => {
                        try {
                          const res = await fetch(`/api/loads/${load._id}`, {
                            method: "DELETE",
                          });
                          if (res.ok) {
                            onUpdate();
                            onClose();
                          } else {
                            const data = await res.json();
                            alert(data.error || "Action failed");
                          }
                        } catch (err) {
                          console.error("Action failed:", err);
                          alert("Error processing request");
                        }
                      },
                    });
                  }}
                  className={`btn btn-sm ${user.role === "Admin" ? "btn-outline-danger" : "btn-outline-warning"} border-0 px-3 fw-black rounded-pill text-uppercase d-flex align-items-center gap-2`}
                  style={{
                    fontSize: "10px",
                    background: "rgba(255,255,255,0.05)",
                    letterSpacing: "0.05em",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    className="rounded-circle bg-current"
                    style={{ width: "4px", height: "4px" }}
                  ></div>
                  {user.role === "Admin" ? "Delete" : "Cancel"}
                </button>
              )}
              <button
                type="button"
                className="btn-close btn-close-white opacity-50 hover-opacity-100 transition-all shadow-none"
                onClick={onClose}
                aria-label="Close"
                title="Close"
              ></button>
            </div>
          </div>
        </div>

          <div className="modal-body p-4 pt-2">
            <div className="row g-4 text-start">
              {/* STATUS TRACKER */}
              <div className="col-12 mt-4 mb-2">
                <div className="d-flex justify-content-between align-items-center px-4 mb-4 position-relative">
                  {/* PROGRESS LINES */}
                  <div
                    className="position-absolute h-1"
                    style={{
                      top: "14px",
                      left: "10%",
                      width: "80%",
                      background: "rgba(255,255,255,0.2)",
                      zIndex: 0,
                    }}
                  ></div>
                  <div
                    className="position-absolute h-1 transition-all duration-700"
                    style={{
                      top: "14px",
                      left: "10%",
                      width: `${(currentStatusIndex / (statusWorkflow.length - 1)) * 80}%`,
                      background: "#2bdd66",
                      boxShadow: "0 0 10px rgba(43, 221, 102, 0.5)",
                      zIndex: 0,
                    }}
                  ></div>

                  {statusWorkflow.map((node, i) => {
                    const isActive = load.status === node;
                    const isPast = currentStatusIndex > i;
                    const isCompletedLoad = load.status === "COMPLETED";

                    // If load is completed, show all nodes as "confirmed" (ticks)
                    const shouldShowTick =
                      isPast ||
                      (isActive && node !== "COMPLETED") ||
                      isCompletedLoad;

                    return (
                      <div
                        key={node}
                        className="d-flex flex-column align-items-center gap-2 flex-grow-1 position-relative"
                        style={{ zIndex: 1 }}
                      >
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center transition-all duration-500 ${isActive ? "bg-emerald shadow-glow-emerald border-emerald scale-110" : isPast || isCompletedLoad ? "bg-emerald bg-opacity-80 border-0" : "bg-dark bg-opacity-50 border border-white border-opacity-20"}`}
                          style={{
                            width: "28px",
                            height: "28px",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {shouldShowTick ? (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="animate-fade-in"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <div
                              className={`rounded-circle ${isActive ? "bg-white" : "bg-white opacity-10"}`}
                              style={{ width: "8px", height: "8px" }}
                            ></div>
                          )}
                        </div>
                        <span
                          className={`small fw-black text-uppercase ${isActive ? "text-emerald" : isPast || isCompletedLoad ? "text-white opacity-80" : "text-white opacity-50"}`}
                          style={{ fontSize: "9px", letterSpacing: "0.1em" }}
                        >
                          {node.replace("_", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="col-md-6">
                <div
                  className="card h-100 border-0 rounded-4 p-4 glass-card-premium"
                  style={{
                    backdropFilter: "blur(20px)",
                    background: "rgba(255,255,255,0.03)",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    borderLeft: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2bdd66"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    <h6
                      className="fw-black mb-0 text-uppercase text-gradient-emerald opacity-100"
                      style={{ letterSpacing: "0.1em", fontSize: "11px" }}
                    >
                      Specifications
                    </h6>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label
                        className="text-white opacity-75 small fw-bold text-uppercase tracking-widest mb-1 d-block"
                        style={{ fontSize: "9px" }}
                      >
                        Quantity
                      </label>
                      <div className="fw-black fs-4 text-white d-flex align-items-baseline gap-2">
                        {load.quantity}
                        <span className="small opacity-20 fw-medium fs-x-small">
                          skids
                        </span>
                      </div>
                    </div>
                    <div className="col-6">
                      <label
                        className="text-white opacity-75 small fw-bold text-uppercase tracking-widest mb-1 d-block"
                        style={{ fontSize: "9px" }}
                      >
                        Weight
                      </label>
                      <div className="fw-black fs-4 text-white d-flex align-items-baseline gap-2">
                        {load.weight}
                        <span className="small opacity-20 fw-medium fs-x-small">
                          lbs
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto glass-card-premium rounded-4 border-neon-indigo shadow-glow-indigo">
                    <div className="p-3 bg-neon-indigo-opacity">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <label
                          className="text-white opacity-75 x-small fw-black text-uppercase tracking-widest"
                          style={{ letterSpacing: "0.1em" }}
                        >
                          Asset Assignment
                        </label>
                        {user.role !== "Admin" &&
                          load.assignedDriverId &&
                          !showEditAssignment && (
                            <button
                              className="btn btn-sm rounded-pill x-small fw-bold px-3 py-1 transition-all shadow-glow-indigo"
                              style={{
                                background: "#6366f1",
                                color: "#ffffff",
                                border: "none",
                                letterSpacing: "0.5px",
                              }}
                              onClick={() => setShowEditAssignment(true)}
                            >
                              Edit
                            </button>
                          )}
                      </div>

                      {user.role === "Admin" ? (
                        <div className="d-grid gap-2">
                          <div className="mb-2">
                            <label className="text-white opacity-75 x-small fw-black d-block mb-1 text-uppercase">
                              Asset Operator
                            </label>
                            <div className="fw-black text-white fs-6 text-gradient-indigo">
                              {(
                                load.assignedDriverId as unknown as Driver | null
                              )?.name || "UNASSIGNED"}
                            </div>
                          </div>
                          <div className="row g-3">
                            <div className="col-6">
                              <label className="text-white opacity-75 x-small fw-black d-block mb-1 text-uppercase">
                                Truck #
                              </label>
                              <div className="fw-black text-white fs-6 text-gradient-emerald d-flex flex-column">
                                <span>{load.truckNumber || "---"}</span>
                                {load.truckType && (
                                  <span
                                    className="x-small text-white opacity-50 mt-1"
                                    style={{ fontSize: "10px" }}
                                  >
                                    {load.truckType}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="text-white opacity-75 x-small fw-black d-block mb-1 text-uppercase">
                                Trailer #
                              </label>
                              <div className="fw-black text-white fs-6 text-gradient-indigo d-flex flex-column">
                                <span>{load.trailerNumber || "---"}</span>
                                {load.trailerType && (
                                  <span
                                    className="x-small text-white opacity-50 mt-1"
                                    style={{ fontSize: "10px" }}
                                  >
                                    {load.trailerType}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="d-grid gap-2">
                          {load.assignedDriverId && !showEditAssignment ? (
                            <div className="animate-fade-in py-1">
                              <div className="mb-3">
                                <div>
                                  <label className="text-white opacity-75 x-small fw-black d-block mb-1 text-uppercase">
                                    Assigned Operator
                                  </label>
                                  <div className="fw-black text-white fs-5 text-gradient-emerald">
                                    {
                                      (
                                        load.assignedDriverId as unknown as Driver
                                      )?.name
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="row g-3">
                                <div className="col-6">
                                  <label className="text-white opacity-75 x-small fw-black d-block mb-1 text-uppercase">
                                    Truck #
                                  </label>
                                  <div className="fw-black text-white fs-6 text-gradient-emerald d-flex flex-column">
                                    <span>{load.truckNumber || "---"}</span>
                                    {load.truckType && (
                                      <span
                                        className="x-small text-white opacity-50 mt-1"
                                        style={{ fontSize: "10px" }}
                                      >
                                        {load.truckType}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-6">
                                  <label className="text-white opacity-75 x-small fw-black d-block mb-1 text-uppercase">
                                    Trailer #
                                  </label>
                                  <div className="fw-black text-white fs-6 text-gradient-indigo d-flex flex-column">
                                    <span>{load.trailerNumber || "---"}</span>
                                    {load.trailerType && (
                                      <span
                                        className="x-small text-white opacity-50 mt-1"
                                        style={{ fontSize: "10px" }}
                                      >
                                        {load.trailerType}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-4 glass-card-premium border border-white border-opacity-10 shadow-lg mt-3">
                              <div className="mb-3">
                                <label
                                  className="text-white opacity-75 x-small fw-bold d-block mb-1 text-uppercase tracking-widest"
                                  style={{ fontSize: "10px" }}
                                >
                                  Asset Operator
                                </label>
                                <GlassSelect
                                  value={selectedDriverId}
                                  onChange={setSelectedDriverId}
                                  placeholder="Select Operator..."
                                  options={drivers.map((d: Driver) => ({
                                    value: d._id,
                                    label: d.name,
                                  }))}
                                />
                              </div>
                              <div className="row g-2 mb-3">
                                <div className="col-6">
                                  <label
                                    className="text-white opacity-75 x-small fw-bold d-block mb-1 text-uppercase tracking-widest"
                                    style={{ fontSize: "10px" }}
                                  >
                                    Truck Options
                                  </label>
                                  <div className="d-flex flex-column gap-2">
                                    <GlassSelect
                                      value={truckType}
                                      onChange={setTruckType}
                                      placeholder="Select Type..."
                                      options={[
                                        {
                                          value: "Sleeper Cab",
                                          label: "Sleeper Cab",
                                        },
                                        { value: "Day Cab", label: "Day Cab" },
                                      ]}
                                    />
                                    <input
                                      type="text"
                                      className="form-control border border-white border-opacity-20 text-white py-1 px-2 rounded-3 shadow-none fw-bold transition-all"
                                      style={{
                                        fontSize: "11px",
                                        background: "rgba(255,255,255,0.05)",
                                      }}
                                      value={truckNumber}
                                      onChange={(e) =>
                                        setTruckNumber(e.target.value)
                                      }
                                      placeholder="T-000"
                                      title="Vector Number"
                                    />
                                  </div>
                                </div>
                                <div className="col-6">
                                  <label
                                    className="text-white opacity-75 x-small fw-bold d-block mb-1 text-uppercase tracking-widest"
                                    style={{ fontSize: "10px" }}
                                  >
                                    Relay Options
                                  </label>
                                  <div className="d-flex flex-column gap-2">
                                    <GlassSelect
                                      value={trailerType}
                                      onChange={setTrailerType}
                                      placeholder="Select Type..."
                                      options={[
                                        { value: "Dry Van", label: "Dry Van" },
                                        { value: "Reefer", label: "Reefer" },
                                        {
                                          value: "Tri Axle",
                                          label: "Tri Axle",
                                        },
                                        { value: "Flatbed", label: "Flatbed" },
                                      ]}
                                    />
                                    <input
                                      type="text"
                                      className="form-control border border-white border-opacity-20 text-white py-1 px-2 rounded-3 shadow-none fw-bold transition-all"
                                      style={{
                                        fontSize: "11px",
                                        background: "rgba(255,255,255,0.05)",
                                      }}
                                      value={trailerNumber}
                                      onChange={(e) =>
                                        setTrailerNumber(e.target.value)
                                      }
                                      placeholder="R-000"
                                      title="Relay Number"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                {load.assignedDriverId && (
                                  <button
                                    className="btn btn-outline-white-glass btn-sm rounded-pill fw-bold px-3 py-1 flex-grow-1"
                                    onClick={() => setShowEditAssignment(false)}
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button
                                  className="btn btn-emerald btn-sm flex-grow-1 rounded-pill fw-black py-1 px-3 border-0 text-uppercase shadow-glow-emerald transition-all text-dark"
                                  style={{
                                    letterSpacing: "1px",
                                    fontSize: "11px",
                                  }}
                                  onClick={handleAssign}
                                >
                                  Assign Load
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXECUTION GRID */}
              <div className="col-md-6">
                <div
                  className="card h-100 border-0 rounded-4 p-4 glass-card-premium"
                  style={{
                    backdropFilter: "blur(20px)",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <h6
                      className="fw-black mb-0 text-uppercase text-gradient-indigo opacity-100"
                      style={{ letterSpacing: "0.1em", fontSize: "11px" }}
                    >
                      Execution Progress
                    </h6>
                  </div>

                  <div className="d-flex flex-column gap-4 mb-4">
                    {/* PICKUPS SECTION */}
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="bg-emerald bg-opacity-10 rounded-circle p-1">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2bdd66"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <span className="text-white opacity-75 x-small fw-black text-uppercase tracking-widest">
                          Origin Sequence
                        </span>
                      </div>
                      <div className="d-grid gap-2">
                        {load.pickups.map((p: IStop, i: number) => (
                          <div
                            key={`p-${i}`}
                            className="p-3 border border-white border-opacity-10 rounded-4 d-flex justify-content-between align-items-center transition-all hover-glass glass-card-premium"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                          >
                            <div className="d-flex align-items-center gap-3 overflow-hidden">
                              <div
                                className={`rounded d-flex align-items-center justify-content-center flex-shrink-0 ${p.status === "PICKED_UP" ? "bg-emerald text-dark shadow-glow-emerald" : "bg-emerald bg-opacity-10 border border-emerald border-opacity-30 shadow-subtle-emerald"}`}
                                style={{
                                  color:
                                    p.status === "PICKED_UP"
                                      ? "#111"
                                      : "#2bdd66",
                                  width: "28px",
                                  height: "28px",
                                  fontSize: "10px",
                                  fontWeight: "900",
                                }}
                              >
                                {p.status === "PICKED_UP" ? (
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
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                ) : (
                                  `0${i + 1}`
                                )}
                              </div>
                              <div className="text-truncate">
                                <div
                                  className="fw-black text-white fs-6 text-truncate"
                                  style={{ fontSize: "13px" }}
                                  title={p.address}
                                >
                                  {p.address}
                                </div>
                                <div
                                  className="x-small text-white opacity-40 text-uppercase fw-bold"
                                  style={{ fontSize: "9px" }}
                                >
                                  {p.city}, {p.state}
                                </div>
                              </div>
                            </div>
                            {user.role === "Driver" &&
                              p.status === "PENDING" &&
                              load.status !== "COMPLETED" && (
                                <button
                                  className="btn btn-sm btn-emerald fw-black x-small px-4 py-2 rounded-pill text-uppercase shadow-sm"
                                  style={{ letterSpacing: "1px" }}
                                  onClick={() =>
                                    handleUpdateStopStatus(
                                      "pickups",
                                      i,
                                      "PICKED_UP",
                                    )
                                  }
                                >
                                  PICKED UP
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DELIVERIES SECTION */}
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="bg-indigo bg-opacity-10 rounded-circle p-1">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <span className="text-white opacity-75 x-small fw-black text-uppercase tracking-widest">
                          Delivery Sequence
                        </span>
                      </div>
                      <div className="d-grid gap-2">
                        {load.deliveries.map((d: IStop, i: number) => (
                          <div
                            key={`d-${i}`}
                            className="p-3 border border-white border-opacity-10 rounded-4 d-flex justify-content-between align-items-center transition-all hover-glass glass-card-premium"
                            style={{ background: "rgba(255,255,255,0.05)" }}
                          >
                            <div className="d-flex align-items-center gap-3 overflow-hidden">
                              <div
                                className={`rounded d-flex align-items-center justify-content-center flex-shrink-0 ${d.status === "DELIVERED" ? "bg-indigo text-white shadow-glow-indigo" : "bg-indigo bg-opacity-10 border border-indigo border-opacity-30 shadow-subtle-indigo"}`}
                                style={{
                                  color:
                                    d.status === "DELIVERED"
                                      ? "#fff"
                                      : "#6366f1",
                                  width: "28px",
                                  height: "28px",
                                  fontSize: "10px",
                                  fontWeight: "900",
                                }}
                              >
                                {d.status === "DELIVERED" ? (
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
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                ) : (
                                  `0${i + 1}`
                                )}
                              </div>
                              <div className="text-truncate">
                                <div
                                  className="fw-black text-white fs-6 text-truncate"
                                  style={{ fontSize: "13px" }}
                                  title={d.address}
                                >
                                  {d.address}
                                </div>
                                <div
                                  className="x-small text-white opacity-40 text-uppercase fw-bold"
                                  style={{ fontSize: "9px" }}
                                >
                                  {d.city}, {d.state}
                                </div>
                              </div>
                            </div>
                            {user.role === "Driver" &&
                              d.status === "PENDING" &&
                              allPickupsDone &&
                              load.status !== "COMPLETED" && (
                                <button
                                  className="btn btn-sm btn-indigo fw-black x-small px-4 py-2 rounded-pill text-uppercase shadow-sm"
                                  style={{ letterSpacing: "1px" }}
                                  onClick={() =>
                                    handleUpdateStopStatus(
                                      "deliveries",
                                      i,
                                      "DELIVERED",
                                    )
                                  }
                                >
                                  DROP OFF
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* VERIFICATION */}
                  <div className="mt-auto pt-4 border-top border-white border-opacity-10">
                    <label
                      className="text-white opacity-75 x-small fw-black text-uppercase tracking-widest mb-3 d-block"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      Verification & POD
                    </label>
                    <div className="d-grid gap-2">
                      {load.podUrl ? (
                        <div
                          className="p-3 rounded-4 border border-emerald border-opacity-20 text-center shadow-sm glass-wash"
                          style={{ background: "rgba(43, 221, 102, 0.05)" }}
                        >
                          <div className="d-flex align-items-center justify-content-center gap-2 mb-3 text-emerald fw-bold small">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            Document Verified
                          </div>
                          <div className="d-grid gap-2">
                            <a
                              href={load.podUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm glass-action-btn text-white rounded-pill fw-black x-small py-2 px-4 shadow-sm"
                              style={{ letterSpacing: "1px" }}
                            >
                              VIEW POD DOCUMENT
                            </a>
                            {(user.role === "Admin" ||
                              user.role === "Dispatcher") &&
                              load.status === "DELIVERED" && (
                                <button
                                  className="btn btn-emerald w-100 rounded-pill fw-black py-3 mt-3 shadow-glow-emerald text-uppercase border-0 shadow-lg"
                                  style={{ letterSpacing: "1px" }}
                                  onClick={handleCompleteLoad}
                                >
                                  FINALIZE LOAD
                                </button>
                              )}
                          </div>
                        </div>
                      ) : load.status === "IN_TRANSIT" &&
                        allDeliveriesDone &&
                        user.role === "Driver" ? (
                        <div className="p-1">
                          <button
                            className="btn btn-emerald w-100 rounded-pill fw-black py-3 shadow-glow-emerald text-uppercase border-0 shadow-lg"
                            style={{ letterSpacing: "1px" }}
                            onClick={() => setShowPODUpload(true)}
                          >
                            UPLOAD POD DOCUMENT
                          </button>
                          {showPODUpload && (
                            <ProofOfDeliveryUpload
                              loadId={load._id.toString()}
                              onUploadSuccess={() => {
                                onUpdate();
                                setShowPODUpload(false);
                              }}
                              onClose={() => setShowPODUpload(false)}
                            />
                          )}
                          <p className="x-small text-center text-white opacity-30 mt-3">
                            Upload required for{" "}
                            <span className="text-emerald fw-bold">
                              DELIVERED
                            </span>{" "}
                            status
                          </p>
                        </div>
                      ) : (
                        <div className="text-center p-3 rounded-4 border border-dashed border-white border-opacity-10 text-white opacity-60 x-small fw-black">
                          {load.status === "COMPLETED"
                            ? "DOCUMENTATION ARCHIVED"
                            : !allDeliveriesDone
                              ? "AWAITING DELIVERIES"
                              : "AWAITING DOCUMENTATION"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
      <style jsx>{`
        .fw-black {
          font-weight: 900;
        }
        .x-small {
          font-size: 0.65rem;
        }
        .fs-x-small {
          font-size: 0.75rem;
        }
        .shadow-glow-emerald {
          box-shadow: 0 0 20px rgba(43, 221, 102, 0.2);
        }
        .shadow-glow-indigo {
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }
        .btn-emerald {
          background: linear-gradient(135deg, #00ffa3 0%, #2bdd66 100%);
          color: #004d22;
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-emerald:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(43, 221, 102, 0.4);
          filter: brightness(1.1);
        }
        .btn-indigo {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #ffffff;
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-indigo:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
          filter: brightness(1.1);
        }
        .btn-outline-white-glass {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-outline-white-glass:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }
        .glass-action-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
        }
        .hover-glass:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .h-1 {
          height: 1px;
        }

        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(3px);
            opacity: 0.5;
          }
        }

        .duration-500 {
          transition-duration: 500ms;
        }
        .duration-700 {
          transition-duration: 700ms;
        }
      `}</style>
      
      {/* Confirmation Modal */}
    <ConfirmationModal
      isOpen={confirmModal.isOpen}
      title={confirmModal.title}
      message={confirmModal.message}
      type={confirmModal.type}
      onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      onConfirm={confirmModal.onConfirm}
    />
    </React.Fragment>
  );
}
