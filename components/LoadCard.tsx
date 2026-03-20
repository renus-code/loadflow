"use client";

import { LoadItem } from "@/lib/mockApi";
import Link from "next/link";

interface LoadCardProps {
  load: LoadItem;
  onDelete: (id: string) => void;
}

export default function LoadCard({ load, onDelete }: LoadCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Transit":
        return <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 py-2 px-3 fw-semibold">In Transit</span>;
      case "Delivered":
        return <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-2 px-3 fw-semibold">Delivered</span>;
      case "Pending":
        return <span className="badge rounded-pill bg-warning bg-opacity-10 text-dark border border-warning border-opacity-25 py-2 px-3 fw-semibold">Pending</span>;
      default:
        return <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 py-2 px-3 fw-semibold">{status}</span>;
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 text-start hover-shadow transition-shadow">
      <div className="card-body p-4 flex-column d-flex gap-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h3 className="fs-5 fw-bold text-dark m-0">{load.origin} &rarr; {load.destination}</h3>
            <p className="small text-secondary fw-semibold mt-1 mb-0">{load.weight}</p>
          </div>
          {getStatusBadge(load.status)}
        </div>
        
        <div className="d-flex flex-column my-3 p-3 bg-light rounded-3">
          <div className="d-flex justify-content-between mb-2">
            <span className="small fw-semibold text-secondary">Created</span>
            <span className="small fw-bold text-dark">{new Date(load.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="small fw-semibold text-secondary">Load ID</span>
            <span className="small fw-bold text-dark" style={{ fontFamily: 'monospace' }}>{load.id}</span>
          </div>
        </div>
        
        <div className="d-flex align-items-center justify-content-between mt-auto">
          <button
            onClick={() => onDelete(load.id)}
            className="btn btn-link text-danger text-decoration-none fw-semibold p-0"
          >
            Delete
          </button>
          <Link 
            href={`/dashboard/${load.id}`}
            className="btn btn-outline-dark fw-semibold rounded-3"
          >
            View Details
          </Link>
        </div>
      </div>
      <style jsx>{`
        .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
      `}</style>
    </div>
  );
}
