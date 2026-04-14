"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  truckType: "Sleeper Cab" | "Day Cab";
}

interface Trailer {
  _id: string;
  trailerNo: string;
  make: string;
  model: string;
  year: number;
  trailerType: "Dry Van" | "Reefer" | "Tri Axle" | "Flatbed";
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
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  variant?: "indigo" | "emerald";
  disabled?: boolean;
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
      style={{ zIndex: isOpen ? 2000 : 1 }}
    >
      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="d-flex align-items-center justify-content-between px-3"
        style={{
          minHeight: "42px",
          borderRadius: "14px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.45 : 1,
          border: isOpen
            ? `1.5px solid rgba(${accentRgb}, 0.6)`
            : "1.5px solid rgba(255, 255, 255, 0.1)",
          background: disabled 
            ? "rgba(25, 30, 45, 1)" 
            : isOpen
              ? `rgba(${accentRgb}, 0.15)`
              : "rgba(30, 35, 50, 1)",
          boxShadow: disabled 
            ? "none" 
            : isOpen
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
            background: isOpen
              ? `rgba(${accentRgb}, 0.15)`
              : "rgba(255,255,255,0.05)",
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
            border: `1px solid rgba(${accentRgb}, 0.4)`,
            background: "#05070a",
            boxShadow: `0 24px 80px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(${accentRgb}, 0.2)`,
            padding: "8px",
            maxHeight: "240px",
            overflowY: "auto",
            zIndex: 2001,
            animation:
              "glassDropdownOpen 0.2s cubic-bezier(0.4, 0, 0.2, 1) both",
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* Dot indicator */}
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: isSelected
                          ? accentColor
                          : "rgba(255,255,255,0.15)",
                        boxShadow: isSelected
                          ? `0 0 6px ${accentColor}`
                          : "none",
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
                        color: isSelected
                          ? accentColor
                          : "rgba(255,255,255,0.65)",
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
  const [hasViewedPod, setHasViewedPod] = useState(false);
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
          const currentTruck = tData.find(
            (t: any) => t.truckNo === load.truckNumber,
          );
          if (currentTruck)
            setTruckSpecs(
              `${currentTruck.year} ${currentTruck.make} ${currentTruck.model}`,
            );
        }
        if (trailersRes.ok) {
          const trData = await trailersRes.json();
          setTrailers(trData);
          // Pre-populate specs if already assigned
          const currentTrailer = trData.find(
            (tr: any) => tr.trailerNo === load.trailerNumber,
          );
          if (currentTrailer)
            setTrailerSpecs(
              `${currentTrailer.year} ${currentTrailer.make} ${currentTrailer.model}`,
            );
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

  const googleMapsUrl = useMemo(() => {
    if (!load.pickups?.length || !load.deliveries?.length) return "";
    
    const origin = encodeURIComponent(`${load.pickups[0].address}, ${load.pickups[0].city}, ${load.pickups[0].state}`);
    const destination = encodeURIComponent(`${load.deliveries[load.deliveries.length - 1].address}, ${load.deliveries[load.deliveries.length - 1].city}, ${load.deliveries[load.deliveries.length - 1].state}`);
    
    const waypointsList = [];
    for (let i = 1; i < load.pickups.length; i++) {
      waypointsList.push(`${load.pickups[i].address}, ${load.pickups[i].city}, ${load.pickups[i].state}`);
    }
    for (let i = 0; i < load.deliveries.length - 1; i++) {
      waypointsList.push(`${load.deliveries[i].address}, ${load.deliveries[i].city}, ${load.deliveries[i].state}`);
    }
    
    const waypoints = waypointsList.length > 0 
      ? `&waypoints=${waypointsList.map(w => encodeURIComponent(w)).join('|')}` 
      : "";

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}`;
  }, [load.pickups, load.deliveries]);

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
          __v: load.__v,
        }),
      });

      if (response.status === 409) {
        const errData = await response.json();
        alert(
          errData.error ||
            "Load has been modified by another user. Please refresh.",
        );
        onUpdate();
        return;
      }

      if (response.ok) onUpdate();
      else {
        const errData = await response.json();
        alert(
          `Failed to update stop status: ${errData.error || "Unknown error"}`,
        );
      }
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
    if (user.role !== "Dispatcher" && user.role !== "Admin") {
      alert("Permission denied: only Dispatchers or Admins can modify load assignments.");
      return;
    }
    try {
      const response = await fetch(`/api/loads/${load._id}/assign`, {
        method: "PUT", // API uses PUT for assignment
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedDriverId: selectedDriverId,
          truckNumber,
          trailerNumber,
          truckType,
          trailerType,
          __v: load.__v,
        }),
      });

      if (response.status === 409) {
        const errData = await response.json();
        alert(
          errData.error ||
            "Load has been modified by another user. Please refresh.",
        );
        onUpdate();
        setShowEditAssignment(false);
        return;
      }

      if (response.ok) {
        onUpdate();
        setShowEditAssignment(false);
      } else {
        const errData = await response.json();
        alert(`Assignment failed: ${errData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Assignment failed", error);
    }
  };

  const handleUnassign = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.role !== "Dispatcher" && user.role !== "Admin") {
      alert("Permission denied: only Dispatchers or Admins can modify load assignments.");
      return;
    }
    try {
      const response = await fetch(`/api/loads/${load._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedDriverId: null,
          truckNumber: null,
          trailerNumber: null,
          truckType: null,
          trailerType: null,
          __v: load.__v,
        }),
      });

      if (response.status === 409) {
        const errData = await response.json();
        alert(
          errData.error ||
            "Load has been modified by another user. Please refresh.",
        );
        onUpdate();
        setShowEditAssignment(false);
        return;
      }

      if (response.ok) {
        onUpdate();
        setShowEditAssignment(false);
      } else {
        const errData = await response.json();
        alert(`Unassignment failed: ${errData.error || "Unknown error"}`);
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
        body: JSON.stringify({ status: "DELIVERED", __v: load.__v }),
      });

      if (response.status === 409) {
        const errData = await response.json();
        alert(
          errData.error ||
            "Load has been modified by another user. Please refresh.",
        );
        onUpdate();
        return;
      }

      if (response.ok) onUpdate();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleApproveLoad = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.role !== "Dispatcher" && user.role !== "Admin") {
      alert("Only dispatchers can finalize load status.");
      return;
    }
    try {
      const response = await fetch(`/api/loads/${load._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED", __v: load.__v }),
      });

      if (response.status === 409) {
        const errData = await response.json();
        alert(
          errData.error ||
            "Load has been modified by another user. Please refresh.",
        );
        onUpdate();
        return;
      }

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
            background:
              "radial-gradient(circle at top right, #0f1629, #05070a)",
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
              aria-label="Close"
              title="Close"
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
                  className="d-flex justify-content-between align-items-center mb-2 position-relative"
                  style={{ minHeight: "60px" }}
                >
                  {/* Progress Line Background */}
                  <div
                    className="position-absolute"
                    style={{
                      top: "16px",
                      left: "50px",
                      right: "50px",
                      height: "1px",
                      background: "rgba(255,255,255,0.05)",
                      zIndex: 0,
                    }}
                  >
                    {/* Progress Line Active */}
                    <div
                      className="h-100 transition-all duration-1000 ease-out"
                      style={{
                        width: `${(currentStatusIndex / (statusWorkflow.length - 1)) * 100}%`,
                        background: "linear-gradient(90deg, #2bdd66, #00ffa3)",
                        boxShadow: "0 0 20px rgba(43, 221, 102, 0.4)",
                        position: "relative",
                        height: "2px",
                        top: "-0.5px"
                      }}
                    ></div>
                  </div>

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
                      
                      {/* Commodity / Description */}
                      <div className="mb-4">
                        <label className="text-white opacity-40 fw-black text-uppercase x-small tracking-widest mb-1 d-block">
                          Primary Commodity
                        </label>
                        <div className="fw-black fs-4 text-white text-uppercase tracking-tight">
                          {load.commodity || "General Freight"}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <label className="text-white opacity-70 fw-black text-uppercase x-small tracking-widest mb-1 d-block">
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
                          <label className="text-white opacity-70 fw-black text-uppercase x-small tracking-widest mb-1 d-block">
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

                      {/* ROUTE STATS */}
                      {(load.totalDistance != null || load.estimatedDuration != null) && (
                        <div className="row mt-4 pt-4 border-top border-white border-opacity-5 animate-fade-in">
                          <div className="col-6">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <div className="p-1 px-2 rounded-2 bg-emerald bg-opacity-10 border border-emerald border-opacity-10 d-flex align-items-center justify-content-center">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2bdd66" strokeWidth="3" style={{ filter: "drop-shadow(0 0 4px rgba(45, 221, 102, 0.4))" }}>
                                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                                  <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
                                </svg>
                              </div>
                              <label className="text-white opacity-70 fw-black text-uppercase x-small tracking-widest m-0">
                                Route Distance
                              </label>
                            </div>
                            <div className="fw-black fs-3 text-white">
                              {load.totalDistance ? load.totalDistance.toLocaleString() : "—"}{" "}
                              <span className="opacity-40 fs-6 fw-medium">mi</span>
                            </div>
                          </div>
                          <div className="col-6 text-end">
                            <div className="d-flex align-items-center justify-content-end gap-2 mb-1">
                              <label className="text-white opacity-70 fw-black text-uppercase x-small tracking-widest m-0">
                                Est. Transit Time
                              </label>
                              <div className="p-1 px-2 rounded-2 bg-indigo bg-opacity-10 border border-indigo border-opacity-10 d-flex align-items-center justify-content-center">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" style={{ filter: "drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))" }}>
                                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                </svg>
                              </div>
                            </div>
                            <div className="fw-black fs-3 text-white">
                                {(() => {
                                  if (load.pickups.length > 0 && load.deliveries.length > 0) {
                                    const first = load.pickups[0];
                                    const last = load.deliveries[load.deliveries.length - 1];
                                    if (first.date && first.time && last.date && last.time) {
                                      const start = new Date(`${new Date(first.date).toISOString().split("T")[0]}T${first.time}`);
                                      const end = new Date(`${new Date(last.date).toISOString().split("T")[0]}T${last.time}`);
                                      const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                                      if (diffHours > 0) return diffHours.toFixed(1);
                                    }
                                  }
                                  return load.estimatedDuration || "—";
                                })()}{" "}
                            <span className="opacity-40 fs-6 fw-medium">hrs</span>
                          </div>
                        </div>
                      </div>
                    )}
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
                            Fleet Assignment
                          </h6>
                        </div>
                        {(user.role === "Dispatcher" || user.role === "Admin") &&
                          load.assignedDriverId &&
                          !showEditAssignment && (
                            <button
                              type="button"
                              className={`btn ${
                                load.status === "DELIVERED" ||
                                load.status === "COMPLETED" ||
                                load.status === "CANCELLED"
                                  ? "btn-secondary opacity-50 cursor-not-allowed"
                                  : "btn-indigo"
                              } btn-sm px-4 rounded-pill fw-black`}
                              style={{
                                fontSize: "10px",
                                border:
                                  load.status === "DELIVERED" ||
                                  load.status === "COMPLETED" ||
                                  load.status === "CANCELLED"
                                    ? "1px solid rgba(255, 255, 255, 0.1)"
                                    : "none",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEditAssignment(true);
                              }}
                              disabled={
                                load.status === "DELIVERED" ||
                                load.status === "COMPLETED" ||
                                load.status === "CANCELLED"
                              }
                            >
                              Modify
                            </button>
                          )}
                      </div>

                      {load.assignedDriverId && !showEditAssignment ? (
                        <div className="animate-fade-in">
                          <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#a855f7"
                                strokeWidth="2.5"
                                style={{ filter: "drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))" }}
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                Assigned Operator
                              </label>
                            </div>
                            <div className="fw-black fs-4 text-white">
                              {(load.assignedDriverId as unknown as Driver)
                                ?.name || "Active Driver"}
                            </div>
                          </div>
                          <div className="row g-4">
                            {/* Truck Block */}
                            <div className="col-12">
                              <div className="row g-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#6366f1"
                                      strokeWidth="2.5"
                                      style={{ filter: "drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))" }}
                                    >
                                      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                                      <path d="M19 18h2a1 1 0 0 0 1-1v-4.24a2 2 0 0 0-.81-1.6l-3.19-2.39V18Z" />
                                      <circle cx="7" cy="18" r="2" />
                                      <circle cx="17" cy="18" r="2" />
                                    </svg>
                                    <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                      Truck Type
                                    </label>
                                  </div>
                                  <div className="p-2 px-3 rounded-4 border border-white border-opacity-5 text-white fw-black x-small text-uppercase" style={{ background: "rgba(99, 102, 241, 0.1)" }}>
                                    {load.truckType || "—"}
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#6366f1"
                                      strokeWidth="2.5"
                                      style={{ filter: "drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))" }}
                                    >
                                      <rect x="3" y="11" width="18" height="10" rx="2" />
                                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                      Vector Unit
                                    </label>
                                  </div>
                                  <div className="p-2 px-3 rounded-4 border border-white border-opacity-5 text-white fw-black x-small text-uppercase" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                                    {load.truckNumber || "—"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Trailer Block */}
                            <div className="col-12">
                              <div className="row g-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#10b981"
                                      strokeWidth="2.5"
                                      style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))" }}
                                    >
                                      <path d="M10 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                                      <path d="M2 15h20" />
                                    </svg>
                                    <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                      Trailer Type
                                    </label>
                                  </div>
                                  <div className="p-2 px-3 rounded-4 border border-white border-opacity-5 text-white fw-black x-small text-uppercase" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
                                    {load.trailerType || "—"}
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#10b981"
                                      strokeWidth="2.5"
                                      style={{ filter: "drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))" }}
                                    >
                                      <path d="m15 7 1 1h5l1 1v10l-1 1h-6l-1-1v-5l-1-1h-4l-1-1v-5l1-1h5z" />
                                    </svg>
                                    <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                      Relay Unit
                                    </label>
                                  </div>
                                  <div className="p-2 px-3 rounded-4 border border-white border-opacity-5 text-white fw-black x-small text-uppercase" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                                    {load.trailerNumber || "—"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : user.role === "Admin" ? (
                        <div
                          className="p-5 rounded-4 border border-white border-opacity-10 text-center"
                          style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)",
                          }}
                        >
                          <div
                            className="bg-indigo bg-opacity-10 p-3 rounded-circle d-inline-flex mx-auto mb-3"
                            style={{ border: "1px solid rgba(99, 102, 241, 0.1)" }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </div>
                          <h6 className="fw-black text-white text-uppercase tracking-widest small mb-2">
                            Fleet Assignment Pending
                          </h6>
                        </div>
                      ) : (
                        <div
                          className="p-4 rounded-4 border border-white border-opacity-10 pb-5"
                          style={{
                            background: "#0b101f",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                          }}
                        >
                          <div className="mb-4">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                              <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                Assigned Operator
                              </label>
                            </div>
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
                            <div className="col-12">
                              <div className="row g-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                    <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                      Truck Type
                                    </label>
                                  </div>
                                  <GlassSelect
                                    value={truckType}
                                    onChange={(val) => {
                                      setTruckType(val);
                                      const currentTruck = trucks.find(
                                        (t) => t.truckNo === truckNumber,
                                      );
                                      if (
                                        currentTruck &&
                                        val &&
                                        currentTruck.truckType !== val
                                      ) {
                                        setTruckNumber("");
                                        setTruckSpecs("");
                                      }
                                    }}
                                    placeholder="Select Cab Type..."
                                    options={[
                                      {
                                        value: "Sleeper Cab",
                                        label: "Sleeper Cab",
                                      },
                                      { value: "Day Cab", label: "Day Cab" },
                                    ]}
                                    variant="indigo"
                                  />
                                </div>
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                                    <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                      Vector Unit (Truck)
                                    </label>
                                  </div>
                                  <GlassSelect
                                    value={truckNumber}
                                    disabled={!truckType}
                                    onChange={(val) => {
                                      setTruckNumber(val);
                                      const selected = trucks.find(
                                        (t) => t.truckNo === val,
                                      );
                                      if (selected) {
                                        setTruckSpecs(
                                          `${selected.year} ${selected.make} ${selected.model}`,
                                        );
                                        setTruckType(selected.truckType);
                                      }
                                    }}
                                    placeholder={truckType ? "Select Truck ID..." : "Select Type First"}
                                    options={trucks
                                      .filter(
                                        (t) =>
                                          !truckType ||
                                          t.truckType === truckType,
                                      )
                                      .map((t) => ({
                                        value: t.truckNo,
                                        label: t.truckNo,
                                      }))}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="col-12">
                              <div className="row g-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><path d="M16 8h5l2 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle></svg>
                                    <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                      Trailer Type
                                    </label>
                                  </div>
                                  <GlassSelect
                                    value={trailerType}
                                    onChange={(val) => {
                                      setTrailerType(val);
                                      const currentTrailer = trailers.find(
                                        (t) => t.trailerNo === trailerNumber,
                                      );
                                      if (
                                        currentTrailer &&
                                        val &&
                                        currentTrailer.trailerType !== val
                                      ) {
                                        setTrailerNumber("");
                                        setTrailerSpecs("");
                                      }
                                    }}
                                    placeholder="Select Type..."
                                    options={[
                                      { value: "Dry Van", label: "Dry Van" },
                                      { value: "Reefer", label: "Reefer" },
                                      { value: "Tri Axle", label: "Tri Axle" },
                                      { value: "Flatbed", label: "Flatbed" },
                                    ]}
                                    variant="emerald"
                                  />
                                </div>
                                <div className="col-6">
                                  <div className="d-flex align-items-center gap-2 mb-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><line x1="2" y1="12" x2="22" y2="12"></line></svg>
                                    <label className="text-white fw-black text-uppercase x-small tracking-widest d-block m-0">
                                      Relay Unit (Trailer)
                                    </label>
                                  </div>
                                  <GlassSelect
                                    value={trailerNumber}
                                    disabled={!trailerType}
                                    onChange={(val) => {
                                      setTrailerNumber(val);
                                      const selected = trailers.find(
                                        (t) => t.trailerNo === val,
                                      );
                                      if (selected) {
                                        setTrailerSpecs(
                                          `${selected.year} ${selected.make} ${selected.model}`,
                                        );
                                        setTrailerType(selected.trailerType);
                                      }
                                    }}
                                    placeholder={trailerType ? "Select Trailer ID..." : "Select Type First"}
                                    options={trailers
                                      .filter(
                                        (t) =>
                                          !trailerType ||
                                          t.trailerType === trailerType,
                                      )
                                      .map((t) => ({
                                        value: t.trailerNo,
                                        label: t.trailerNo,
                                      }))}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex gap-3 pt-4 mt-2">
                            {load.assignedDriverId && (
                              <button
                                className="btn btn-outline-light btn-sm flex-grow-1 rounded-pill fw-black"
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
                  <div className="d-flex align-items-center justify-content-between mb-5">
                    <div className="d-flex align-items-center gap-3">
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
                    
                    <button
                      onClick={() => window.open(googleMapsUrl, "_blank")}
                      className="btn btn-indigo btn-sm px-4 rounded-pill fw-black d-flex align-items-center gap-2 border-0 shadow-lg"
                      style={{ 
                        fontSize: '10px', 
                        letterSpacing: '1px',
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      MAPS
                    </button>
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
                                zIndex: 2,
                                position: "relative",
                              }}
                            ></div>
                            {/* Pinpoint Line */}
                            <div 
                              className="position-absolute" 
                              style={{ 
                                left: "6px", 
                                top: "6px", 
                                width: "1.25rem", 
                                height: "1.5px", 
                                background: "linear-gradient(90deg, #2bdd66, rgba(45, 221, 102, 0.2))", 
                                zIndex: 1,
                              }} 
                            />
                            <div 
                              className="position-absolute rounded-circle bg-emerald"
                              style={{
                                left: "1.65rem",
                                top: "4.5px",
                                width: "4px",
                                height: "4px",
                                boxShadow: "0 0 8px rgba(45, 221, 102, 0.6)",
                                zIndex: 3
                              }}
                            />
                          </div>
                          <div
                            className="p-3 rounded-4 border border-white border-opacity-5 shadow-sm transition-all hover-glass"
                            style={{ background: "rgba(255, 255, 255, 0.03)" }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div
                                className="px-2 py-1 rounded-pill fw-black"
                                style={{
                                  background: "rgba(45, 221, 102, 0.15)",
                                  border: "1px solid rgba(45, 221, 102, 0.4)",
                                  fontSize: "9px",
                                  letterSpacing: "0.5px",
                                  color: "#2bdd66"
                                }}
                              >
                                PICKUP 0{i + 1}
                              </div>
                              <span className="x-small text-white fw-black">
                                {new Date(p.date).toLocaleDateString()} @ {(() => {
                                  if (!p.time) return "—";
                                  const [hours, minutes] = p.time.split(':');
                                  let h = parseInt(hours);
                                  const ampm = h >= 12 ? 'PM' : 'AM';
                                  h = h % 12 || 12;
                                  return `${h}:${minutes} ${ampm}`;
                                })()}
                              </span>
                            </div>
                            <div 
                              className="fw-black small mb-1 text-uppercase tracking-wider"
                              style={{ color: "#ffffff" }}
                            >
                              {p.companyName || "Unknown Company"}
                            </div>
                            <div className="fw-bold text-white x-small mb-1 opacity-80 text-uppercase">
                              {p.address}
                            </div>
                            <div className="fw-bold text-white x-small opacity-80 text-uppercase">
                              {p.city}, {p.state}
                            </div>
                            <div className="mt-2 pt-2 border-top border-white border-opacity-5">
                              <span className="x-small text-white opacity-40 text-uppercase tracking-widest d-block mb-1">Appointment Number</span>
                              <span className="small fw-black text-white" style={{ letterSpacing: '0.05em' }}>{p.appointmentNumber || "—"}</span>
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
                                zIndex: 2,
                                position: "relative",
                              }}
                            ></div>
                            {/* Pinpoint Line */}
                            <div 
                              className="position-absolute" 
                              style={{ 
                                left: "6px", 
                                top: "6px", 
                                width: "1.25rem", 
                                height: "1.5px", 
                                background: "linear-gradient(90deg, #6366f1, rgba(99, 102, 241, 0.2))", 
                                zIndex: 1,
                              }} 
                            />
                            <div 
                              className="position-absolute rounded-circle bg-indigo"
                              style={{
                                left: "1.65rem",
                                top: "4.5px",
                                width: "4px",
                                height: "4px",
                                boxShadow: "0 0 8px rgba(99, 102, 241, 0.6)",
                                zIndex: 3
                              }}
                            />
                          </div>
                          <div
                            className="p-3 rounded-4 border border-white border-opacity-5 shadow-sm transition-all hover-glass"
                            style={{ background: "rgba(255, 255, 255, 0.03)" }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div
                                className="px-2 py-1 rounded-pill fw-black"
                                style={{
                                  background: "rgba(99, 102, 241, 0.15)",
                                  border: "1px solid rgba(99, 102, 241, 0.4)",
                                  fontSize: "9px",
                                  letterSpacing: "0.5px",
                                  color: "#6366f1"
                                }}
                              >
                                DELIVERY 0{i + 1}
                              </div>
                              <span className="x-small text-white fw-black">
                                {new Date(p.date).toLocaleDateString()} @ {(() => {
                                  if (!p.time) return "—";
                                  const [hours, minutes] = p.time.split(':');
                                  let h = parseInt(hours);
                                  const ampm = h >= 12 ? 'PM' : 'AM';
                                  h = h % 12 || 12;
                                  return `${h}:${minutes} ${ampm}`;
                                })()}
                              </span>
                            </div>
                            <div 
                              className="fw-black small mb-1 text-uppercase tracking-wider"
                              style={{ color: "#ffffff" }}
                            >
                              {p.companyName || "Unknown Company"}
                            </div>
                            <div className="fw-bold text-white x-small mb-1 opacity-80 text-uppercase">
                              {p.address}
                            </div>
                            <div className="fw-bold text-white x-small opacity-80 text-uppercase">
                              {p.city}, {p.state}
                            </div>
                            <div className="mt-2 pt-2 border-top border-white border-opacity-5">
                              <span className="x-small text-white opacity-40 text-uppercase tracking-widest d-block mb-1">Appointment Number</span>
                              <span className="small fw-black text-white" style={{ letterSpacing: '0.05em' }}>{p.appointmentNumber || "—"}</span>
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
                        className="btn btn-outline-white-glass px-4 py-3 rounded-pill fw-black text-uppercase transition-all hover-glass"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "2px",
                          background: hasViewedPod
                            ? "rgba(43, 221, 102, 0.1)"
                            : "rgba(99, 102, 241, 0.15)",
                          borderColor: hasViewedPod
                            ? "rgba(43, 221, 102, 0.4)"
                            : "rgba(99, 102, 241, 0.4)",
                        }}
                        onClick={() => {
                          setShowPodPreview(true);
                          setHasViewedPod(true);
                        }}
                      >
                        {hasViewedPod ? "View POD (Verified)" : "View POD"}
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

                    {(user.role === "Dispatcher" || user.role === "Admin") &&
                      load.status !== "COMPLETED" && (
                        <button
                          type="button"
                          className={`btn ${
                            (load.status === "DELIVERED" || (load.status === "IN_TRANSIT" && isAllStopsDone)) && hasViewedPod
                              ? "btn-emerald shadow-glow-emerald animate-pulse-slow"
                              : "btn-secondary opacity-50 cursor-not-allowed"
                          } px-5 py-3 rounded-pill fw-black text-uppercase`}
                          style={{
                            fontSize: "11px",
                            letterSpacing: "2px",
                            border:
                              (load.status === "DELIVERED" || (load.status === "IN_TRANSIT" && isAllStopsDone)) && hasViewedPod
                                ? "none"
                                : "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                          onClick={handleApproveLoad}
                          title={
                            !hasViewedPod
                              ? "You must view the POD document first"
                              : ""
                          }
                          disabled={
                            !(load.status === "DELIVERED" || (load.status === "IN_TRANSIT" && isAllStopsDone)) || !hasViewedPod
                          }
                        >
                          Mark as Completed
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
          onClick={(e) => e.stopPropagation()}
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
          background: #090f1d;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: visible;
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
