"use client";

import { useState } from "react";

interface LoadFormProps {
  onSubmit: (newLoad: { origin: string; destination: string; weight: string; status: string }) => void;
}

export default function LoadForm({ onSubmit }: LoadFormProps) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    status: "Pending",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.origin || !formData.destination || !formData.weight) {
      setError("All fields are required to create a load.");
      return;
    }

    onSubmit(formData);
    
    // Reset form after submission
    setFormData({
      origin: "",
      destination: "",
      weight: "",
      status: "Pending",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card-header bg-white border-bottom px-4 px-md-5 py-4">
        <h2 className="fs-4 fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-syne)' }}>Create New Load</h2>
        <p className="text-secondary mt-1 small fw-medium mb-0">Enter the details for your new shipment.</p>
      </div>
      <div className="card-body p-4 p-md-5">
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
          {error && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 border-0">
              {error}
            </div>
          )}

          <div className="d-flex flex-column gap-2">
            <label htmlFor="origin" className="form-label fw-bold text-dark small mb-0">Origin</label>
            <input
              type="text"
              name="origin"
              id="origin"
              required
              placeholder="e.g. Chicago, IL"
              className="form-control form-control-lg bg-light border-secondary border-opacity-25 rounded-3 fs-6 p-3 shadow-none focus-ring focus-ring-dark"
              value={formData.origin}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex flex-column gap-2">
            <label htmlFor="destination" className="form-label fw-bold text-dark small mb-0">Destination</label>
            <input
              type="text"
              name="destination"
              id="destination"
              required
              placeholder="e.g. Dallas, TX"
              className="form-control form-control-lg bg-light border-secondary border-opacity-25 rounded-3 fs-6 p-3 shadow-none focus-ring focus-ring-dark"
              value={formData.destination}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex flex-column gap-2">
            <label htmlFor="weight" className="form-label fw-bold text-dark small mb-0">Weight</label>
            <input
              type="text"
              name="weight"
              id="weight"
              required
              placeholder="e.g. 40,000 lbs"
              className="form-control form-control-lg bg-light border-secondary border-opacity-25 rounded-3 fs-6 p-3 shadow-none focus-ring focus-ring-dark"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex flex-column gap-2">
            <label htmlFor="status" className="form-label fw-bold text-dark small mb-0">Status</label>
            <select
              name="status"
              id="status"
              className="form-select form-select-lg bg-light border-secondary border-opacity-25 rounded-3 fs-6 p-3 shadow-none focus-ring focus-ring-dark"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              type="submit"
              className="btn btn-dark w-100 rounded-3 py-3 fw-semibold shadow-sm"
            >
              Submit Load
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
