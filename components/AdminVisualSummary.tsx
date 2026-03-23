"use client";

import React from 'react';

interface AdminVisualSummaryProps {
  loads: any[];
  drivers: any[];
}

export default function AdminVisualSummary({ loads, drivers }: AdminVisualSummaryProps) {
  const totalLoads = loads.length;
  const completedLoads = loads.filter(l => l.status === 'COMPLETED').length;
  const transitLoads = loads.filter(l => l.status === 'IN_TRANSIT' || l.status === 'PICKED_UP').length;
  const pendingLoads = loads.filter(l => l.status === 'PENDING').length;

  const getDriverStats = (driverId: string) => {
    const driverLoads = loads.filter(l => l.assignedDriverId?._id === driverId || l.assignedDriverId === driverId);
    return {
      total: driverLoads.length,
      active: driverLoads.filter(l => l.status !== 'COMPLETED' && l.status !== 'CANCELLED').length,
      completed: driverLoads.filter(l => l.status === 'COMPLETED').length
    };
  };

  return (
    <div className="row g-4 animate-slide-up">
      {/* PERFORMANCE OVERVIEW */}
      <div className="col-12 col-xl-7">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-black text-white m-0" style={{ fontFamily: 'var(--font-syne)' }}>System Performance</h4>
              <p className="small text-white opacity-40 m-0">Real-time logistics analytics</p>
            </div>
            <div className="badge rounded-pill bg-emerald bg-opacity-10 text-emerald px-3 py-2 border border-emerald border-opacity-20" style={{ color: '#2bdd66' }}>
              Operational
            </div>
          </div>

          <div className="row g-3 flex-grow-1">
            <div className="col-md-6">
              <div className="p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-white opacity-50">Completion Rate</span>
                  <span className="small fw-bold text-emerald" style={{ color: '#2bdd66' }}>
                    {totalLoads > 0 ? Math.round((completedLoads / totalLoads) * 100) : 0}%
                  </span>
                </div>
                <div className="progress bg-dark bg-opacity-50 rounded-pill shadow-inner" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-gradient-emerald rounded-pill shadow-emerald" 
                    style={{ width: `${totalLoads > 0 ? (completedLoads / totalLoads) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-white opacity-50">Active Utilization</span>
                  <span className="small fw-bold text-orange" style={{ color: '#f59e0b' }}>
                    {totalLoads > 0 ? Math.round((transitLoads / totalLoads) * 100) : 0}%
                  </span>
                </div>
                <div className="progress bg-dark bg-opacity-50 rounded-pill shadow-inner" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-gradient-orange rounded-pill shadow-orange" 
                    style={{ width: `${totalLoads > 0 ? (transitLoads / totalLoads) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="col-12">
               <div className="d-flex gap-3 justify-content-between mt-3 text-center">
                  <div className="flex-fill p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                     <div className="fw-black text-white h2 m-0">{pendingLoads}</div>
                     <div className="x-small text-white opacity-30 text-uppercase tracking-widest mt-1">Pending</div>
                  </div>
                  <div className="flex-fill p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                     <div className="fw-black text-white h2 m-0">{transitLoads}</div>
                     <div className="x-small text-white opacity-30 text-uppercase tracking-widest mt-1">Movement</div>
                  </div>
                  <div className="flex-fill p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5">
                     <div className="fw-black text-white h2 m-0">{completedLoads}</div>
                     <div className="x-small text-white opacity-30 text-uppercase tracking-widest mt-1">Delivered</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* DRIVER PERFORMANCE SUMMARY */}
      <div className="col-12 col-xl-5">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10">
          <h4 className="fw-black text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>Driver Performance</h4>
          <div className="d-flex flex-column gap-3 overflow-auto no-scrollbar" style={{ maxHeight: '200px' }}>
            {drivers.length === 0 ? (
              <p className="text-white opacity-30 small text-center py-4 italic">No drivers registered in system</p>
            ) : drivers.map(driver => {
              const stats = getDriverStats(driver._id);
              return (
                <div key={driver._id} className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-5 transition-all hover-translate-x">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-dark bg-opacity-50 border border-white border-opacity-10 d-flex align-items-center justify-content-center fw-bold text-emerald" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <div className="small fw-bold text-white mb-0">{driver.name}</div>
                      <div className="x-small text-white opacity-30">{stats.active} active • {stats.completed} completed</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="small fw-black text-white">{stats.total}</div>
                    <div className="x-small text-uppercase tracking-widest opacity-30">Loads</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-emerald { background: linear-gradient(90deg, #2bdd66, #059669); }
        .bg-gradient-orange { background: linear-gradient(90deg, #f59e0b, #d97706); }
        .shadow-emerald { box-shadow: 0 0 10px rgba(43, 221, 102, 0.4); }
        .shadow-orange { box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
        .hover-translate-x:hover { transform: translateX(5px); background: rgba(255, 255, 255, 0.1) !important; }
        .fw-black { font-weight: 900; }
        .x-small { font-size: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
