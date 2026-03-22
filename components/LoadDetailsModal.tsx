"use client";

import { useState } from "react";
import ProofOfDeliveryUpload from "@/components/ProofOfDeliveryUpload";

interface LoadDetailsModalProps {
  load: any; 
  user: any;
  drivers: any[];
  onClose: () => void;
  onUpdate: () => void;
}

export default function LoadDetailsModal({ load, user, drivers, onClose, onUpdate }: LoadDetailsModalProps) {
  const [selectedDriverId, setSelectedDriverId] = useState((load.assignedDriverId as any)?._id || load.assignedDriverId || "");
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
    } catch (err) { alert("Error assigning load"); }
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
    } catch (err) { alert("Error updating status"); }
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

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-2xl rounded-5 overflow-hidden glass-card">
          <div className="modal-header bg-dark text-white p-4 border-0">
            <div className="d-flex align-items-center gap-3">
               <div className="rounded-4 bg-primary bg-opacity-20 p-2 border border-primary border-opacity-25 shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
               </div>
               <div>
                  <h5 className="modal-title fw-bold mb-0 fs-3" style={{ fontFamily: 'var(--font-syne)' }}>Load #{load.loadNumber}</h5>
                  <p className="small text-white-50 mb-0 opacity-75">{load.pickups[0]?.city} &rarr; {load.deliveries[load.deliveries.length - 1]?.city}</p>
               </div>
            </div>
            <button type="button" className="btn-close btn-close-white opacity-50 hover-opacity-100 transition-all shadow-none" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 bg-light bg-opacity-50">
            <div className="row g-4 text-start">
              {/* STATUS TRACKER BAR */}
              <div className="col-12">
                 <div className="d-flex justify-content-between align-items-center px-2 mb-2">
                    {['PENDING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].map((node, i) => {
                       const isActive = load.status === node;
                       const isPast = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].indexOf(load.status) > i;
                       return (
                          <div key={node} className="d-flex flex-column align-items-center gap-2 flex-grow-1 position-relative">
                             <div className={`rounded-circle d-flex align-items-center justify-content-center border-3 transition-all ${isActive ? 'bg-primary border-primary shadow-glow' : isPast ? 'bg-success border-success' : 'bg-white border-light'}`} style={{ width: '28px', height: '28px', zIndex: 2 }}>
                                {isPast ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : <div className={`rounded-circle ${isActive ? 'bg-white' : 'bg-light'}`} style={{ width: '8px', height: '8px' }}></div>}
                             </div>
                             <span className={`x-small fw-bold text-uppercase tracking-wider ${isActive ? 'text-primary' : isPast ? 'text-success' : 'text-muted opacity-50'}`}>{node.replace('_', ' ')}</span>
                          </div>
                       );
                    })}
                 </div>
              </div>

              {/* LEFT COLUMN: SPECIFICATIONS & ASSIGNMENT */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white h-100">
                  <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                     <h6 className="fw-bold mb-0">Specifications</h6>
                  </div>
                  <div className="row g-4 mb-5">
                    <div className="col-6">
                      <label className="text-secondary x-small fw-bold text-uppercase tracking-widest opacity-50 mb-1">Quantity</label>
                      <div className="fw-bold fs-5">{load.quantity} <span className="small opacity-50">{load.quantityUnit}</span></div>
                    </div>
                    <div className="col-6">
                      <label className="text-secondary x-small fw-bold text-uppercase tracking-widest opacity-50 mb-1">Weight</label>
                      <div className="fw-bold fs-5">{load.weight} <span className="small opacity-50">{load.weightUnit}</span></div>
                    </div>
                  </div>

                  {(user.role === 'Admin' || user.role === 'Dispatcher') && load.status !== 'COMPLETED' && (
                    <div className="mt-auto">
                      <label className="text-secondary x-small fw-bold text-uppercase tracking-widest opacity-50 mb-3 d-block">Dispatcher Actions</label>
                      <div className="mb-3">
                        <select className="form-select border-light bg-light rounded-3 shadow-none fw-bold small py-2" value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)}>
                          <option value="">Choose Driver...</option>
                          {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                        </select>
                      </div>
                      <div className="row g-2 mb-3">
                        <div className="col-6"><input type="text" className="form-control border-light bg-light rounded-3 shadow-none fw-bold small p-2" value={truckNumber} onChange={(e) => setTruckNumber(e.target.value)} placeholder="TRK#" /></div>
                        <div className="col-6"><input type="text" className="form-control border-light bg-light rounded-3 shadow-none fw-bold small p-2" value={trailerNumber} onChange={(e) => setTrailerNumber(e.target.value)} placeholder="TRAILER#" /></div>
                      </div>
                      <button className="btn btn-primary w-100 rounded-3 fw-bold py-2 shadow-sm transition-all hover-float" onClick={handleAssign}>Update Assignment</button>
                    </div>
                  )}
                  {load.status === 'COMPLETED' && (
                     <div className="mt-auto p-3 rounded-4 bg-success bg-opacity-05 border border-success border-opacity-10 text-center">
                        <div className="text-success fw-bold mb-1">Load Finalized</div>
                        <p className="x-small text-muted m-0">This load has been verified and completed.</p>
                     </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: STOPS & POD */}
              <div className="col-md-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white h-100">
                  <div className="d-flex align-items-center gap-2 mb-4 text-info">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                     <h6 className="fw-bold mb-0">Execution Progress</h6>
                  </div>
                  
                  <div className="d-flex flex-column gap-3 mb-5">
                    {/* PICKUPS */}
                    {load.pickups.map((p: any, i: number) => (
                      <div key={`p-${i}`} className="p-3 border rounded-4 bg-light bg-opacity-25 d-flex justify-content-between align-items-center stop-row">
                        <div className="d-flex align-items-start gap-3">
                           <div className={`mt-1 rounded-circle d-flex align-items-center justify-content-center shadow-sm ${p.status === 'PICKED_UP' ? 'bg-success text-white' : 'bg-white text-muted border'}`} style={{ width: '24px', height: '24px' }}>
                              {p.status === 'PICKED_UP' ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : <span className="x-small fw-bold">P</span>}
                           </div>
                           <div style={{ maxWidth: '140px' }} className="text-truncate">
                              <div className="fw-bold small text-dark d-block text-truncate" title={p.address}>{p.address}</div>
                              <div className="x-small text-muted fw-medium">{p.city}, {p.state}</div>
                           </div>
                        </div>
                        {user.role === 'Driver' && p.status === 'PENDING' && load.status !== 'COMPLETED' && (
                          <button className="btn btn-sm btn-dark rounded-pill px-3 fw-bold shadow-sm transition-all hover-scale" onClick={() => handleUpdateStopStatus('pickups', i, 'PICKED_UP')}>Verify Pickup</button>
                        )}
                      </div>
                    ))}
                    {/* DELIVERIES */}
                    {load.deliveries.map((d: any, i: number) => (
                      <div key={`d-${i}`} className="p-3 border rounded-4 bg-light bg-opacity-25 d-flex justify-content-between align-items-center stop-row">
                        <div className="d-flex align-items-start gap-3">
                           <div className={`mt-1 rounded-circle d-flex align-items-center justify-content-center shadow-sm ${d.status === 'DELIVERED' ? 'bg-info text-white' : 'bg-white text-muted border'}`} style={{ width: '24px', height: '24px' }}>
                              {d.status === 'DELIVERED' ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : <span className="x-small fw-bold">D</span>}
                           </div>
                           <div style={{ maxWidth: '140px' }} className="text-truncate">
                              <div className="fw-bold small text-dark d-block text-truncate" title={d.address}>{d.address}</div>
                              <div className="x-small text-muted fw-medium">{d.city}, {d.state}</div>
                           </div>
                        </div>
                        {user.role === 'Driver' && d.status === 'PENDING' && allPickupsDone && load.status !== 'COMPLETED' && (
                          <button className="btn btn-sm btn-primary rounded-pill px-3 fw-bold shadow-sm transition-all hover-scale" onClick={() => handleUpdateStopStatus('deliveries', i, 'DELIVERED')}>Verify Delivery</button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* POD SECTION */}
                  <div className="mt-auto pt-4 border-top">
                    <h6 className="fw-bold mb-3 x-small text-uppercase text-secondary tracking-widest opacity-50">Verification & POD</h6>
                    <div className="d-grid gap-2">
                       { load.podUrl ? (
                         <div className="p-3 bg-success bg-opacity-05 rounded-4 border border-success border-opacity-10 text-center">
                            <div className="d-flex align-items-center justify-content-center gap-2 mb-2 text-success fw-bold small">
                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                               Document Verified
                            </div>
                            <div className="d-grid gap-2">
                               <a href={load.podUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-white border shadow-sm rounded-pill fw-bold small transition-all hover-float">View POD Document</a>
                               {(user.role === 'Admin' || user.role === 'Dispatcher') && load.status === 'DELIVERED' && (
                                 <button className="btn btn-sm btn-primary rounded-pill fw-bold small animate-pulse-slow border-0" onClick={handleCompleteLoad}>Review & Finalize Load</button>
                               )}
                            </div>
                         </div>
                       ) : load.status === 'IN_TRANSIT' && allDeliveriesDone && user.role === 'Driver' ? (
                         <div className="p-1 rounded-4">
                            <button 
                               className="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm"
                               onClick={() => setShowPODUpload(true)}
                             >
                               Upload Proof of Delivery
                             </button>
                             {showPODUpload && (
                               <ProofOfDeliveryUpload 
                                 loadId={load._id.toString()} 
                                 onUploadSuccess={() => { onUpdate(); setShowPODUpload(false); }} 
                                 onClose={() => setShowPODUpload(false)} 
                               />
                             )}
                             <p className="x-small text-center text-muted mt-2">POD upload required to trigger <span className="fw-bold text-success">DELIVERED</span> status</p>
                         </div>
                       ) : (
                         <div className="text-center p-3 bg-light bg-opacity-50 rounded-4 border border-dashed text-muted x-small fw-medium">
                           {load.status === 'COMPLETED' ? 'Documentation archived and verified.' : (!allDeliveriesDone ? 'Verification available after all deliveries.' : 'Awaiting driver documentation.')}
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
        .x-small { font-size: 0.65rem; }
        .glass-card { background: rgba(255, 255, 255, 0.95); }
        .shadow-glow { box-shadow: 0 0 15px rgba(99, 102, 241, 0.4); }
        .bg-opacity-05 { background: rgba(0,0,0,0.02); }
        .stop-row:hover { background: #fff !important; border-color: rgba(99, 102, 241, 0.2) !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .transition-all { transition: all 0.2s ease; }
        .hover-float:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1) !important; }
        .hover-scale:hover { transform: scale(1.05); }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.02); opacity: 0.8; } }
        .animate-pulse-slow { animation: pulse 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
