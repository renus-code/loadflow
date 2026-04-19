/**
 * ======================================================================================
 * COMPONENT: Bootstrap Client Initializer
 * ======================================================================================
 * Injects Bootstrap JS bundle exclusively on the client-side.
 * 
 * Features:
 * 1. SSR Safety: Prevents 'window is not defined' errors during Next.js rendering.
 * 2. Dynamic Import: Lazily evaluates the Bootstrap bundle to reduce initial payload.
 * ======================================================================================
 */
"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js" as any);
  }, []);

  return null;
}
