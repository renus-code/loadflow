"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import DispatchTable from "@/components/DispatchTable";
import LoadDetailsModal from "@/components/LoadDetailsModal";
import AdminVisualSummary from "@/components/AdminVisualSummary";
import ConfirmationModal from "@/components/ConfirmationModal";
import FleetSection from "@/components/FleetSection";
import { useSearch } from "@/context/SearchContext";
import { ILoad } from "@/models/Load";
import { useRouter } from "next/navigation";

// Removed redundant US_STATES and CA_PROVINCES - now using lib/location

// Removed redundant resolveState


// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const [loads, setLoads] = useState<ILoad[]>([]);
  const [drivers, setDrivers] = useState<
    { _id: string; name: string; email?: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchTerm = useSearch((state) => state.searchTerm);
  const setSearchTerm = useSearch((state) => state.setSearchTerm);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedLoad, setSelectedLoad] = useState<ILoad | null>(null);
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
  }, []);

  const fetchDrivers = useCallback(async () => {
    try {
      if (user?.role === "Admin" || user?.role === "Dispatcher") {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setDrivers(
            data.filter(
              (u: {
                _id: string;
                role: string;
                isPending?: boolean;
                email?: string;
              }) => u.role === "Driver" && u.isPending !== true,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error);
    }
  }, [user?.role]);

  const availableDrivers = useMemo(() => {
    const busyDriverIds = new Set(
      loads
        .filter(
          (l) => l.status !== "COMPLETED",
        )
        .map((l) => {
          const driverId =
            (l.assignedDriverId as unknown as { _id: string })?._id ||
            l.assignedDriverId;
          return driverId?.toString();
        })
        .filter(Boolean),
    );

    return drivers.filter((d) => !busyDriverIds.has(d._id.toString()));
  }, [drivers, loads]);

  useEffect(() => {
    if (user) {
      fetchLoads();
      fetchDrivers();
      const interval = setInterval(fetchLoads, 15000);
      return () => clearInterval(interval);
    }
  }, [user, fetchLoads, fetchDrivers]);

  useEffect(() => {
    if (selectedLoad) {
      const currentLoad = loads.find(
        (l) => String(l._id) === String(selectedLoad._id),
      );
      if (currentLoad && currentLoad !== selectedLoad) {
        setSelectedLoad(currentLoad);
      }
    }
  }, [loads, selectedLoad]);

  const handleEditLoad = (load: ILoad) => {
    router.push(`/dashboard/loads/edit/${load._id}`);
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
            alert(
              data.error || `${isAdmin ? "Deletion" : "Cancellation"} failed`,
            );
          }
        } catch (err) {
          console.error(
            `${isAdmin ? "Deletion" : "Cancellation"} failed:`,
            err,
          );
          alert(`Error ${isAdmin ? "deleting" : "cancelling"} load`);
        }
      },
    });
  };

  const filteredLoads = loads.filter((l) => {
    // Search Term Filter (Load Number Only)
    const searchLower = (searchTerm || "").toLowerCase().trim();
    if (
      searchLower &&
      !(l.loadNumber || "").toLowerCase().includes(searchLower)
    ) {
      return false;
    }

    // Status Filter (KPI Clicked)
    if (!statusFilter || statusFilter === "ALL") return true;

    if (statusFilter === "PENDING") {
      return l.status === "PENDING" || !l.status;
    }
    if (statusFilter === "IN_TRANSIT") {
      return l.status === "IN_TRANSIT" || l.status === "PICKED_UP";
    }
    if (statusFilter === "AWAITING_VERIFY") {
      return l.status === "DELIVERED";
    }
    if (statusFilter === "COMPLETED") {
      return l.status === "COMPLETED";
    }
    if (statusFilter === "CANCELLED") {
      return l.status === "CANCELLED";
    }

    return true;
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
  const cancelledCount = loads.filter((l) => l.status === "CANCELLED").length;

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
            <span className="text-gradient-emerald">
              {user?.role || "User"}
            </span>{" "}
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
          <div
            className="d-flex glass-card p-1 rounded-pill border border-white border-opacity-10 shadow-sm"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
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
              {
                label: "Cancelled",
                value: cancelledCount,
                color: "#ef4444",
                glow: "nebula-glow-red",
                icon: "cancel",
                bg: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.05) 100%)",
              },
            ].map((stat, i) => {
              const statusValue =
                stat.label === "All Loads"
                  ? "ALL"
                  : stat.label === "Pending"
                    ? "PENDING"
                    : stat.label === "In Transit"
                      ? "IN_TRANSIT"
                      : stat.label === "Awaiting Verify"
                        ? "AWAITING_VERIFY"
                        : stat.label === "Completed"
                          ? "COMPLETED"
                          : stat.label === "Cancelled"
                            ? "CANCELLED"
                            : null;

              const isActive =
                statusFilter === statusValue ||
                (!statusFilter && statusValue === "ALL");

              return (
                <div
                  key={i}
                  className="col-12 col-sm-6 col-md-4 col-xl"
                  style={{ cursor: "pointer" }}
                  onClick={() => setStatusFilter(statusValue)}
                >
                  <div
                    className={`glass-card-stitch p-4 rounded-4 position-relative overflow-hidden group ${stat.glow} h-100 d-flex flex-column animate-slide-up hover-float transition-all ${isActive ? "active-filter-card" : ""}`}
                    style={{
                      animationDelay: `${i * 100}ms`,
                      background: stat.bg,
                      border: isActive
                        ? `1px solid ${stat.color}`
                        : "1px solid rgba(255,255,255,0.1)",
                    }}
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
                          fontSize: "clamp(2rem, 8vw, 3.5rem)",
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
              );
            })}
          </div>

          {/* DISPATCH table SECTION - GLASS V4 */}
          <div className="card border border-white border-opacity-10 shadow-2xl rounded-5 overflow-hidden animate-slide-up bg-transparent">
            <div className="card-header border-bottom border-white border-opacity-10 px-3 px-md-5 py-3 py-md-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-4">
                <div className="d-flex flex-column">
                  <h2
                    className="fs-2 fw-black text-white m-0 tracking-tight"
                    style={{
                      fontFamily: "var(--font-syne)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Real-time{" "}
                    <span className="text-gradient-emerald">Board</span>
                  </h2>
                </div>
              </div>

              <div className="ms-auto d-flex align-items-center gap-3">
                {/* COMPACT PREMIUM SEARCH */}
                <div
                  className="glass-card-stitch p-1 rounded-pill d-flex align-items-center border border-white border-opacity-10 shadow-lg flex-grow-1 flex-md-grow-0"
                  style={{
                    maxWidth: "400px",
                    minWidth: "200px",
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
                      Real-time logistics analytics. Satellite systems are
                      clear. Try adjusting your filters.
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
        .active-filter-card {
          box-shadow: 0 0 30px rgba(43, 221, 102, 0.15) !important;
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .nebula-glow-red:hover {
          box-shadow: 0 0 40px rgba(239, 68, 68, 0.25) !important;
        }
        .nebula-glow-red.active-filter-card {
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.25) !important;
          border-color: #ef4444 !important;
        }
        .active-filter-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.03);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
