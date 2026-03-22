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
    <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center animate-fade-in z-3">
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 backdrop-blur-sm" onClick={onClose}></div>
      <div className="card shadow-lg border-0 rounded-4 position-relative z-1 p-4 w-100 mx-3 mx-md-auto" style={{ maxWidth: "450px" }}>
        <h4 className="fw-bold mb-3">Upload Proof of Delivery</h4>
        <p className="text-muted small">Please upload a clear image of the signed delivery receipt.</p>
        
        {error && <div className="alert alert-danger py-2">{error}</div>}
        
        <form onSubmit={handleUpload}>
          <div className="mb-4">
             <label htmlFor="pod-upload" className="form-label visually-hidden">Upload Proof of Delivery File</label>
             <input
               id="pod-upload"
               type="file"
               accept="image/*"
               className="form-control"
               title="Upload Proof of Delivery"
               onChange={(e) => setFile(e.target.files?.[0] || null)}
             />
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !file}>
              {loading ? "Uploading..." : "Upload POD"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
