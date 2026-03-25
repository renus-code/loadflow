"use client";

import { useState } from "react";
import ProofOfDeliveryUpload from "@/components/ProofOfDeliveryUpload";
import { ILoad, IStop } from "@/models/Load";
import { User } from "@/context/AuthContext";

interface LoadDetailsModalProps {
  load: ILoad; 
  user: User;
  drivers: any[];
  onClose: () => void;
  onUpdate: () => void;
}

export default function LoadDetailsModal({ load, user, drivers, onClose, onUpdate }: LoadDetailsModalProps) {
  const [selectedDriverId, setSelectedDriverId] = useState(
    (load.assignedDriverId && typeof load.assignedDriverId === 'object' ? load.assignedDriverId._id : load.assignedDriverId) || ""
  );
  const [truckNumber, setTruckNumber] = useState(load.truckNumber || "");
  const [trailerNumber, setTrailerNumber] = useState(load.trailerNumber || "");
  const [showPODUpload, setShowPODUpload] = useState(false);

  const handleAssign = async () => {
    try {
      const res = await fetch(`/api/loads/${load._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedDriverId: selectedDriverId, truckNumber, trailerNumber })
      });
      if (res.ok) {
        onUpdate();
      } else {
        const data = await res.json();
        alert(data.error || "Assignment failed");
      }
    } catch (err) { 
      console.error("Assignment failed:", err);
      alert("Error assigning load"); 
    }
  };

  const handleUpdateStopStatus = async (type: 'pickups' | 'deliveries', index: number, stopStatus: string) => {
    try {
      const res = await fetch(`/api/loads/${load._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stopType: type, stopIndex: index, stopStatus })
      });
      if (res.ok) {
        onUpdate();
      } else {
        const data = await res.json();
        alert(data.error || "Status update failed");
      }
    } catch (err) { 
      console.error("Error updating stop status:", err);
      alert("Error updating status"); 
    }
  };

  const handleCompleteLoad = async () => {
    if (!window.confirm("Are you sure you want to mark this load as COMPLETED? Once completed, it cannot be modified.")) return;
    try {
      const res = await fetch(`/api/loads/${load._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      if (res.ok) {
        onUpdate();
        onClose();
      } else {
        const data = await res.json();
        alert(data.error || "Completion failed");
      }
    } catch (err) { alert("Error completing load"); }
  };

  const allPickupsDone = load.pickups.every((p: any) => p.status === 'PICKED_UP');
  const allDeliveriesDone = load.deliveries.every((d: any) => d.status === 'DELIVERED');

  const statusWorkflow = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'];
  const currentStatusIndex = statusWorkflow.indexOf(load.status);

  return (
    <div className="modal fade show d-block p-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(30px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border border-white border-opacity-10 shadow-2xl rounded-5 overflow-hidden glass-card-solid animate-slide-up" style={{ background: 'rgba(6, 14, 32, 0.85)', backdropFilter: 'blur(60px)', border: '1.5px solid rgba(255,255,255,0.12) !important' }}>
          {/* HEADER WITH SHIMMER */}
          <div className="modal-header p-4 border-0 glass-wash" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="d-flex align-items-center gap-3">
               <div className="rounded-4 d-flex align-items-center justify-content-center p-2 border border-emerald border-opacity-40 shadow-glow-emerald" style={{ background: 'rgba(43, 221, 102, 0.1)', width: '48px', height: '48px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2bdd66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
               </div>
               <div>
                  <h5 className="modal-title fw-black mb-0 fs-3 text-gradient-emerald" style={{ letterSpacing: '-0.02em', fontFamily: 'var(--font-syne)' }}>Load #{load.loadNumber}</h5>
                  <p className="small text-white opacity-40 mb-0 d-flex align-items-center gap-2">
                    {load.pickups[0]?.city} 
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald animate-pulse"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    {load.deliveries[load.deliveries.length - 1]?.city}
                  </p>
               </div>
            </div>
            <button type="button" className="btn-close btn-close-white opacity-50 hover-opacity-100 transition-all shadow-none" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 pt-2">
            <div className="row g-4 text-start">
              {/* STATUS TRACKER */}
              <div className="col-12 mt-4 mb-2">
                 <div className="d-flex justify-content-between align-items-center px-4 mb-4 position-relative">
                    {/* PROGRESS LINES */}
                    <div className="position-absolute h-1" style={{ top: '14px', left: '10%', width: '80%', background: 'rgba(255,255,255,0.08)', zIndex: 0 }}></div>
                    <div className="position-absolute h-1 transition-all duration-700" 
                         style={{ 
                           top: '14px', 
                           left: '10%', 
                           width: `${(currentStatusIndex / (statusWorkflow.length - 1)) * 80}%`, 
                           background: '#2bdd66', 
                           boxShadow: '0 0 10px rgba(43, 221, 102, 0.5)',
                           zIndex: 0 
                         }}></div>

                    {statusWorkflow.map((node, i) => {
                       const isActive = load.status === node;
                       const isPast = currentStatusIndex > i;
                       const isCompletedLoad = load.status === 'COMPLETED';
                       
                       // If load is completed, show all nodes as "confirmed" (ticks)
                       const shouldShowTick = isPast || (isActive && node !== 'COMPLETED') || isCompletedLoad;
                       
                       return (
                          <div key={node} className="d-flex flex-column align-items-center gap-2 flex-grow-1 position-relative" style={{ zIndex: 1 }}>
                             <div className={`rounded-circle d-flex align-items-center justify-content-center transition-all duration-500 ${isActive ? 'bg-emerald shadow-glow-emerald border-emerald scale-110' : (isPast || isCompletedLoad) ? 'bg-emerald bg-opacity-80 border-0' : 'bg-dark bg-opacity-50 border border-white border-opacity-20'}`} style={{ width: '28px', height: '28px', backdropFilter: 'blur(8px)' }}>
                                {shouldShowTick ? (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="animate-fade-in"><polyline points="20 6 9 17 4 12"/></svg>
                                ) : (
                                  <div className={`rounded-circle ${isActive ? 'bg-white' : 'bg-white opacity-10'}`} style={{ width: '8px', height: '8px' }}></div>
                                )}
                             </div>
                             <span className={`small fw-black text-uppercase ${isActive ? 'text-emerald' : (isPast || isCompletedLoad) ? 'text-white opacity-80' : 'text-white opacity-20'}`} style={{ fontSize: '9px', letterSpacing: '0.1em' }}>{node.replace('_', ' ')}</span>
                          </div>
                       );
                    })}
                 </div>
              </div>

              {/* DETAILS GRID */}
              <div className="col-md-6">
                <div className="card h-100 border-0 rounded-4 p-4 glass-card-premium" style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)' }}>
                  <div className="d-flex align-items-center gap-2 mb-4 text-emerald">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                     <h6 className="fw-black mb-0 text-uppercase text-white opacity-50" style={{ letterSpacing: '0.1em', fontSize: '11px' }}>Specifications</h6>
                  </div>
                  
                  <div className="row g-4 mb-5">
                    <div className="col-6">
                      <label className="text-white opacity-30 small fw-bold text-uppercase tracking-widest mb-1 d-block" style={{ fontSize: '9px' }}>Quantity</label>
                      <div className="fw-black fs-3 text-white">{load.quantity} <span className="small opacity-30 fw-medium">skids</span></div>
                    </div>
                    <div className="col-6">
                      <label className="text-white opacity-30 small fw-bold text-uppercase tracking-widest mb-1 d-block" style={{ fontSize: '9px' }}>Weight</label>
                      <div className="fw-black fs-3 text-white">{load.weight} <span className="small opacity-30 fw-medium">lbs</span></div>
                    </div>
                  </div>

                  <div className="mt-auto p-4 rounded-4 border border-white border-opacity-05 shadow-inner glass-card-stitch" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08) !important' }}>
                    <label className="text-white opacity-30 small fw-bold text-uppercase tracking-widest mb-3 d-block" style={{ fontSize: '9px', letterSpacing: '0.1em' }}>Logistics Assignment</label>
                    
                    {user.role === 'Admin' ? (
                      <div>
                        <div className="mb-3">
                          <label className="text-white opacity-20 x-small fw-bold d-block mb-1">ASSIGNED DRIVER</label>
                          <div className="fw-black text-white fs-6">{(load.assignedDriverId as any)?.name || 'UNASSIGNED'}</div>
                        </div>
                        <div className="row g-3">
                          <div className="col-6">
                            <label className="text-white opacity-20 x-small fw-bold d-block mb-1">TRUCK #</label>
                            <div className="fw-black text-white fs-6">{load.truckNumber || 'N/A'}</div>
                          </div>
                          <div className="col-6">
                            <label className="text-white opacity-20 x-small fw-bold d-block mb-1">TRAILER #</label>
                            <div className="fw-black text-white fs-6">{load.trailerNumber || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="d-grid gap-3">
                        <div>
                           <select className="form-select border-0 text-white fw-bold shadow-none py-2 rounded-3" 
                                   style={{ background: 'rgba(255,255,255,0.08)', fontSize: '13px', backdropFilter: 'blur(10px)' }}
                                   value={selectedDriverId} 
                                   onChange={(e) => setSelectedDriverId(e.target.value)}>
                             <option value="" className="bg-dark text-white">Choose Driver...</option>
                             {drivers.map(d => <option key={d._id} value={d._id} className="bg-dark text-white">{d.name}</option>)}
                           </select>
                        </div>
                        <div className="row g-2">
                           <div className="col-6"><input type="text" className="form-control border-0 text-white rounded-3 p-2 shadow-none fw-bold" style={{ background: 'rgba(255,255,255,0.08)', fontSize: '13px' }} value={truckNumber} onChange={(e) => setTruckNumber(e.target.value)} placeholder="TRK#" /></div>
                           <div className="col-6"><input type="text" className="form-control border-0 text-white rounded-3 p-2 shadow-none fw-bold" style={{ background: 'rgba(255,255,255,0.08)', fontSize: '13px' }} value={trailerNumber} onChange={(e) => setTrailerNumber(e.target.value)} placeholder="TRAILER#" /></div>
                        </div>
                        <button className="btn btn-emerald w-100 rounded-pill fw-black py-2 mt-2 shadow-glow-emerald" onClick={handleAssign}>Update Assignment</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* EXECUTION GRID */}
              <div className="col-md-6">
                <div className="card h-100 border-0 rounded-4 p-4 glass-card-premium" style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)' }}>
                  <div className="d-flex align-items-center gap-2 mb-4 text-indigo">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                     <h6 className="fw-black mb-0 text-uppercase text-white opacity-50" style={{ letterSpacing: '0.1em', fontSize: '11px' }}>Execution Progress</h6>
                  </div>

                  <div className="d-flex flex-column gap-3 mb-4">
                    {load.pickups.map((p: any, i: number) => (
                      <div key={`p-${i}`} className="p-3 border border-white border-opacity-05 rounded-4 d-flex justify-content-between align-items-center transition-all hover-glass" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="d-flex align-items-center gap-3 overflow-hidden">
                           <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0 ${p.status === 'PICKED_UP' ? 'bg-emerald text-white shadow-glow-emerald' : 'bg-dark bg-opacity-50 text-white opacity-20 border border-white border-opacity-10'}`} style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                              {p.status === 'PICKED_UP' ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : "P"}
                           </div>
                           <div className="text-truncate">
                              <div className="fw-black text-white fs-x-small text-truncate" title={p.address}>{p.address}</div>
                              <div className="x-small text-white opacity-30">{p.city}, {p.state}</div>
                           </div>
                        </div>
                        {user.role === 'Driver' && p.status === 'PENDING' && load.status !== 'COMPLETED' && (
                          <button className="btn btn-sm btn-emerald-glass px-3 rounded-pill fw-black x-small shadow-sm" onClick={() => handleUpdateStopStatus('pickups', i, 'PICKED_UP')}>VERIFY</button>
                        )}
                      </div>
                    ))}
                    {load.deliveries.map((d: any, i: number) => (
                      <div key={`d-${i}`} className="p-3 border border-white border-opacity-05 rounded-4 d-flex justify-content-between align-items-center transition-all hover-glass" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="d-flex align-items-center gap-3 overflow-hidden">
                           <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0 ${d.status === 'DELIVERED' ? 'bg-indigo text-white shadow-glow-indigo' : 'bg-dark bg-opacity-50 text-white opacity-20 border border-white border-opacity-10'}`} style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                              {d.status === 'DELIVERED' ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : "D"}
                           </div>
                           <div className="text-truncate">
                              <div className="fw-black text-white fs-x-small text-truncate" title={d.address}>{d.address}</div>
                              <div className="x-small text-white opacity-30">{d.city}, {d.state}</div>
                           </div>
                        </div>
                        {user.role === 'Driver' && d.status === 'PENDING' && allPickupsDone && load.status !== 'COMPLETED' && (
                          <button className="btn btn-sm btn-indigo-glass px-3 rounded-pill fw-black x-small shadow-sm" onClick={() => handleUpdateStopStatus('deliveries', i, 'DELIVERED')}>VERIFY</button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* VERIFICATION */}
                  <div className="mt-auto pt-4 border-top border-white border-opacity-10">
                    <label className="text-white opacity-30 x-small fw-black text-uppercase tracking-widest mb-3 d-block" style={{ letterSpacing: '0.1em' }}>Verification & POD</label>
                    <div className="d-grid gap-2">
                       { load.podUrl ? (
                         <div className="p-3 rounded-4 border border-emerald border-opacity-20 text-center shadow-sm glass-wash" style={{ background: 'rgba(43, 221, 102, 0.05)' }}>
                            <div className="d-flex align-items-center justify-content-center gap-2 mb-3 text-emerald fw-bold small">
                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                               Document Verified
                            </div>
                            <div className="d-grid gap-2">
                               <a href={load.podUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm glass-action-btn text-white rounded-pill fw-black x-small py-2">VIEW POD DOCUMENT</a>
                               {(user.role === 'Admin' || user.role === 'Dispatcher') && load.status === 'DELIVERED' && (
                                 <button className="btn btn-emerald w-100 rounded-pill fw-black py-2 mt-2 shadow-glow-emerald" onClick={handleCompleteLoad}>FINALIZE LOAD</button>
                               )}
                            </div>
                         </div>
                       ) : load.status === 'IN_TRANSIT' && allDeliveriesDone && user.role === 'Driver' ? (
                         <div className="p-1">
                             <button className="btn btn-emerald w-100 rounded-pill fw-black py-3 shadow-glow-emerald" onClick={() => setShowPODUpload(true)}>UPLOAD POD DOCUMENT</button>
                             {showPODUpload && (
                               <ProofOfDeliveryUpload 
                                 loadId={load._id.toString()} 
                                 onUploadSuccess={() => { onUpdate(); setShowPODUpload(false); }} 
                                 onClose={() => setShowPODUpload(false)} 
                               />
                             )}
                             <p className="x-small text-center text-white opacity-30 mt-3">Upload required for <span className="text-emerald fw-bold">DELIVERED</span> status</p>
                         </div>
                       ) : (
                         <div className="text-center p-3 rounded-4 border border-dashed border-white border-opacity-10 text-white opacity-20 x-small fw-black">
                           {load.status === 'COMPLETED' ? 'DOCUMENTATION ARCHIVED' : (!allDeliveriesDone ? 'AWAITING DELIVERIES' : 'AWAITING DOCUMENTATION')}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .fw-black { font-weight: 900; }
        .x-small { font-size: 0.65rem; }
        .fs-x-small { font-size: 0.75rem; }
        .shadow-glow-emerald { box-shadow: 0 0 20px rgba(43, 221, 102, 0.2); }
        .shadow-glow-indigo { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
        .btn-emerald { background: #2bdd66; color: #000; border: none; transition: all 0.2s ease; }
        .btn-emerald:hover { background: #25c158; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(43, 221, 102, 0.3); }
        .btn-emerald-glass { background: rgba(43, 221, 102, 0.15); color: #2bdd66; border: 1px solid rgba(43, 221, 102, 0.2); }
        .btn-indigo-glass { background: rgba(99, 102, 241, 0.15); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.2); }
        .glass-action-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        .glass-action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; transform: translateY(-1px); }
        .hover-glass:hover { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; }
        .h-1 { height: 1px; }
        
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(3px); opacity: 0.5; }
        }

        .duration-500 { transition-duration: 500ms; }
        .duration-700 { transition-duration: 700ms; }
      `}</style>
    </div>
  );
}
