"use client";

import { useState } from "react";
import { ILoad } from "@/models/Load";

interface DispatchTableProps {
  loads: ILoad[];
  onRowClick: (load: ILoad) => void;
}

export default function DispatchTable({ loads, onRowClick }: DispatchTableProps) {
  const [sortField, setSortField] = useState<string>("loadNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getStopSummary = (stops: any[], type: 'PICKED_UP' | 'DELIVERED') => {
    const completed = stops.filter(s => s.status === type).length;
    const isAll = completed === stops.length;
    return (
      <div className={`d-flex align-items-center gap-1 ${isAll ? 'text-emerald' : 'text-white opacity-40'}`}>
         <div className="progress flex-grow-1" style={{ height: '3px', width: '30px', background: 'rgba(255,255,255,0.05)' }}>
            <div className={`progress-bar ${isAll ? 'bg-emerald' : 'bg-indigo'}`} style={{ width: `${(completed/stops.length) * 100}%`, background: isAll ? '#2bdd66' : '#6366f1' }}></div>
         </div>
         <span className="x-small fw-bold">{completed}/{stops.length}</span>
      </div>
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'glow-yellow text-white border-warning border-opacity-20';
      case 'IN_TRANSIT': return 'glow-indigo-pill text-white border-primary border-opacity-20';
      case 'PICKED_UP': return 'glow-cyan text-white border-info border-opacity-20';
      case 'DELIVERED': return 'glow-emerald-pill text-white border-success border-opacity-20';
      case 'COMPLETED': return 'glow-green text-white border-success border-opacity-40';
      case 'CANCELLED': return 'glow-red text-white border-danger border-opacity-20';
      default: return 'bg-secondary bg-opacity-20 text-white';
    }
  };

  const sortedLoads = [...loads].sort((a: any, b: any) => {
    let aVal: any, bVal: any;
    if (sortField === 'pickup') { aVal = a.pickups[0]?.city; bVal = b.pickups[0]?.city; }
    else if (sortField === 'delivery') { aVal = a.deliveries[0]?.city; bVal = b.deliveries[0]?.city; }
    else if (sortField === 'driver') { aVal = a.assignedDriverId?.name || ''; bVal = b.assignedDriverId?.name || ''; }
    else { aVal = a[sortField]; bVal = b[sortField]; }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="table-responsive rounded-5 glass-card-stitch p-1 shadow-2xl">
      <table className="table table-hover align-middle mb-0 custom-table">
        <thead style={{ backgroundColor: 'rgba(25, 37, 64, 0.3)' }}>
          <tr className="border-0 small text-uppercase fw-black" style={{ color: '#a3aac4', letterSpacing: '0.15em', fontSize: '10px' }}>
            <th className="px-4 py-4 cursor-pointer border-0" onClick={() => handleSort('loadNumber')}>
              <div className="d-flex align-items-center gap-2">
                Load ID {sortField === 'loadNumber' && (sortOrder === 'asc' ? '↑' : '↓')}
              </div>
            </th>
            <th className="py-4 cursor-pointer border-0" onClick={() => handleSort('pickup')}>
               Origin {sortField === 'pickup' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-4 cursor-pointer border-0" onClick={() => handleSort('delivery')}>
               Destination {sortField === 'delivery' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-4 cursor-pointer border-0" onClick={() => handleSort('driver')}>
               Assignee {sortField === 'driver' && (sortOrder === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-4 border-0">Equipment</th>
            <th className="py-4 border-0">Status</th>
            <th className="px-4 py-4 text-end border-0"></th>
          </tr>
        </thead>
        <tbody className="border-0">
          {sortedLoads.length > 0 ? (
            sortedLoads.map((load: ILoad) => (
              <tr key={load._id.toString()} className="cursor-pointer transition-all border-bottom-subtle glass-wash" onClick={() => onRowClick(load)}>
                <td className="px-4 py-4">
                  <div className="d-flex align-items-center gap-3 text-white">
                     <div className="rounded-3 bg-glass-10 d-flex align-items-center justify-content-center border border-white border-opacity-10 shadow-sm" style={{ width: '36px', height: '36px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2bdd66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                     </div>
                     <span className="fw-black fs-6">#{load.loadNumber}</span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="d-flex align-items-start gap-2">
                    <div className="mt-1 opacity-50" style={{ color: '#2bdd66' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                      <div className="fw-black text-white small opacity-90">{load.pickups[0]?.city}, {load.pickups[0]?.state}</div>
                      {getStopSummary(load.pickups, 'PICKED_UP')}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="d-flex align-items-start gap-2">
                    <div className="mt-1 opacity-50 text-indigo" style={{ color: '#6366f1' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div>
                      <div className="fw-black text-white small opacity-90">{load.deliveries[0]?.city}, {load.deliveries[0]?.state}</div>
                      {getStopSummary(load.deliveries, 'DELIVERED')}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                   <div className="d-flex align-items-center gap-2">
                     <div className="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center border border-white border-opacity-10 x-small fw-black text-emerald transition-all hover-glow-emerald" style={{ width: '32px', height: '32px', color: '#2bdd66', boxShadow: '0 0 10px rgba(43, 221, 102, 0.1)' }}>
                       {(load.assignedDriverId as any)?.name?.[0] || '?'}
                     </div>
                     <span className="small fw-bold text-white opacity-80 letter-spacing-tight">{(load.assignedDriverId as any)?.name || 'Unassigned'}</span>
                   </div>
                </td>
                <td className="py-4">
                   <div className="badge border border-white border-opacity-10 rounded-3 px-2 py-1 text-white x-small fw-bold bg-white bg-opacity-5 shadow-sm">
                      {load.truckNumber || 'N/A'} / {load.trailerNumber || 'N/A'}
                   </div>
                </td>
                <td className="py-4">
                  <span className={`badge border rounded-pill px-3 py-2 fw-bold x-small d-inline-flex align-items-center gap-2 ${getStatusBadgeClass(load.status)}`}>
                    <div className="rounded-circle bg-current" style={{ width: '6px', height: '6px' }}></div>
                    {load.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 text-end">
                   <div className="btn-action shadow-sm border rounded-circle d-inline-flex align-items-center justify-content-center transition-all" style={{ width: '32px', height: '32px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                   </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-5 text-muted small fw-bold">No loads found in active workspace.</td>
            </tr>
          )}
        </tbody>
      </table>
      <style jsx>{`
        .custom-table { border-collapse: separate; border-spacing: 0; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.25s ease; }
        .border-bottom-subtle { border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .btn-action { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); border-color: rgba(255,255,255,0.1) !important; }
        .btn-action:hover { background: #2bdd66; color: #000; transform: translateX(3px); box-shadow: 0 5px 15px rgba(43, 221, 102, 0.3) !important; }
        .glow-emerald-pill { background: rgba(43, 221, 102, 0.1) !important; box-shadow: 0 0 15px rgba(43, 221, 102, 0.15); border: 1px solid rgba(43, 221, 102, 0.3) !important; }
        .glow-indigo-pill { background: rgba(99, 102, 241, 0.1) !important; box-shadow: 0 0 15px rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3) !important; }
        .glow-yellow { background: rgba(245, 158, 11, 0.1) !important; box-shadow: 0 0 15px rgba(245, 158, 11, 0.15); }
        .glow-cyan { background: rgba(6, 182, 212, 0.1) !important; box-shadow: 0 0 15px rgba(6, 182, 212, 0.15); }
        .glow-red { background: rgba(239, 68, 68, 0.1) !important; box-shadow: 0 0 15px rgba(239, 68, 68, 0.15); }
        .glow-green { background: rgba(16, 185, 129, 0.2) !important; box-shadow: 0 0 15px rgba(16, 185, 129, 0.25); }
        .fw-black { font-weight: 900; }
        .x-small { font-size: 0.7rem; }
      `}</style>
    </div>
  );
}
