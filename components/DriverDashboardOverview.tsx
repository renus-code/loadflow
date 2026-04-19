/**
 * ======================================================================================
 * COMPONENT: DriverDashboardOverview (The "Mission Command" Interface)
 * ======================================================================================
 * The primary mission-critical hub for drivers, optimized for real-time operation.
 *
 * Features:
 * 1. Operational Intelligence: Live weather and traffic monitoring based on active route.
 * 2. Visual Parity: Synchronized duration metrics with the core Logistics Nexus (LoadDetails).
 * 3. Kinetic Visuals: Glassmorphic summary cards with professional glow effects and animations.
 * 4. Mission-First UI: Prioritizes active loads with clear, actionable progress indicators.
 * 5. Environment Awareness: Dynamic background effects (e.g., nebula) to reduce eye fatigue.
 * ======================================================================================
 */
"use client";

import { useMemo, useState, useEffect } from "react";
import { ILoad } from "@/models/Load";
import { calculateMockRouteStatsSync } from "@/lib/maps";

export default function DriverDashboardOverview({
  loads,
  user,
}: {
  loads: ILoad[];
  user: any;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [weather, setWeather] = useState<{
    temp: number;
    text: string;
    icon: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter and process data for THIS driver
  const { activeLoad, stats } = useMemo(() => {
    // The API already filters loads for the logged-in driver,
    // so we can use the loads prop directly.
    const driverLoads = loads;

    const active = driverLoads.find((l) =>
      ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"].includes(l.status),
    );

    // 2. Calculate Stats
    const totalMiles = driverLoads
      .filter((l) => l.status !== "CANCELLED")
      .reduce((acc, l) => {
        const distance =
          l.totalDistance ||
          calculateMockRouteStatsSync(l.pickups, l.deliveries).distance;
        return acc + distance;
      }, 0);

    const totalCompleted = driverLoads.filter((l) =>
      ["COMPLETED", "DELIVERED"].includes(l.status),
    ).length;

    const totalCancelled = driverLoads.filter(
      (l) => l.status === "CANCELLED",
    ).length;

    // Reliability logic (keeping it for logic, though it might be hidden from UI)
    const reliability =
      totalCompleted + totalCancelled > 0
        ? Math.round((totalCompleted / (totalCompleted + totalCancelled)) * 100)
        : 100;

    // Hours Calculation: Sum of durations for all non-cancelled loads
    const totalHours = driverLoads
      .filter((l) => l.status !== "CANCELLED")
      .reduce((acc, l) => {
        const duration =
          l.estimatedDuration ||
          calculateMockRouteStatsSync(l.pickups, l.deliveries).duration;
        return acc + duration;
      }, 0);

    return {
      activeLoad: active,
      stats: {
        miles: Math.round(totalMiles),
        reliability: reliability > 100 ? 100 : reliability,
        completed: totalCompleted,
        hours: totalHours.toFixed(1),
      },
    };
  }, [loads, user]);

  // Weather Fetching Logic
  useEffect(() => {
    if (!activeLoad) return;
    const target =
      activeLoad.status === "ASSIGNED"
        ? activeLoad.pickups[0]
        : activeLoad.deliveries[0];

    // Fallback to Toronto coords if lat/lng missing
    const lat = target.lat || 43.6532;
    const lng = target.lng || -79.3832;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.current_weather) {
          const code = data.current_weather.weathercode;
          // Map WMO Weather codes to human readable + icon
          let text = "Clear";
          let icon = "sunny";

          if (code === 0) {
            text = "Clear";
            icon = "sunny";
          } else if (code <= 3) {
            text = "Partly Cloudy";
            icon = "cloud";
          } else if (code <= 48) {
            text = "Foggy";
            icon = "foggy";
          } else if (code <= 67) {
            text = "Rainy";
            icon = "rainy";
          } else if (code <= 77) {
            text = "Snowy";
            icon = "ac_unit";
          } else if (code <= 99) {
            text = "Stormy";
            icon = "thunderstorm";
          }

          setWeather({
            temp: Math.round(data.current_weather.temperature),
            text: text.toUpperCase(),
            icon: icon,
          });
        }
      })
      .catch((err) => console.error("Weather fetch failed:", err));
  }, [activeLoad]);

  const getProgress = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return 10;
      case "PICKED_UP":
        return 40;
      case "IN_TRANSIT":
        return 70;
      case "DELIVERED":
        return 100;
      default:
        return 0;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "Ready for Pickup";
      case "PICKED_UP":
        return "Loading Complete";
      case "IN_TRANSIT":
        return "In Transit";
      case "DELIVERED":
        return "Arrived at Target";
      default:
        return status;
    }
  };

  if (!isMounted) return null;

  return (
    <div className="animate-slide-up">
      <div className="row g-4">
        {/* ACTIVE LOAD HIGHLIGHT */}
        <div className="col-12 col-xl-8">
          <div className="glass-card-stitch p-0 rounded-5 border border-white border-opacity-10 overflow-hidden h-100 hover-float transition-all shadow-2xl position-relative">
            {/* Background Image for Active Load */}
            {activeLoad && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 opacity-20"
                style={{
                  zIndex: 0,
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(100%) brightness(0.5)",
                }}
              ></div>
            )}

            <div
              className="p-4 border-bottom border-white border-opacity-10 d-flex justify-content-between align-items-center position-relative z-index-2"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <span
                    className="material-symbols-outlined fw-bold fs-2"
                    style={{ color: "#2bdd66" }}
                  >
                    local_shipping
                  </span>
                </div>
                <div>
                  <h4
                    className="fw-black text-white m-0"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {activeLoad ? "Active Mission" : "Standby Mode"}
                  </h4>
                  <p className="small m-0 fw-bold" style={{ color: "#00d4ff" }}>
                    {activeLoad
                      ? `Load #${activeLoad.loadNumber}`
                      : "Waiting for next assignment"}
                  </p>
                </div>
              </div>
              {activeLoad && (
                <div
                  className="badge rounded-pill px-3 py-2 fw-black tracking-widest text-uppercase"
                  style={{
                    fontSize: "0.65rem",
                    color: "#ffd700",
                    border: "1px solid #ffd700",
                    background: "transparent",
                  }}
                >
                  {activeLoad.status.replace("_", " ")}
                </div>
              )}
            </div>

            <div className="p-4 position-relative z-index-2">
              {activeLoad ? (
                <div className="row g-4">
                  <div className="col-12 col-md-5">
                    <div className="mb-4">
                      <div className="x-small text-uppercase tracking-widest text-white opacity-40 fw-black mb-2">
                        {activeLoad.status === "ASSIGNED"
                          ? "Next Pickup"
                          : "Next Destination"}
                      </div>
                      <div
                        className="h4 fw-black text-white mb-1"
                        style={{ fontFamily: "var(--font-syne)" }}
                      >
                        {activeLoad.status === "ASSIGNED"
                          ? `${activeLoad.pickups[0].city}, ${activeLoad.pickups[0].state}`
                          : `${activeLoad.deliveries[0].city}, ${activeLoad.deliveries[0].state}`}
                      </div>
                      <div className="small text-white opacity-60 mb-4">
                        {activeLoad.status === "ASSIGNED"
                          ? activeLoad.pickups[0].companyName
                          : activeLoad.deliveries[0].companyName}
                      </div>

                      {/* Environment & Mission Stats Section */}
                      {(() => {
                        // 1. Calculate Environment
                        const hour = new Date().getHours();
                        const isRushHour =
                          (hour >= 7 && hour <= 9) ||
                          (hour >= 16 && hour <= 19);
                        const isBadWeather =
                          weather &&
                          ["RAINY", "SNOWY", "STORMY"].includes(weather.text);
                        const city =
                          activeLoad.status === "ASSIGNED"
                            ? activeLoad.pickups[0].city
                            : activeLoad.deliveries[0].city;
                        const isMajorCity = [
                          "Toronto",
                          "Vaughan",
                          "Mississauga",
                          "Brampton",
                        ].some((c) => city.includes(c));

                        const env = {
                          text:
                            isRushHour && isBadWeather
                              ? "CRITICAL"
                              : isRushHour || (isBadWeather && isMajorCity)
                                ? "HEAVY"
                                : isMajorCity || isBadWeather
                                  ? "MODERATE"
                                  : "LIGHT",
                          color:
                            isRushHour && isBadWeather
                              ? "text-danger"
                              : isRushHour || (isBadWeather && isMajorCity)
                                ? "text-orange"
                                : isMajorCity || isBadWeather
                                  ? "text-warning"
                                  : "text-emerald",
                        };

                        // 2. Calculate Stats
                        const progress = getProgress(activeLoad.status) / 100;
                        const totalDistance =
                          activeLoad.totalDistance ||
                          calculateMockRouteStatsSync(
                            activeLoad.pickups,
                            activeLoad.deliveries,
                          ).distance;
                        const totalDuration =
                          activeLoad.estimatedDuration ||
                          calculateMockRouteStatsSync(
                            activeLoad.pickups,
                            activeLoad.deliveries,
                          ).duration;

                        const trafficMultiplier =
                          env.text === "CRITICAL"
                            ? 2.5
                            : env.text === "HEAVY"
                              ? 1.8
                              : env.text === "MODERATE"
                                ? 1.3
                                : 1.0;
                        const remainingDist = Math.max(
                          0,
                          Math.round(totalDistance * (1 - progress)),
                        );
                        const remainingHours = Math.max(
                          0,
                          totalDuration * (1 - progress) * trafficMultiplier,
                        );

                        return (
                          <>
                            {/* Environment Widgets */}
                            <div className="d-flex flex-wrap gap-2 mb-4">
                              <div
                                className="px-3 py-2 rounded-pill border border-white border-opacity-10 d-flex align-items-center gap-2"
                                style={{
                                  background: "rgba(0,0,0,0.4)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                <span className="material-symbols-outlined fs-6 text-glow-cyan animate-pulse-soft">
                                  {weather?.icon || "sunny"}
                                </span>
                                <span
                                  className="fw-bold text-white"
                                  style={{
                                    fontSize: "10px",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {weather
                                    ? `${weather.temp}°C ${weather.text}`
                                    : "LOADING..."}
                                </span>
                              </div>
                              <div
                                className="px-3 py-2 rounded-pill border border-white border-opacity-10 d-flex align-items-center gap-2"
                                style={{
                                  background: "rgba(0,0,0,0.4)",
                                  backdropFilter: "blur(10px)",
                                }}
                              >
                                <span
                                  className={`material-symbols-outlined fs-6 ${env.color}`}
                                >
                                  traffic
                                </span>
                                <span
                                  className="fw-bold text-white"
                                  style={{
                                    fontSize: "10px",
                                    letterSpacing: "0.05em",
                                  }}
                                >
                                  {env.text} TRAFFIC
                                </span>
                              </div>
                            </div>

                            {/* Mission Metrics */}
                            <div className="mb-4">
                              <div className="row g-4">
                                <div className="col-4 border-end border-white border-opacity-10">
                                  <div className="x-small text-uppercase tracking-widest text-white opacity-30 fw-black mb-1">
                                    MILES
                                  </div>
                                  <div
                                    className="h4 fw-black text-white m-0 d-flex align-items-baseline gap-1"
                                    style={{ fontFamily: "var(--font-syne)" }}
                                  >
                                    {Math.round(totalDistance)}
                                    <span className="fs-6 ms-1 text-white">
                                      mi
                                    </span>
                                  </div>
                                </div>
                                <div className="col-4 border-end border-white border-opacity-10">
                                  <div className="x-small text-uppercase tracking-widest text-white opacity-30 fw-black mb-1">
                                    WEIGHT
                                  </div>
                                  <div
                                    className="h4 fw-black text-white m-0 d-flex align-items-baseline gap-1"
                                    style={{ fontFamily: "var(--font-syne)" }}
                                  >
                                    {activeLoad.weight || "12.5k"}
                                    <span className="fs-6 ms-1 text-white">
                                      lbs
                                    </span>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="x-small text-uppercase tracking-widest text-white opacity-30 fw-black mb-1">
                                    DURATION
                                  </div>
                                  <div
                                    className="h4 fw-black text-white m-0 d-flex align-items-baseline gap-1"
                                    style={{ fontFamily: "var(--font-syne)" }}
                                  >
                                    {totalDuration.toFixed(1)}
                                    <span className="fs-6 ms-1 text-white">
                                      hrs
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <button
                      onClick={() => {
                        const target =
                          activeLoad.status === "ASSIGNED"
                            ? activeLoad.pickups[0]
                            : activeLoad.deliveries[0];
                        const query = encodeURIComponent(
                          `${target.address || ""} ${target.city}, ${target.state}`,
                        );
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${query}`,
                          "_blank",
                        );
                      }}
                      className="btn w-100 rounded-5 py-3 fw-black shadow-glow-emerald d-flex align-items-center justify-content-center gap-2 transition-all hover-scale"
                      style={{
                        background:
                          "linear-gradient(90deg, #2bdd66 0%, #00d4ff 100%)",
                        border: "none",
                        color: "#000",
                        fontSize: "14px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      <span className="material-symbols-outlined fs-5 animate-spin-slow">
                        explore
                      </span>
                      LAUNCH NAVIGATOR
                    </button>
                  </div>

                  <div className="col-12 col-md-7 d-flex align-items-center">
                    <div
                      className="w-100 glass-card-black p-4 shadow-2xl overflow-hidden"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="small fw-black text-white tracking-widest opacity-80" style={{ letterSpacing: '0.15rem' }}>
                          PROGRESS
                        </span>
                        <span className="small fw-black text-emerald text-glow-emerald tracking-widest" style={{ letterSpacing: '0.1rem' }}>
                          ON TIME
                        </span>
                      </div>
                      <div
                        className="progress-premium-wrapper mb-4 rounded-pill"
                        style={{ height: "12px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <div
                          className="progress-premium-fill rounded-pill"
                          style={{
                            width: `${getProgress(activeLoad.status)}%`,
                            background: "linear-gradient(90deg, #6366f1, #3b82f6, #00d4ff)",
                            boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)",
                            height: '100%'
                          }}
                        ></div>
                      </div>
                      <div className="d-flex justify-content-between mt-3 px-1">
                        <div className="text-center">
                          <div className="xx-small fw-black text-white opacity-40 text-uppercase mb-1 tracking-widest">
                            Origin
                          </div>
                          <div className="small fw-bold text-white fs-6">
                            {activeLoad.pickups[0].city}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="xx-small fw-black text-white opacity-40 text-uppercase mb-1 tracking-widest">
                            Status
                          </div>
                          <div className="small fw-bold text-emerald fs-6">
                            {getStatusDisplay(activeLoad.status)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="xx-small fw-black text-white opacity-40 text-uppercase mb-1 tracking-widest">
                            Target
                          </div>
                          <div className="small fw-bold text-white fs-6">
                            {activeLoad.deliveries[0].city}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="opacity-10 mb-3">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "80px" }}
                    >
                      bedtime
                    </span>
                  </div>
                  <h3 className="fw-black text-white opacity-40">
                    No Active Runs
                  </h3>
                  <p className="text-white opacity-60">
                    Enjoy your downtime. New loads will appear here as they are
                    assigned.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PERFORMANCE QUICK STATS */}
        <div className="col-12 col-xl-4">
          <div className="d-flex flex-column gap-4 h-100">
            {/* Total Hours Card */}
            <div
              className="glass-card-stitch p-4 rounded-5 border border-white border-opacity-10 position-relative overflow-hidden hover-float transition-all flex-grow-1"
              style={{
                background:
                  "linear-gradient(135deg, rgba(43,221,102,0.15) 0%, rgba(0,0,0,0.4) 100%)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              {/* Decorative Glow */}
              <div
                className="position-absolute top-0 end-0 p-5 opacity-10"
                style={{ transform: "translate(30%, -30%)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "120px", color: "#2bdd66" }}
                >
                  timer
                </span>
              </div>

              <div className="d-flex align-items-center gap-4 position-relative z-index-2">
                <div className="text-white d-flex align-items-center justify-content-center">
                  <span className="material-symbols-outlined fs-1">
                    schedule
                  </span>
                </div>
                <div>
                  <div className="x-small text-uppercase tracking-widest text-white opacity-40 fw-black mb-1">
                    Total Hours
                  </div>
                  <div
                    className="h1 fw-black text-white m-0 d-flex align-items-baseline gap-1"
                    style={{
                      fontFamily: "var(--font-syne)",
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {stats.hours}
                    <span className="fs-3 fw-bold text-white">hrs</span>
                  </div>
                  <div className="small text-emerald fw-bold mt-1 d-flex align-items-center gap-1">
                    <div
                      className="bg-emerald bg-opacity-20 rounded-pill px-2 py-0.5 d-flex align-items-center gap-1"
                      style={{ fontSize: "10px" }}
                    >
                      <span className="material-symbols-outlined fs-6">
                        {parseFloat(stats.hours) >= 100
                          ? "stars"
                          : parseFloat(stats.hours) >= 40
                            ? "verified"
                            : "person"}
                      </span>{" "}
                      {parseFloat(stats.hours) >= 100
                        ? "ELITE STATUS"
                        : parseFloat(stats.hours) >= 40
                          ? "PRO DRIVER"
                          : "STANDARD"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Miles Card */}
            <div
              className="glass-card-stitch p-4 rounded-5 border border-white border-opacity-10 position-relative overflow-hidden hover-float transition-all flex-grow-1"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,0,0,0.4) 100%)",
              }}
            >
              <div
                className="position-absolute top-0 end-0 p-5 opacity-10"
                style={{ transform: "translate(30%, -30%)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "120px", color: "#00d4ff" }}
                >
                  speed
                </span>
              </div>

              <div className="d-flex align-items-center gap-4 position-relative z-index-2">
                <div className="text-cyan d-flex align-items-center justify-content-center">
                  <span className="material-symbols-outlined fs-1">
                    distance
                  </span>
                </div>
                <div>
                  <div className="x-small text-uppercase tracking-widest text-white opacity-40 fw-black mb-1">
                    Total Miles
                  </div>
                  <div
                    className="h1 fw-black text-white m-0"
                    style={{
                      fontFamily: "var(--font-syne)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stats.miles.toLocaleString()}
                  </div>
                  <div
                    className="small text-cyan fw-bold mt-1"
                    style={{ fontSize: "10px", letterSpacing: "0.1em" }}
                  >
                    {stats.miles >= 4000
                      ? "ROAD WARRIOR"
                      : stats.miles >= 1000
                        ? "MILESTONE ACHIEVER"
                        : "FRESH RUNNER"}
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Loads */}
            <div
              className="glass-card-stitch p-4 rounded-5 border border-white border-opacity-10 position-relative overflow-hidden hover-float transition-all flex-grow-1"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)",
              }}
            >
              <div
                className="position-absolute top-0 end-0 p-5 opacity-10"
                style={{ transform: "translate(30%, -30%)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "120px", color: "#ffd700" }}
                >
                  emoji_events
                </span>
              </div>

              <div className="d-flex align-items-center gap-4 position-relative z-index-2">
                <div className="text-cyan d-flex align-items-center justify-content-center">
                  <span className="material-symbols-outlined fs-1">
                    task_alt
                  </span>
                </div>
                <div>
                  <div className="x-small text-uppercase tracking-widest text-white opacity-40 fw-black mb-1">
                    Missions Completed
                  </div>
                  <div
                    className="h1 fw-black text-white m-0 d-flex align-items-baseline gap-2"
                    style={{
                      fontFamily: "var(--font-syne)",
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {stats.completed}
                    <span className="fs-6 fw-black text-cyan opacity-75" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '0.15em', marginLeft: '4px' }}>
                      {stats.completed === 1 ? "LOAD" : "LOADS"}
                    </span>
                  </div>
                  <div
                    className="small text-cyan fw-bold mt-1"
                    style={{ fontSize: "10px", letterSpacing: "0.1em" }}
                  >
                    {stats.completed > 0
                      ? "EXCELLENT PERFORMANCE"
                      : "READY FOR MISSION"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
