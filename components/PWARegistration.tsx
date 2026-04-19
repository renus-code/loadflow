/**
 * ======================================================================================
 * COMPONENT: Progressive Web App Service Worker Engine
 * ======================================================================================
 * Initializes the local service worker for offline capabilities and caching.
 * 
 * Features:
 * 1. Offline Resilience: Registers 'sw.js' to cache critical App Shell assets.
 * 2. Environment Aware: Gracefully bypasses if 'navigator' is missing (SSR).
 * ======================================================================================
 */
"use client";

import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW Registered:", reg.scope))
        .catch((err) => console.log("SW Registration Failed:", err));
    }
  }, []);

  return null;
}
