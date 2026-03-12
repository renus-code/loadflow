"use client";

import { useState } from "react";

interface LoadFormProps {
  onSubmit: (newLoad: { origin: string; destination: string; weight: string; status: string }) => void;
}

export default function LoadForm({ onSubmit }: LoadFormProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!origin || !destination || !weight) {
      setError("All fields are required to create a load.");
      return;
    }

    onSubmit({ origin, destination, weight, status });
    
    // Reset form after submission
    setOrigin("");
    setDestination("");
    setWeight("");
    setStatus("Pending");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Post New Load</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Origin</label>
          <input
            type="text"
            placeholder="e.g. Toronto, ON"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 focus:border-indigo-500 transition-colors"
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Destination</label>
          <input
            type="text"
            placeholder="e.g. Montreal, QC"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Weight</label>
          <input
            type="text"
            placeholder="e.g. 45000 lbs"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            aria-label="Load Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 focus:border-indigo-500 transition-colors"
          >
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
      >
        Submit Load
      </button>
    </form>
  );
}
