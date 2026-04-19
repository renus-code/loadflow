"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ======================================================================================
 * COMPONENT: Resilience Gateway (Global Error Boundary)
 * ======================================================================================
 * A premium, box-less recovery screen that catches runtime crashes.
 * 
 * Features:
 * 1. Deep Interception: Catches React lifecycle crashes before they propagate to the window.
 * 2. Visual Recovery: Provides a high-fidelity experience even during failure, maintaining brand trust.
 * 3. Telemetry Ejection: Exposes stack traces strictly within development environments.
 * ======================================================================================
 */
class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 GLOBAL UI CRASH:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = "/dashboard";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="vh-100 d-flex align-items-center justify-content-center px-4"
          style={{ 
            background: "#04070e",
            color: "white",
            fontFamily: "var(--font-jakarta)"
          }}
        >
          {/* AMBIENT BACKGROUND GLOWS */}
          <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0 }}>
             <div 
               className="position-absolute rounded-circle" 
               style={{ 
                 width: '40vw', 
                 height: '40vw', 
                 background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)',
                 top: '-10%',
                 right: '-5%',
                 filter: 'blur(60px)'
               }}
             />
             <div 
               className="position-absolute rounded-circle" 
               style={{ 
                 width: '30vw', 
                 height: '30vw', 
                 background: 'radial-gradient(circle, rgba(45, 221, 102, 0.05) 0%, transparent 70%)',
                 bottom: '5%',
                 left: '-5%',
                 filter: 'blur(50px)'
               }}
             />
          </div>

          <div className="text-center position-relative" style={{ zIndex: 1, maxWidth: '500px' }}>
            {/* ANIMATED SHIELD ICON */}
            <div className="mb-5 d-flex justify-content-center">
              <div className="position-relative">
                <div 
                  className="position-absolute top-50 start-50 translate-middle rounded-circle border border-danger border-opacity-20 pulse-ring"
                  style={{ width: '120px', height: '120px' }}
                />
                <div 
                  className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center border border-danger border-opacity-30 shadow-2xl"
                  style={{ width: '80px', height: '80px' }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="display-5 fw-black mb-3 tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
              Stability <span className="text-danger">Interrupted</span>
            </h1>
            
            <p className="text-white text-opacity-50 mb-5 fs-6 leading-relaxed">
              We encountered an unexpected stability issue while processing the interface. Our resilience protocol has intercepted the crash.
            </p>

            <div className="d-flex flex-column gap-3">
              <button 
                onClick={this.handleReset}
                className="btn btn-danger py-3 rounded-pill fw-black tracking-widest text-uppercase shadow-lg hover-float transition-all border-0"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
              >
                Initiate Auto-Recovery
              </button>
              
              <Link 
                href="/" 
                className="btn btn-link text-white text-opacity-30 text-decoration-none small fw-bold tracking-widest hover-text-white transition-all"
              >
                RETURN TO LANDING PAGE
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-5 p-3 rounded-4 bg-white bg-opacity-05 border border-white border-opacity-05 text-start overflow-auto" style={{ maxHeight: '150px' }}>
                <code className="x-small text-danger opacity-70">
                  {this.state.error?.toString()}
                </code>
              </div>
            )}
          </div>

          <style jsx>{`
            .fw-black { font-weight: 900; }
            .pulse-ring {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.2); }
            }
            .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
            .hover-float:hover { transform: translateY(-3px); }
            .x-small { font-size: 0.7rem; }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
