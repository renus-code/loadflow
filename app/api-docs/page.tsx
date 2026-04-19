/**
 * ======================================================================================
 * PAGE: API Documentation Explorer (Swagger UI)
 * ======================================================================================
 * Provides an interactive environment for developers to test and explore API endpoints.
 * 
 * Features:
 * 1. Interactive Explorer: Full Swagger UI integration for live endpoint testing.
 * 2. Dynamic Spec Loading: Fetches the latest OpenAPI manifest from '/api/swagger'.
 * 3. Client-Side Only: Utilizes Next.js dynamic imports to ensure zero SSR conflicts with Swagger UI.
 * 4. Professional Branding: Custom-themed top bar mimicking the official Swagger interface.
 * ======================================================================================
 */
"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  return (
    <div className="bg-white min-h-screen">
      {/* Native Swagger Topbar Mimic (Self-Contained & Centered) */}
      <div style={{ backgroundColor: '#1b1b1b', padding: '14px 0', borderBottom: '2px solid #89bf04', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          onClick={() => window.location.reload()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" style={{ height: '42px', width: '42px' }}>
            <circle cx="75" cy="75" r="75" fill="#89bf04"/>
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#1b1b1b" fontSize="63" fontWeight="bold">{"{...}"}</text>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#ffffff', fontWeight: '400', fontSize: '28px', fontFamily: 'sans-serif', lineHeight: '1' }}>
              Swagger
            </span>
            <span style={{ color: '#ffffff', opacity: '0.8', fontSize: '10px', fontFamily: 'sans-serif', marginTop: '2px', letterSpacing: '0.5px' }}>
              Supported by <strong style={{ fontWeight: '800', letterSpacing: '1px' }}>SMARTBEAR</strong>
            </span>
          </div>
        </div>
      </div>
      <div className="pt-2">
        <SwaggerUI url="/api/swagger" />
      </div>
    </div>
  );
}
