/**
 * ======================================================================================
 * COMPONENT: Global System Time Display
 * ======================================================================================
 * Provides a standardized real-time clock and date display used across all 
 * administrative and operational dashboards.
 * 
 * Features:
 * 1. Real-Time Updates: Increments every second using a persistent interval.
 * 2. High-Fidelity Formatting: Displays weekday, full date, and 12-hour time with seconds.
 * 3. Consistent Aesthetics: Uses emerald glow effects to match the platform's visual DNA.
 * ======================================================================================
 */
"use client";

import { useState, useEffect } from "react";

export default function SystemTimeDisplay() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentTime) return null;

  const todayStr = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return (
    <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mt-2 animate-fade-in">
      <p
        className="text-white fw-bold mb-0 opacity-40 text-uppercase small"
        style={{ letterSpacing: "0.2rem", fontSize: "0.65rem" }}
      >
        {todayStr}
      </p>
      <span className="opacity-20 text-white">•</span>
      <p
        className="text-emerald fw-bold mb-0 text-uppercase small"
        style={{ 
          letterSpacing: "0.15rem", 
          fontSize: "0.65rem", 
          color: "#2bdd66", 
          textShadow: "0 0 10px rgba(43,221,102,0.3)" 
        }}
      >
        {timeStr}
      </p>
    </div>
  );
}
