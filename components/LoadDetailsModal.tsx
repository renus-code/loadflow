"use client";

import React, { useState, useRef, useEffect } from "react";
import { ILoad } from "@/models/Load";
import ProofOfDeliveryUpload from "./ProofOfDeliveryUpload";

interface Driver {
  _id: string;
  name: string;
}

interface Truck {
  _id: string;
  truckNo: string;
  make: string;
  model: string;
  year: number;
  truckType: 'Sleeper Cab' | 'Day Cab';
}

interface Trailer {
  _id: string;
  trailerNo: string;
  make: string;
  model: string;
  year: number;
  trailerType: 'Dry Van' | 'Reefer' | 'Tri Axle' | 'Flatbed';
}

interface LoadDetailsModalProps {
  load: ILoad;
  drivers: Driver[];
  user: { role: string; name?: string };
  onClose: () => void;
  onUpdate: () => void;
}

const GlassSelect = ({
  value,
  onChange,
  options,
  placeholder,
  variant = "indigo",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  variant?: "indigo" | "emerald";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const accentColor = variant === "indigo" ? "#6366f1" : "#10b981";
  const accentRgb = variant === "indigo" ? "99, 102, 241" : "16, 185, 129";

  return (
    <div
      className="position-relative"
      ref={containerRef}
      style={{ zIndex: isOpen ? 1050 : 1 }}
    >
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="d-flex align-items-center justify-content-between px-3 cursor-pointer"
        style={{
          minHeight: "42px",
          borderRadius: "14px",
          border: isOpen
            ? `1.5px solid rgba(${accentRgb}, 0.6)`
            : "1.5px solid rgba(255, 255, 255, 0.1)",
          background: isOpen
            ? `rgba(${accentRgb}, 0.08)`
            : "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: isOpen
            ? `0 0 0 3px rgba(${accentRgb}, 0.12), 0 4px 20px rgba(${accentRgb}, 0.15)`
            : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: selectedOption
              ? isOpen
                ? accentColor
                : "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.3)",
            transition: "color 0.2s ease",
          }}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Chevron Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: isOpen ? `rgba(${accentRgb}, 0.15)` : "rgba(255,255,255,0.05)",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            flexShrink: 0,
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isOpen ? accentColor : "rgba(255,255,255,0.4)"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            borderRadius: "16px",
            border: `1px solid rgba(${accentRgb}, 0.2)`,
            background: "rgba(8, 10, 20, 0.92)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            boxShadow: `0 20px 60px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(${accentRgb}, 0.15)`,
            padding: "8px",
            maxHeight: "240px",
            overflowY: "auto",
            zIndex: 1051,
            animation: "glassDropdownOpen 0.2s cubic-bezier(0.4, 0, 0.2, 1) both",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "16px",
              right: "16px",
              height: "1px",
              background: `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.6), transparent)`,
              borderRadius: "1px",
            }}
          />

          {options.length > 0 ? (
            options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    marginBottom: "2px",
                    background: isSelected
                      ? `rgba(${accentRgb}, 0.14)`
                      : "transparent",
                    border: isSelected
                      ? `1px solid rgba(${accentRgb}, 0.25)`
                      : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = `rgba(${accentRgb}, 0.08)`;
                      e.currentTarget.style.border = `1px solid rgba(${accentRgb}, 0.15)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.border = "1px solid transparent";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Dot indicator */}
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: isSelected ? accentColor : "rgba(255,255,255,0.15)",
                        boxShadow: isSelected ? `0 0 6px ${accentColor}` : "none",
                        flexShrink: 0,
                        transition: "all 0.15s ease",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.09em",
                        color: isSelected ? accentColor : "rgba(255,255,255,0.65)",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {opt.label}
                    </span>
                  </div>

                  {/* Checkmark */}
                  {isSelected && (
                    <svg
                      width="11"
                      height="11"
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
            })
          ) : (
            <div
              style={{
                padding: "20px 12px",
                textAlign: "center",
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LoadDetailsModal: React.FC<LoadDetailsModalProps> = ({
  load,
  drivers,
  user,
  onClose,
  onUpdate,
}) => {
  const [showEditAssignment, setShowEditAssignment] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    (load.assignedDriverId as unknown as Driver)?._id ||
      (typeof load.assignedDriverId === "string" ? load.assignedDriverId : ""),
  );
  const [truckNumber, setTruckNumber] = useState(load.truckNumber || "");
  const [trailerNumber, setTrailerNumber] = useState(load.trailerNumber || "");
  const [truckType, setTruckType] = useState(load.truckType || "");
  const [trailerType, setTrailerType] = useState(load.trailerType || "");
  // UI-only state to show Year/Make/Model specs from the DB
  const [truckSpecs, setTruckSpecs] = useState("");
  const [trailerSpecs, setTrailerSpecs] = useState("");

  const [showPodUpload, setShowPodUpload] = useState(false);
  const [pendingDeliveryIndex, setPendingDeliveryIndex] = useState<
    number | null
  >(null);
  const [showPodPreview, setShowPodPreview] = useState(false);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [trailers, setTrailers] = useState<Trailer[]>([]);

  React.useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const [trucksRes, trailersRes] = await Promise.all([
          fetch("/api/trucks"),
          fetch("/api/trailers"),
        ]);
        if (trucksRes.ok) {
          const tData = await trucksRes.json();
          setTrucks(tData);
          // Pre-populate specs if already assigned
          const currentTruck = tData.find((t: any) => t.truckNo === load.truckNumber);
          if (currentTruck) setTruckSpecs(`${currentTruck.year} ${currentTruck.make} ${currentTruck.model}`);
        }
        if (trailersRes.ok) {
          const trData = await trailersRes.json();
          setTrailers(trData);
          // Pre-populate specs if already assigned
          const currentTrailer = trData.find((tr: any) => tr.trailerNo === load.trailerNumber);
          if (currentTrailer) setTrailerSpecs(`${currentTrailer.year} ${currentTrailer.make} ${currentTrailer.model}`);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
      }
    };
    fetchVehicles();
  }, [load.truckNumber, load.trailerNumber]);

  const statusWorkflow = [
    "PENDING",
    "ASSIGNED",
    "IN_TRANSIT",
    "DELIVERED",
    "COMPLETED",
  ];
  const currentStatusIndex = statusWorkflow.indexOf(load.status);
  const isAllStopsDone =
    load.pickups.every((p) => p.status === "PICKED_UP") &&
    load.deliveries.every((d) => d.status === "DELIVERED");

  const handleUpdateStopStatus = async (
    e: React.MouseEvent,
    type: "pickups" | "deliveries",
    index: number,
    newStatus: string,
  ) => {
    e.stopPropagation();

    if (type === "deliveries" && newStatus === "DELIVERED") {
      setPendingDeliveryIndex(index);
      setShowPodUpload(true);
      return;
    }

    await submitStopStatusUpdate(type, index, newStatus);
  };

  const submitStopStatusUpdate = async (
    type: "pickups" | "deliveries",
    index: number,
    newStatus: string,
  ) => {
    try {
      const response = await fetch(`/api/loads/${load._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stopType: type,
          stopIndex: index,
          stopStatus: newStatus,
        }),
      });
      if (response.ok) onUpdate();
    } catch (error) {
      console.error("Failed to update stop status", error);
    }
  };

  const handlePodUploadSuccess = () => {
    if (pendingDeliveryIndex !== null) {
      submitStopStatusUpdate("deliveries", pendingDeliveryIndex, "DELIVERED");
      setShowPodUpload(false);
      setPendingDeliveryIndex(null);
    }
  };

  const handleAssign = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/loads/${load._id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedDriverId: selectedDriverId,
          truckNumber,
          trailerNumber,
          truckType,
          trailerType,
        }),
      });
      if (response.ok) {
        onUpdate();
        setShowEditAssignment(false);
      }
    } catch (error) {
      console.error("Assignment failed", error);
    }
  };

  const handleUnassign = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/loads/${load._id}/unassign`, {
        method: "PATCH",
      });
      if (response.ok) {
        onUpdate();
        setShowEditAssignment(false);
      }
    } catch (error) {
      console.error("Unassignment failed", error);
    }
  };

  const handleSubmitMission = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/loads/${load._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DELIVERED" }),
      });
      if (response.ok) onUpdate();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleApproveLoad = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/loads/${load._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (response.ok) onUpdate();
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      onClick={onClose}
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(15px)",
        zIndex: 1060,
      }}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        style={{ maxWidth: "1100px" }}
      >
        <div
          className="modal-content border-0 rounded-5 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "radial-gradient(circle at top right, #0f1629, #05070a)",
            boxShadow:
              "0 0 50px rgba(0,0,0,0.5), inset 0 0 100px rgba(99, 102, 241, 0.08)",
          }}
        >
          {/* HEADER */}
          <div className="modal-header border-0 p-4 pt-4 pb-2 d-flex justify-content-between align-items-start position-relative overflow-hidden">
            <div
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                background:
                  "linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, transparent 100%)",
                zIndex: 0,
              }}
            ></div>
            <div className="position-relative" style={{ zIndex: 1 }}>
              <h2
                className="modal-title fw-black text-white fs-2 mb-0 text-uppercase tracking-tighter text-gradient-white"
                style={{ letterSpacing: "-1px" }}
              >
                {load.loadNumber}
              </h2>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white opacity-50 transition-all hover-rotate-90"
              onClick={onClose}
              style={{ zIndex: 1 }}
            ></button>
          </div>

          <div className="modal-body p-4 pt-0 custom-scrollbar">
            <div className="row g-5">
              {/* STATUS TRACKER */}
              <div
                className="col-12 px-4 overflow-visible"
                style={{ marginTop: "5rem", marginBottom: "0.5rem" }}
              >
                <div
                  className="d-flex justify-content-between align-items-center px-4 mb-2 position-relative"
                  style={{ minHeight: "60px" }}
                >
                  {/* Progress Line Background */}
                  <div
                    className="position-absolute w-100"
                    style={{
                      top: "16px",
                      left: 0,
                      height: "1px",
                      background: "rgba(255,255,255,0.05)",
                      zIndex: 0,
                    }}
                  ></div>
                  {/* Progress Line Active */}
                  <div
                    className="position-absolute transition-all duration-1000 ease-out"
                    style={{
                      top: "16px",
                      left: 0,
                      height: "2px",
                      width: `${(currentStatusIndex / (statusWorkflow.length - 1)) * 100}%`,
                      background: "linear-gradient(90deg, #2bdd66, #00ffa3)",
                      boxShadow: "0 0 20px rgba(43, 221, 102, 0.4)",
                      zIndex: 0,
                    }}
                  ></div>

                  {statusWorkflow.map((node, i) => {
                    const isActive = load.status === node;
                    const isPast = currentStatusIndex > i;

                    return (
                      <div
                        key={node}
                        className="d-flex flex-column align-items-center position-relative"
                        style={{ zIndex: 1, width: "100px" }}
                      >
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center transition-all duration-500 
                          ${isActive ? "shadow-glow-emerald scale-125" : ""} 
                          ${isPast ? "bg-emerald" : isActive ? "bg-emerald" : "bg-dark border border-white border-opacity-10"}`}
                          style={{
                            width: "32px",
                            height: "32px",
                            backdropFilter: "blur(10px)",
                            boxShadow: isActive
                              ? "0 0 30px rgba(43, 221, 102, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.4)"
                              : "none",
                          }}
                        >
                          {isPast ? (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <div
                              className={`rounded-circle ${isActive ? "bg-white shadow-lg pulse-active" : "bg-white opacity-20"}`}
                              style={{ width: "6px", height: "6px" }}
                            ></div>
                          )}
                        </div>
                        <span
                          className={`fw-black text-uppercase text-center w-100 mt-4 transition-all duration-300
                          ${isActive ? "text-white" : isPast ? "text-white opacity-70" : "text-white opacity-40"}`}
                          style={{
                            fontSize: "9px",
                            letterSpacing: "1px",
                            lineHeight: "1.2",
                            textShadow: isActive
                              ? "0 0 10px rgba(255, 255, 255, 0.5)"
                              : "none",
                            fontWeight: isActive ? "900" : "700",
                          }}
                        >
                          {node.replace("_", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LEFT COLUMN: SPECS & ASSETS */}
              <div className="col-lg-6">
                <div className="row g-4">
                  <div className="col-12">
                    <div className="ether-card p-4 rounded-5 mb-4">
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <div className="p-2 rounded-3 bg-emerald bg-opacity-10 border-ether">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2bdd66"
                            strokeWidth="2.5"
                          >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                          </svg>
                        </div>
                        <h6 className="fw-black mb-0 text-uppercase tracking-widest small text-white">
                          Cargo Profile
                        </h6>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest mb-1 d-block">
                            Quantity
                          </label>
                          <div className="fw-black fs-2 text-white">
                            {load.quantity}{" "}
                            <span className="opacity-40 fs-6 fw-medium">
                              skids
                            </span>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest mb-1 d-block">
                            Displacement
                          </label>
                          <div className="fw-black fs-2 text-white">
                            {load.weight.toLocaleString()}{" "}
                            <span className="opacity-40 fs-6 fw-medium">
                              lbs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="ether-card p-4 rounded-5">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 rounded-3 bg-indigo bg-opacity-20 border-ether">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6366f1"
                              strokeWidth="2.5"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="8.5" cy="7" r="4" />
                              <polyline points="17 11 19 13 23 9" />
                            </svg>
                          </div>
                          <h6 className="fw-black mb-0 text-uppercase tracking-widest small text-white">
                            Assets
                          </h6>
                        </div>
                        {(user.role === "Admin" ||
                          user.role === "Dispatcher") &&
                          load.assignedDriverId &&
                          !showEditAssignment && (
                            <button
                              type="button"
                              className={`btn ${
                                load.status === "DELIVERED" ||
                                load.status === "COMPLETED"
                                  ? "btn-secondary opacity-50 cursor-not-allowed"
                                  : "btn-indigo"
                              } btn-sm px-4 rounded-pill fw-bold`}
                              style={{
                                fontSize: "10px",
                                border:
                                  load.status === "DELIVERED" ||
                                  load.status === "COMPLETED"
                                    ? "1px solid rgba(255, 255, 255, 0.1)"
                                    : "none",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEditAssignment(true);
                              }}
                              disabled={
                                load.status === "DELIVERED" ||
                                load.status === "COMPLETED"
                              }
                            >
                              Modify
                            </button>
                          )}
                      </div>

                      {load.assignedDriverId && !showEditAssignment ? (
                        <div className="animate-fade-in">
                          <div className="mb-4">
                            <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest mb-1 d-block">
                              Driver
                            </label>
                            <div className="fw-black fs-4 text-white">
                              {(load.assignedDriverId as unknown as Driver)
                                ?.name || "Active Driver"}
                            </div>
                          </div>
                          <div className="row g-3">
                            <div className="col-6">
                              <div
                                className="p-3 rounded-4 border border-white border-opacity-5"
                                style={{
                                  background: "rgba(255, 255, 255, 0.03)",
                                }}
                              >
                                <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest mb-1 d-block">
                                  Vector Unit
                                </label>
                                <div className="fw-black text-white">
                                  {load.truckNumber || "—"}
                                </div>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                  {load.truckType && (
                                    <div className="px-2 py-0.5 rounded bg-indigo bg-opacity-10 border border-indigo border-opacity-20 text-indigo fw-black text-uppercase x-small">
                                      {load.truckType}
                                    </div>
                                  )}
                                  <div className="x-small text-white opacity-40 fw-bold text-uppercase">
                                    {truckSpecs || "TECHNICAL SPECS PENDING"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div
                                className="p-3 rounded-4 border border-white border-opacity-5"
                                style={{
                                  background: "rgba(255, 255, 255, 0.03)",
                                }}
                              >
                                <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest mb-1 d-block">
                                  Relay Unit
                                </label>
                                <div className="fw-black text-white">
                                  {load.trailerNumber || "—"}
                                </div>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                  {load.trailerType && (
                                    <div className="px-2 py-0.5 rounded bg-emerald bg-opacity-10 border border-emerald border-opacity-20 text-emerald fw-black text-uppercase x-small">
                                      {load.trailerType}
                                    </div>
                                  )}
                                  <div className="x-small text-white opacity-40 fw-bold text-uppercase">
                                    {trailerSpecs || "TECHNICAL SPECS PENDING"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="p-4 rounded-4 border border-white border-opacity-10"
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            boxShadow: "inset 0 0 40px rgba(99, 102, 241, 0.03)",
                            backdropFilter: "blur(5px)",
                          }}
                        >
                          <div className="mb-4">
                            <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest mb-2 d-block">
                              Driver
                            </label>
                            <GlassSelect
                              value={selectedDriverId}
                              onChange={setSelectedDriverId}
                              placeholder="Select Operator..."
                              options={drivers.map((d) => ({
                                value: d._id,
                                label: d.name,
                              }))}
                            />
                          </div>
                          <div className="row g-4 mb-4">
                            {/* TRUCK SECTION */}
                            <div className="col-12">
                              <div className="row g-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-70 text-indigo">
                                      <path d="M10 17h4V5H2v12h3" /><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
                                    </svg>
                                    <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest d-block m-0">
                                      Vector Unit (Truck)
                                    </label>
                                  </div>
                                  <GlassSelect
                                    value={truckNumber}
                                    onChange={(val) => {
                                      setTruckNumber(val);
                                      const selected = trucks.find(t => t.truckNo === val);
                                      if (selected) {
                                        setTruckSpecs(`${selected.year} ${selected.make} ${selected.model}`);
                                        setTruckType(selected.truckType);
                                      }
                                    }}
                                    placeholder="Select Truck ID..."
                                    options={trucks
                                      .filter(t => !truckType || t.truckType === truckType)
                                      .map(t => ({ value: t.truckNo, label: t.truckNo }))}
                                  />
                                </div>
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-70 text-indigo">
                                      <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                                    </svg>
                                    <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest d-block m-0">
                                      Cab Configuration
                                    </label>
                                  </div>
                                  <GlassSelect
                                    value={truckType}
                                    onChange={(val) => {
                                      setTruckType(val);
                                      // If current selected truck doesn't match new type, clear it
                                      const currentTruck = trucks.find(t => t.truckNo === truckNumber);
                                      if (currentTruck && val && currentTruck.truckType !== val) {
                                        setTruckNumber("");
                                        setTruckSpecs("");
                                      }
                                    }}
                                    placeholder="Select Cab Type..."
                                    options={[
                                      { value: 'Sleeper Cab', label: 'Sleeper Cab' },
                                      { value: 'Day Cab', label: 'Day Cab' }
                                    ]}
                                    variant="indigo"
                                  />
                                </div>
                              </div>
                              {truckSpecs && (
                                <div className="mt-2 x-small text-white opacity-40 fw-bold text-uppercase px-2 italic">
                                  Specs: {truckSpecs}
                                </div>
                              )}
                            </div>

                            {/* TRAILER SECTION */}
                            <div className="col-12">
                              <div className="row g-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-70 text-emerald">
                                      <path d="M2 17h20v-4H2v4z" /><path d="M2 9h20v-4H2v4z" /><path d="M12 9v8" />
                                    </svg>
                                    <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest d-block m-0">
                                      Relay Unit (Trailer)
                                    </label>
                                  </div>
                                  <GlassSelect
                                    value={trailerNumber}
                                    onChange={(val) => {
                                      setTrailerNumber(val);
                                      const selected = trailers.find(t => t.trailerNo === val);
                                      if (selected) {
                                        setTrailerSpecs(`${selected.year} ${selected.make} ${selected.model}`);
                                        setTrailerType(selected.trailerType);
                                      }
                                    }}
                                    placeholder="Select Trailer ID..."
                                    options={trailers
                                      .filter(t => !trailerType || t.trailerType === trailerType)
                                      .map(t => ({ value: t.trailerNo, label: t.trailerNo }))}
                                  />
                                </div>
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-70 text-emerald">
                                      <rect x="2" y="2" width="20" height="20" rx="2" strokeWidth="2.5"/>
                                      <path d="M7 2v20M17 2v20M2 7h20M2 17h20"/>
                                    </svg>
                                    <label className="text-white opacity-70 fw-bold text-uppercase x-small tracking-widest d-block m-0">
                                      Trailer Category
                                    </label>
                                  </div>
                                  <GlassSelect
                                    value={trailerType}
                                    onChange={(val) => {
                                      setTrailerType(val);
                                      // If current selected trailer doesn't match new type, clear it
                                      const currentTrailer = trailers.find(t => t.trailerNo === trailerNumber);
                                      if (currentTrailer && val && currentTrailer.trailerType !== val) {
                                        setTrailerNumber("");
                                        setTrailerSpecs("");
                                      }
                                    }}
                                    placeholder="Select Type..."
                                    options={[
                                      { value: 'Dry Van', label: 'Dry Van' },
                                      { value: 'Reefer', label: 'Reefer' },
                                      { value: 'Tri Axle', label: 'Tri Axle' },
                                      { value: 'Flatbed', label: 'Flatbed' }
                                    ]}
                                    variant="emerald"
                                  />
                                </div>
                              </div>
                              {trailerSpecs && (
                                <div className="mt-2 x-small text-white opacity-40 fw-bold text-uppercase px-2 italic">
                                  Specs: {trailerSpecs}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="d-flex gap-2 pt-2">
                            {load.assignedDriverId && (
                              <button
                                className="btn btn-outline-light btn-sm flex-grow-1 rounded-pill fw-bold"
                                onClick={() => setShowEditAssignment(false)}
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              className="btn btn-emerald btn-sm flex-grow-1 rounded-pill fw-black"
                              onClick={handleAssign}
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TIMELINE */}
              <div className="col-lg-6">
                <div className="ether-card p-4 rounded-5 h-100">
                  <div className="d-flex align-items-center gap-3 mb-5">
                    <div
                      className="p-2 rounded-3 border-ether"
                      style={{ background: "rgba(168, 85, 247, 0.15)" }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="2.5"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <h6 className="fw-black mb-0 text-uppercase tracking-widest small text-white">
                      Logistics Timeline
                    </h6>
                  </div>

                  <div className="timeline-container ps-4 border-start border-white border-opacity-10 position-relative">
                    <div className="mb-5">
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <div
                          className="rounded bg-emerald shadow-glow-emerald"
                          style={{ width: "8px", height: "8px" }}
                        ></div>
                        <span
                          className="fw-black x-small text-uppercase tracking-wider"
                          style={{
                            color: "#2bdd66",
                            textShadow: "0 0 10px rgba(44, 221, 102, 0.3)",
                          }}
                        >
                          Pickup Locations{" "}
                        </span>
                      </div>
                      {load.pickups.map((p, i) => (
                        <div key={`p-${i}`} className="mb-4 position-relative">
                          <div
                            className="position-absolute translate-middle-x"
                            style={{ left: "-1.75rem", top: "0.5rem" }}
                          >
                            <div
                              className="rounded-circle bg-emerald"
                              style={{
                                width: "12px",
                                height: "12px",
                                border: "3px solid #060e20",
                              }}
                            ></div>
                          </div>
                          <div
                            className="p-3 rounded-4 border border-white border-opacity-5 shadow-sm transition-all hover-glass"
                            style={{ background: "rgba(255, 255, 255, 0.03)" }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div
                                className="px-2 py-1 rounded-pill fw-black text-white"
                                style={{
                                  background: "rgba(255, 255, 255, 0.1)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  fontSize: "9px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                PICKUP 0{i + 1}
                              </div>
                              <span className="x-small text-white opacity-80 fw-bold">
                                {new Date(p.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="fw-black text-white small mb-1">
                              {p.address}
                            </div>
                            <div className="x-small text-white opacity-80 fw-bold text-uppercase">
                              {p.city}, {p.state}
                            </div>
                            {p.status !== "PENDING" ? (
                              <div className="mt-3 py-2 px-3 rounded-pill bg-emerald bg-opacity-20 border border-emerald border-opacity-40 d-flex align-items-center justify-content-center gap-2 shadow-glow-emerald">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#2bdd66"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span
                                  className="fw-black text-white x-small text-uppercase tracking-wider"
                                  style={{
                                    textShadow:
                                      "0 0 10px rgba(45, 221, 102, 0.5)",
                                  }}
                                >
                                  Picked
                                </span>
                              </div>
                            ) : (
                              user.role === "Driver" && (
                                <button
                                  type="button"
                                  className="btn btn-emerald btn-sm w-100 mt-3 rounded-pill fw-black x-small shadow-glow-emerald"
                                  onClick={(e) =>
                                    handleUpdateStopStatus(
                                      e,
                                      "pickups",
                                      i,
                                      "PICKED_UP",
                                    )
                                  }
                                >
                                  PICKED UP
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="d-flex align-items-center gap-2 mb-4">
                        <div
                          className="rounded bg-indigo shadow-glow-indigo"
                          style={{ width: "8px", height: "8px" }}
                        ></div>
                        <span
                          className="fw-black x-small text-uppercase tracking-wider"
                          style={{
                            color: "#6366f1",
                            textShadow: "0 0 10px rgba(99, 102, 241, 0.3)",
                          }}
                        >
                          Delivery Locations{" "}
                        </span>
                      </div>
                      {load.deliveries.map((p, i) => (
                        <div key={`d-${i}`} className="mb-4 position-relative">
                          <div
                            className="position-absolute translate-middle-x"
                            style={{ left: "-1.75rem", top: "0.5rem" }}
                          >
                            <div
                              className="rounded-circle bg-indigo"
                              style={{
                                width: "12px",
                                height: "12px",
                                border: "3px solid #060e20",
                              }}
                            ></div>
                          </div>
                          <div
                            className="p-3 rounded-4 border border-white border-opacity-5 shadow-sm transition-all hover-glass"
                            style={{ background: "rgba(255, 255, 255, 0.03)" }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div
                                className="px-2 py-1 rounded-pill fw-black text-white"
                                style={{
                                  background: "rgba(255, 255, 255, 0.1)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  fontSize: "9px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                DELIVERY 0{i + 1}
                              </div>
                              <span className="x-small text-white opacity-80 fw-bold">
                                {new Date(p.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="fw-black text-white small mb-1">
                              {p.address}
                            </div>
                            <div className="x-small text-white opacity-80 fw-bold text-uppercase">
                              {p.city}, {p.state}
                            </div>
                            {p.status !== "PENDING" ? (
                              <div className="mt-3 py-2 px-3 rounded-pill bg-indigo bg-opacity-20 border border-indigo border-opacity-40 d-flex align-items-center justify-content-center gap-2 shadow-glow-indigo">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#6366f1"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span
                                  className="fw-black text-white x-small text-uppercase tracking-wider"
                                  style={{
                                    textShadow:
                                      "0 0 10px rgba(99, 102, 241, 0.5)",
                                  }}
                                >
                                  Delivered
                                </span>
                              </div>
                            ) : (
                              user.role === "Driver" && (
                                <button
                                  type="button"
                                  className="btn btn-indigo btn-sm w-100 mt-3 rounded-pill fw-black x-small shadow-glow-indigo"
                                  onClick={(e) =>
                                    handleUpdateStopStatus(
                                      e,
                                      "deliveries",
                                      i,
                                      "DELIVERED",
                                    )
                                  }
                                >
                                  DELIVERED
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER - CONSOLIDATED & ROLE-RESTRICTED */}
              {(user.role !== "Driver" ||
                (load.status === "IN_TRANSIT" && isAllStopsDone)) && (
                <div className="col-12 mt-4 pt-4 border-top border-white border-opacity-5 d-flex justify-content-between align-items-center animate-fade-in">
                  {user.role !== "Driver" && (
                    <div className="d-flex flex-column">
                      <span className="x-small fw-black text-white opacity-40 text-uppercase tracking-widest mb-1">
                        LOAD & POD VERIFICATION
                      </span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="small fw-black text-white opacity-80">
                          {load.status === "COMPLETED"
                            ? "LOAD ARCHIVED"
                            : "VERIFICATION PENDING"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="d-flex align-items-center gap-3">
                    {user.role !== "Driver" && load.podUrl && (
                      <button
                        type="button"
                        className="btn btn-outline-white-glass px-4 py-3 rounded-pill fw-black text-uppercase"
                        style={{ fontSize: "11px", letterSpacing: "2px" }}
                        onClick={() => setShowPodPreview(true)}
                      >
                        Verify POD
                      </button>
                    )}

                    {load.status === "IN_TRANSIT" && user.role === "Driver" && (
                      <button
                        type="button"
                        className="btn btn-emerald px-5 py-3 rounded-pill fw-black text-uppercase transition-all shadow-glow-emerald"
                        style={{ fontSize: "11px", letterSpacing: "2px" }}
                        onClick={handleSubmitMission}
                      >
                        Submit for Approval
                      </button>
                    )}

                    {(user.role === "Admin" || user.role === "Dispatcher") &&
                      load.status !== "COMPLETED" && (
                        <button
                          type="button"
                          className={`btn ${
                            load.status === "DELIVERED"
                              ? "btn-emerald shadow-glow-emerald animate-pulse-slow"
                              : "btn-secondary opacity-50 cursor-not-allowed"
                          } px-5 py-3 rounded-pill fw-black text-uppercase`}
                          style={{
                            fontSize: "11px",
                            letterSpacing: "2px",
                            border:
                              load.status === "DELIVERED"
                                ? "none"
                                : "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                          onClick={handleApproveLoad}
                          disabled={load.status !== "DELIVERED"}
                        >
                          Verify & Accomplish
                        </button>
                      )}
                    {load.status === "COMPLETED" && (
                      <div className="px-4 py-3 rounded-pill bg-emerald bg-opacity-20 border border-emerald border-opacity-50 d-flex align-items-center gap-2 shadow-glow-emerald animate-fade-in">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#2bdd66"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span
                          className="fw-black text-white text-uppercase tracking-widest"
                          style={{
                            fontSize: "11px",
                            textShadow: "0 0 10px rgba(45, 221, 102, 0.5)",
                          }}
                        >
                          Verified & Accomplished
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPodUpload && (
        <ProofOfDeliveryUpload
          loadId={load._id.toString()}
          onUploadSuccess={handlePodUploadSuccess}
          onClose={() => {
            setShowPodUpload(false);
            setPendingDeliveryIndex(null);
          }}
        />
      )}

      {showPodPreview && load.podUrl && (
        <div
          className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center animate-fade-in"
          style={{ zIndex: 2500 }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-90 backdrop-blur-xl"
            onClick={() => setShowPodPreview(false)}
          ></div>
          <div
            className="position-relative z-1 p-3 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
            onClick={() => setShowPodPreview(false)}
          >
            <div
              className="position-absolute top-0 end-0 p-4"
              style={{ zIndex: 10 }}
            >
              <button
                type="button"
                className="btn-close btn-close-white fs-4"
                title="Close Preview"
                onClick={() => setShowPodPreview(false)}
              ></button>
            </div>
            <img
              src={load.podUrl}
              alt="Proof of Delivery"
              className="img-fluid rounded-4 shadow-2xl transition-all duration-500"
              style={{
                maxHeight: "85vh",
                width: "auto",
                border: "2px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 0 100px rgba(0, 0, 0, 0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 px-4 py-2 rounded-pill bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-10 text-white fw-black x-small text-uppercase tracking-widest">
              Digital Evidence Verification
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .display-6 {
          font-size: 2.5rem;
        }
        .fw-black {
          font-weight: 900;
        }
        .x-small {
          font-size: 0.65rem;
        }
        .tracking-widest {
          letter-spacing: 0.15em;
        }
        .tracking-tighter {
          letter-spacing: -0.05em;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .shadow-glow-emerald {
          box-shadow: 0 0 25px rgba(43, 221, 102, 0.4);
        }
        .shadow-glow-indigo {
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.4);
        }

        .btn-emerald {
          background: linear-gradient(135deg, #2bdd66 0%, #00ffa3 100%);
          color: #060e20;
          border: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-emerald:hover {
          transform: translateY(-2px) scale(1.02);
          filter: brightness(1.1);
          box-shadow: 0 10px 40px rgba(43, 221, 102, 0.5);
        }

        .btn-indigo {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-indigo:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 40px rgba(99, 102, 241, 0.5);
        }

        .btn-outline-white-glass {
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .btn-outline-white-glass:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .text-gradient-white {
          background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .border-ether {
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 0 20px rgba(99, 102, 241, 0.03);
          backdrop-filter: blur(12px);
        }

        .ether-card {
          background: rgba(6, 14, 32, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow:
            inset 0 0 30px rgba(99, 102, 241, 0.02),
            0 10px 40px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
        }

        .ether-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }

        @keyframes pulse-holographic {
          0% {
            box-shadow:
              0 0 10px rgba(255, 255, 255, 0.3),
              inset 0 0 5px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 0 25px rgba(255, 255, 255, 0.6),
              inset 0 0 10px rgba(255, 255, 255, 0.4);
          }
          100% {
            box-shadow:
              0 0 10px rgba(255, 255, 255, 0.3),
              inset 0 0 5px rgba(255, 255, 255, 0.2);
          }
        }

        .pulse-active {
          animation: pulse-holographic 3s infinite ease-in-out;
        }

        .tech-unit {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          color: #6366f1;
          text-shadow: 0 0 8px rgba(99, 102, 241, 0.4);
        }

        .glow-emerald {
          text-shadow: 0 0 12px rgba(43, 221, 102, 0.6);
        }

        .glow-indigo {
          text-shadow: 0 0 12px rgba(99, 102, 241, 0.6);
        }

        .hover-glass:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .hover-rotate-90:hover {
          transform: rotate(90deg);
        }
      `}</style>
    </div>
  );
};

export default LoadDetailsModal;
