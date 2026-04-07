"use client";

// Interactive Loads Table: Shows all cargo assignments with filtering and sorting.

import { useState, useMemo } from "react";
import { ILoad, IStop } from "@/models/Load";

interface DispatchTableProps {
  loads: ILoad[];
  drivers: { _id: string; name: string }[];
  user: { role: string; name?: string };
  onDetails: (load: ILoad) => void;
  onEdit?: (load: ILoad) => void;
  onDelete?: (load: ILoad) => void;
}

export default function DispatchTable({
  loads,
  user,
  onDetails,
  onEdit,
  onDelete,
}: DispatchTableProps) {
  const [sortField, setSortField] = useState<keyof ILoad | 'pickup' | 'delivery' | 'driver'>("loadNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset to first page whenever loads change (e.g. via parent filter)
  useMemo(() => {
    setCurrentPage(1);
  }, [loads.length, loads[0]?._id]);

  const handleSort = (field: keyof ILoad | 'pickup' | 'delivery' | 'driver') => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const StopSummary = ({ stops, type }: { stops: IStop[]; type: 'PICKED_UP' | 'DELIVERED' }) => {
    const completed = stops.filter(s => s.status === type).length;
    const isAll = completed === stops.length;
    return (
      <div className={`d-flex align-items-center gap-1 ${isAll ? 'text-emerald' : 'text-white opacity-40'}`}>
         <div className="progress flex-grow-1" style={{ height: '3px', width: '30px', background: 'rgba(255,255,255,0.05)' }}>
            <div className={`progress-bar ${isAll ? 'bg-emerald' : 'bg-indigo'}`} style={{ width: `${(completed/stops.length) * 100}%`, background: isAll ? '#2bdd66' : '#6366f1' }}></div>
         </div>
          <span className="small fw-bold text-white opacity-90">{completed}/{stops.length}</span>
      </div>
    );
  };

  const StatusBadge = ({ status }: { status: ILoad['status'] }) => {
    const config: Record<ILoad['status'], { className: string; label: string }> = {
      'PENDING': { className: 'glow-yellow text-white border-warning border-opacity-20', label: 'PENDING' },
      'IN_TRANSIT': { className: 'glow-indigo-pill text-white border-primary border-opacity-20', label: 'IN TRANSIT' },
      'PICKED_UP': { className: 'glow-cyan text-white border-info border-opacity-20', label: 'PICKED UP' },
      'DELIVERED': { className: 'glow-emerald-pill text-white border-success border-opacity-20', label: 'DELIVERED' },
      'COMPLETED': { className: 'glow-green text-white border-success border-opacity-40', label: 'COMPLETED' },
      'CANCELLED': { className: 'glow-red text-white border-danger border-opacity-20', label: 'CANCELLED' },
    };
    const { className, label } = config[status] || { className: 'bg-secondary bg-opacity-20 text-white', label: status.replace('_', ' ') };

    return (
      <span className={`badge border rounded-pill px-2 py-1 fw-black text-uppercase d-inline-flex align-items-center gap-1 ${className} shadow-sm`} style={{ fontSize: '9px', letterSpacing: '0.05em' }}>
        <div className="rounded-circle bg-current" style={{ width: '5px', height: '5px' }}></div>
        {label}
      </span>
    );
  };

  const sortedLoads = useMemo(() => {
    return [...loads].sort((a: ILoad, b: ILoad) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      if (sortField === 'pickup') { aVal = a.pickups[0]?.city || ""; bVal = b.pickups[0]?.city || ""; }
      else if (sortField === 'delivery') { aVal = a.deliveries[0]?.city || ""; bVal = b.deliveries[0]?.city || ""; }
      else if (sortField === 'driver') { 
        const driver = a.assignedDriverId as unknown as { name?: string };
        const bDriver = b.assignedDriverId as unknown as { name?: string };
        aVal = driver?.name || ''; 
        bVal = bDriver?.name || ''; 
      }
      else { aVal = (a as any)[sortField] || ""; bVal = (b as any)[sortField] || ""; }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [loads, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedLoads.length / ITEMS_PER_PAGE);
  const paginatedLoads = sortedLoads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const MobileLoadCard = ({ load }: { load: ILoad }) => (
    <div 
      className="glass-card-stitch rounded-4 p-4 mb-3 border border-white border-opacity-10 shadow-lg animate-fade-in cursor-pointer hover-scale-102"
      onClick={() => onDetails(load)}
      style={{ transition: 'all 0.3s ease', background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-3 bg-dark bg-opacity-50 p-2 border border-white border-opacity-10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2bdd66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <span className="fw-black text-white fs-5">#{load.loadNumber}</span>
        </div>
        <StatusBadge status={load.status} />
      </div>

      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex align-items-start gap-3">
          <div className="mt-1 text-emerald">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <div>
             <div className="text-white-50 x-small fw-bold text-uppercase tracking-wider mb-1">Origin</div>
             <div className="fw-black text-white fs-6">{load.pickups[0]?.city}, {load.pickups[0]?.state}</div>
             <div className="mt-1"><StopSummary stops={load.pickups} type="PICKED_UP" /></div>
          </div>
        </div>

        <div className="d-flex align-items-start gap-3">
          <div className="mt-1 text-indigo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
             <div className="text-white-50 x-small fw-bold text-uppercase tracking-wider mb-1">Destination</div>
             <div className="fw-black text-white fs-6">{load.deliveries[0]?.city}, {load.deliveries[0]?.state}</div>
             <div className="mt-1"><StopSummary stops={load.deliveries} type="DELIVERED" /></div>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between pt-3 border-top border-white border-opacity-5">
        <div className="d-flex align-items-center gap-2">
          {(() => {
            const isDriverUnassigned = !load.assignedDriverId || typeof load.assignedDriverId === 'string';
            const driverName = !isDriverUnassigned && (load.assignedDriverId as any).name ? (load.assignedDriverId as any).name : "Unassigned";
            return (
              <>
                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${isDriverUnassigned ? 'bg-danger bg-opacity-20 text-danger' : 'bg-emerald bg-opacity-20 text-emerald'}`} 
                     style={{ width: '28px', height: '28px', fontSize: '10px', border: '1px solid currentColor' }}>
                  {driverName.charAt(0).toUpperCase()}
                </div>
                <span className={`text-uppercase fw-black x-small ${isDriverUnassigned ? 'text-danger opacity-75' : 'text-white'}`}>
                  {driverName}
                </span>
              </>
            );
          })()}
        </div>
        
        <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
           {onEdit && (
             <button onClick={() => onEdit(load)} className="btn btn-sm btn-glass-emerald p-2 rounded-3" title="Edit Load" aria-label="Edit Load"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
           )}
           <button onClick={() => onDetails(load)} className="btn btn-sm btn-glass-indigo px-3 rounded-pill fw-black x-small text-uppercase">Details</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dispatch-container">
      {/* DESKTOP TABLE VIEW */}
      <div className="d-none d-lg-block table-responsive rounded-4 overflow-hidden glass-card-stitch shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
        <table className="table table-hover align-middle mb-0 custom-table">
          <thead className="bg-dark bg-opacity-95">
            <tr className="border-0 text-uppercase fw-black" style={{ color: 'rgba(255,255,255,0.85)', letterSpacing: '0.12em', fontSize: '11px' }}>
              <th className="px-4 py-3 cursor-pointer border-0 header-text" onClick={() => handleSort('loadNumber')}>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ color: sortField === 'loadNumber' ? '#2bdd66' : 'white' }}>Load ID</span>
                  {sortField === 'loadNumber' && <span className="small" style={{ color: '#2bdd66' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer border-0 header-text" onClick={() => handleSort('pickup')}>
                 <div className="d-flex align-items-center gap-2">
                   <div style={{ width: '14px' }}></div> {/* Spacer for icon alignment */}
                   <span style={{ color: sortField === 'pickup' ? '#2bdd66' : 'white' }}>Origin</span>
                   {sortField === 'pickup' && <span className="small ms-2" style={{ color: '#2bdd66' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                 </div>
              </th>
              <th className="py-3 px-4 cursor-pointer border-0 header-text" onClick={() => handleSort('delivery')}>
                 <div className="d-flex align-items-center gap-2">
                   <div style={{ width: '14px' }}></div> {/* Spacer for icon alignment */}
                   <span style={{ color: sortField === 'delivery' ? '#2bdd66' : 'white' }}>Destination</span>
                   {sortField === 'delivery' && <span className="small ms-2" style={{ color: '#2bdd66' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                 </div>
              </th>
              <th className="py-3 px-4 cursor-pointer border-0 header-text text-center" onClick={() => handleSort('driver')}>
                 <span style={{ color: sortField === 'driver' ? '#2bdd66' : 'white' }}>Assignee</span>
                 {sortField === 'driver' && <span className="small ms-2" style={{ color: '#2bdd66' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
              </th>
              <th className="py-3 px-4 border-0 header-text text-center"><span style={{ color: 'white' }}>Status</span></th>
              {(onEdit || onDelete) && <th className="px-4 py-3 text-end border-0 header-text"><span style={{ color: 'white' }}>Actions</span></th>}
            </tr>
          </thead>
          <tbody className="border-0">
            {paginatedLoads.length > 0 ? (
              paginatedLoads.map((load: ILoad) => (
                <tr 
                  key={load._id.toString()} 
                  onClick={() => onDetails(load)}
                  className="cursor-pointer transition-all border-bottom-subtle item-row" 
                  style={{ height: '70px' }}
                >
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3 text-white">
                       <div className="rounded-3 bg-dark bg-opacity-70 d-flex align-items-center justify-content-center border border-white border-opacity-10 shadow-lg" style={{ width: '36px', height: '36px' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2bdd66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-100"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                       </div>
                       <span className="fw-black fs-6">#{load.loadNumber}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="d-flex align-items-start gap-2">
                      <div className="mt-1 opacity-90" style={{ color: '#2bdd66' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                        <div className="fw-black text-white" style={{ fontSize: '13px', lineHeight: '1.1' }}>{load.pickups[0]?.city}, {load.pickups[0]?.state}</div>
                        <div className="mt-1"><StopSummary stops={load.pickups} type="PICKED_UP" /></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="d-flex align-items-start gap-2">
                      <div className="mt-1 opacity-90 text-indigo" style={{ color: '#6366f1' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                      <div>
                        <div className="fw-black text-white" style={{ fontSize: '13px', lineHeight: '1.1' }}>{load.deliveries[0]?.city}, {load.deliveries[0]?.state}</div>
                        <div className="mt-1"><StopSummary stops={load.deliveries} type="DELIVERED" /></div>
                      </div>
                    </div>
                  </td>
                   <td className="py-3 px-4">
                      <div className="d-flex align-items-center justify-content-center gap-3">
                        {(() => {
                          const isDriverUnassigned = !load.assignedDriverId || typeof load.assignedDriverId === 'string';
                          const driverName = !isDriverUnassigned && (load.assignedDriverId as unknown as { name?: string }).name ? (load.assignedDriverId as unknown as { name: string }).name : "Unassigned";
                          return (
                            <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm ${isDriverUnassigned ? 'bg-danger bg-opacity-20 text-danger' : 'bg-dark bg-opacity-80 text-emerald'}`} 
                                 style={{ width: '32px', height: '32px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.1)' }}
                                 title={driverName}>
                              {driverName.charAt(0).toUpperCase()}
                            </div>
                          );
                        })()}
                        <span className={`text-uppercase fw-black ${typeof load.assignedDriverId === 'object' && load.assignedDriverId && 'name' in load.assignedDriverId ? 'text-white' : 'text-danger opacity-75'}`} style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                          {typeof load.assignedDriverId === 'object' && load.assignedDriverId && 'name' in load.assignedDriverId ? (load.assignedDriverId as any).name : 'UNASSIGNED'}
                        </span>
                      </div>
                   </td>
                  <td className="py-3 px-4 text-center">
                    <div className="d-inline-flex justify-content-center w-100">
                      <StatusBadge status={load.status} />
                    </div>
                  </td>
                  {(onEdit || onDelete) && (
                    <td className="px-4 text-end" style={{ border: 'none' }} onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex justify-content-end gap-2">
                         {onEdit && (
                          <button 
                            onClick={() => onEdit(load)}
                            className="btn btn-sm btn-glass-emerald px-3 rounded-3 fw-bold border-0 shadow-sm"
                            title="Edit Load"
                          >
                            Edit
                          </button>
                         )}
                         {onDelete && (user?.role === 'Admin' || user?.role === 'Dispatcher') && (
                          <button 
                            onClick={() => onDelete(load)}
                            className={`btn btn-sm ${user.role === 'Admin' ? 'btn-glass-danger' : 'btn-glass-warning'} px-3 rounded-3 fw-bold border-0 shadow-sm`}
                            title={user.role === 'Admin' ? 'Delete Permanently' : 'Cancel Load'}
                          >
                            {user.role === 'Admin' ? 'Delete' : 'Cancel'}
                          </button>
                         )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-5 text-muted small fw-bold">No loads found in active workspace.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-lg-none d-flex flex-column gap-3">
        {paginatedLoads.length > 0 ? (
          paginatedLoads.map((load: ILoad) => (
            <MobileLoadCard key={load._id.toString()} load={load} />
          ))
        ) : (
          <div className="glass-card-stitch text-center py-5 rounded-4 border border-white border-opacity-10">
            <div className="text-white-50 small fw-bold">No loads found in active workspace.</div>
          </div>
        )}
      </div>

      {/* PREMIUM PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="mt-4 d-flex justify-content-center align-items-center gap-2 pb-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-sm glass-pagination-btn"
            title="Previous Page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-white bg-opacity-5 border border-white border-opacity-10 shadow-sm">
            <span className="fw-black text-white x-small opacity-100">PAGE</span>
            <span className="fw-black text-emerald x-small">{currentPage}</span>
            <span className="fw-black text-white x-small opacity-40">OF</span>
            <span className="fw-black text-white x-small">{totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-sm glass-pagination-btn"
            title="Next Page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}
      <style jsx>{`
        .custom-table { border-collapse: separate; border-spacing: 0; }
        .header-text { color: white !important; opacity: 1 !important; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.25s ease; }
        .border-bottom-subtle { border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .glow-emerald-pill { background: rgba(43, 221, 102, 0.1) !important; box-shadow: 0 0 15px rgba(43, 221, 102, 0.15); border: 1px solid rgba(43, 221, 102, 0.3) !important; }
        .glow-indigo-pill { background: rgba(99, 102, 241, 0.1) !important; box-shadow: 0 0 15px rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3) !important; }
        .btn-glass-indigo { background: rgba(99, 102, 241, 0.15); color: #9093ff; }
        .btn-glass-indigo:hover { background: rgba(99, 102, 241, 0.25); color: #fff; transform: translateY(-2px); }
        .btn-glass-emerald { background: rgba(43, 221, 102, 0.15); color: #2bdd66; border: 1px solid rgba(43, 221, 102, 0.3) !important; }
        .btn-glass-emerald:hover { background: rgba(43, 221, 102, 0.3); color: #fff; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(43, 221, 102, 0.2); }
        
        .btn-glass-warning { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3) !important; }
        .btn-glass-warning:hover { background: rgba(245, 158, 11, 0.3); color: #fff; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2); }
        
        .btn-glass-danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3) !important; }
        .btn-glass-danger:hover { background: rgba(239, 68, 68, 0.3); color: #fff; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2); }

        .item-row:hover { background: rgba(255, 255, 255, 0.03) !important; }
         .custom-table tr { background: transparent !important; }
         .custom-table tr:hover { background: transparent !important; }
        .glow-yellow { background: rgba(245, 158, 11, 0.1) !important; box-shadow: 0 0 15px rgba(245, 158, 11, 0.15); }
        .glow-cyan { background: rgba(6, 182, 212, 0.1) !important; box-shadow: 0 0 15px rgba(6, 182, 212, 0.15); }
        .glow-red { background: rgba(239, 68, 68, 0.1) !important; box-shadow: 0 0 15px rgba(239, 68, 68, 0.15); }
        .glow-green { background: rgba(16, 185, 129, 0.2) !important; box-shadow: 0 0 15px rgba(16, 185, 129, 0.25); }
        .fw-black { font-weight: 900; }
        .x-small { font-size: 0.8rem; }
        
        .glass-pagination-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          padding: 8px;
          border-radius: 12px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .glass-pagination-btn:hover:not(:disabled) {
          background: rgba(43, 221, 102, 0.1);
          border-color: rgba(43, 221, 102, 0.3);
          color: #2bdd66;
          transform: translateY(-2px);
        }
        .glass-pagination-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
