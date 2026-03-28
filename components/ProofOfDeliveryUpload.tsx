"use client";

import { useState } from "react";

export default function ProofOfDeliveryUpload({
  loadId,
  onUploadSuccess,
  onClose
}: {
  loadId: string;
  onUploadSuccess: () => void;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("loadId", loadId);

      const res = await fetch("/api/pods", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onUploadSuccess();
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center animate-fade-in" 
      style={{ zIndex: 2000 }}
    >
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 bg-black bg-opacity-70 backdrop-blur-xl" 
        onClick={onClose}
      ></div>
      
      <div 
        className="ether-card p-5 rounded-5 position-relative z-1 w-100 mx-3 mx-md-auto" 
        style={{ 
          maxWidth: "500px",
          background: "linear-gradient(145deg, rgba(6, 14, 32, 0.95), rgba(15, 23, 42, 0.95))",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 50px rgba(99, 102, 241, 0.1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center gap-3 mb-4">
          <div 
            className="p-2 rounded-3 border-ether"
            style={{ background: "rgba(99, 102, 241, 0.15)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h4 className="fw-black mb-0 text-uppercase tracking-tighter text-white fs-4" style={{ letterSpacing: "-0.5px" }}>
            Upload POD
          </h4>
        </div>

        <p className="text-white opacity-60 small fw-bold mb-4">
          Synchronizing mission data. Please upload the Proof of Delivery document to finalize stop status.
        </p>
        
        {error && (
          <div className="alert bg-danger bg-opacity-10 border border-danger border-opacity-20 text-danger small fw-bold mb-4 py-2 px-3 rounded-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <div 
              className="p-4 rounded-4 border border-dashed border-white border-opacity-10 text-center transition-all hover-glass cursor-pointer position-relative"
              style={{ background: "rgba(255, 255, 255, 0.02)" }}
            >
              <input
                id="pod-upload"
                type="file"
                accept="image/*"
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="py-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.4" className="mb-2">
                   <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                   <circle cx="8.5" cy="8.5" r="1.5"/>
                   <polyline points="21 15 16 10 5 21"/>
                </svg>
                <div className="small fw-black text-white opacity-80 mt-2">
                  {file ? file.name : "Select Stop Document"}
                </div>
                <div className="x-small text-white opacity-40 text-uppercase tracking-widest mt-1">
                  JPG, PNG or PDF (MAX 5MB)
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex justify-content-end gap-3 pt-2">
            <button 
              type="button" 
              className="btn btn-outline-white-glass px-4 py-2 rounded-pill fw-black text-uppercase small" 
              onClick={onClose} 
              disabled={loading}
              style={{ fontSize: "10px", letterSpacing: "1px" }}
            >
              Abort
            </button>
            <button 
              type="submit" 
              className="btn btn-indigo px-4 py-2 rounded-pill fw-black text-uppercase small shadow-glow-indigo" 
              disabled={loading || !file}
              style={{ fontSize: "10px", letterSpacing: "1px" }}
            >
              {loading ? "Transmitting..." : "Initialize Upload"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .fw-black { font-weight: 900; }
        .tracking-widest { letter-spacing: 0.15em; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .x-small { font-size: 0.65rem; }
        .text-uppercase { text-transform: uppercase; }
        
        .ether-card {
          overflow: hidden;
        }

        .btn-indigo {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-indigo:hover:not(:disabled) {
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
        .btn-outline-white-glass:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .shadow-glow-indigo {
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.4);
        }

        .hover-glass:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }

        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
}
