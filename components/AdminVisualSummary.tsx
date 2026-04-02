"use client";

// Dashboard Stats: Displays the circular progress rings and top-level analytics.

import React from 'react';

interface AdminVisualSummaryProps {
  loads: any[];
  drivers: any[];
}

export default function AdminVisualSummary({ loads, drivers }: AdminVisualSummaryProps) {
  const totalLoads = loads.length;
  const pendingLoads = loads.filter(l => l.status === 'PENDING').length;
  const completedLoads = loads.filter(l => l.status === 'COMPLETED').length;

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
              <p className="small text-white opacity-70 m-0">Real-time logistics analytics</p>
            </div>
            <div className="badge rounded-pill bg-emerald bg-opacity-10 text-emerald px-3 py-2 border border-emerald border-opacity-20" style={{ color: '#2bdd66' }}>
              Operational
            </div>
          </div>

          <div className="row g-3 flex-grow-1">
            <div className="col-md-6">
              <div className="premium-inner-card p-3 rounded-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-white opacity-80">Completion Rate</span>
                  <span className="small fw-black text-emerald" style={{ color: '#2bdd66' }}>
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
              <div className="premium-inner-card p-3 rounded-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-white opacity-80">Active Utilization</span>
                  <span className="small fw-black text-orange" style={{ color: '#f59e0b' }}>
                    {totalLoads > 0 ? Math.round((loads.filter(l => l.status !== 'COMPLETED' && l.status !== 'CANCELLED').length / totalLoads) * 100) : 0}%
                  </span>
                </div>
                <div className="progress bg-dark bg-opacity-50 rounded-pill shadow-inner" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar bg-gradient-orange rounded-pill shadow-orange" 
                    style={{ width: `${totalLoads > 0 ? (loads.filter(l => l.status !== 'COMPLETED' && l.status !== 'CANCELLED').length / totalLoads) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="col-12 mt-4">
               {/* OPERATIONAL ANALYTICS DASHBOARD */}
               <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                  <span className="small text-white opacity-70 text-uppercase tracking-widest fw-black">Operational Analytics</span>
                  <div className="x-small text-emerald fw-bold d-flex align-items-center gap-2 bg-emerald bg-opacity-10 px-2 py-1 rounded-pill border border-emerald border-opacity-20">
                     <span className="pulse-dot"></span> Real-time Performance
                  </div>
               </div>

               <div className="row g-3">
                  {[
                     { 
                        label: 'Fleet Utilization', 
                        value: drivers.length > 0 ? Math.round((drivers.filter(d => loads.some(l => l.assignedDriverId === (d as any)._id && l.status !== 'COMPLETED')).length / drivers.length) * 100) : 0, 
                        color: '#00d4ff', 
                        icon: 'speed',
                        desc: 'Active Duty'
                     },
                     { 
                        label: 'Operational Efficiency', 
                        value: totalLoads > 0 ? Math.round((completedLoads / totalLoads) * 100) : 0, 
                        color: '#2bdd66', 
                        icon: 'trending_up',
                        desc: 'Completion'
                     },
                     { 
                        label: 'Transit Health', 
                        value: totalLoads > 0 ? Math.round(100 - (pendingLoads / totalLoads * 40)) : 100, 
                        color: '#9093ff', 
                        icon: 'auto_graph',
                        desc: 'System Flow'
                     }
                   ].map((kpi, i) => (
                     <div key={i} className="col-12 col-md-4 mb-3 mb-md-0">
                        <div className="premium-inner-card p-4 p-md-3 rounded-5 border border-white border-opacity-5 text-center group h-100 d-flex flex-column align-items-center justify-content-center transition-all hover-float">
                           <div className="position-relative mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                              {/* SVG Circular Progress */}
                              <svg className="position-absolute w-100 h-100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                 <circle cx="50" cy="50" r="42" fill="none" stroke={kpi.color} strokeWidth="7" strokeOpacity="0.15" />
                                 <circle 
                                    cx="50" cy="50" r="42" fill="none" stroke={kpi.color} strokeWidth="7" strokeLinecap="round"
                                    strokeDasharray="263.89" 
                                    strokeDashoffset={263.89 - (263.89 * kpi.value) / 100}
                                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                                 />
                              </svg>
                              <div className="fw-black text-white h5 m-0 z-index-2 position-relative">{kpi.value}%</div>
                           </div>
                           <div className="text-white opacity-60 text-uppercase fw-black mb-1" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>{kpi.label}</div>
                           <div className="fw-bold" style={{ color: kpi.color, fontSize: '12px', letterSpacing: '0.1em' }}>{kpi.desc.toUpperCase()}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* DRIVER PERFORMANCE SUMMARY */}
      <div className="col-12 col-xl-5">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10 d-flex flex-column">
          <h4 className="fw-black text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>Driver Performance</h4>
          <div className="d-flex flex-column gap-2 overflow-auto no-scrollbar flex-grow-1" style={{ maxHeight: '310px' }}>
            {drivers.length === 0 ? (
              <p className="text-white opacity-30 small text-center py-5 italic mt-auto mb-auto">No drivers registered in system</p>
            ) : drivers.map(driver => {
              const stats = getDriverStats(driver._id);
              const efficiency = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
              const efficiencyColor = efficiency >= 80 ? '#2bdd66' : efficiency >= 40 ? '#f59e0b' : '#ef4444';
              return (
                <div key={driver._id} className="premium-inner-card p-2 px-3 rounded-pill mb-2 position-relative overflow-hidden border border-white border-opacity-5 transition-all hover-float hover-bg-white-10 group" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                  <div className="d-flex align-items-center justify-content-between h-100 pb-1">
                    <div className="d-flex align-items-center gap-3">
                      {/* AVATAR - COMPACT */}
                      <div className="rounded-circle bg-dark bg-opacity-80 border border-white border-opacity-20 d-flex align-items-center justify-content-center fw-black text-emerald shadow-lg avatar-initial" style={{ width: '44px', height: '44px', fontSize: '18px', flexShrink: 0 }}>
                        {driver.name ? driver.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      
                      <div className="d-flex flex-column justify-content-center">
                        <div className="fw-black text-white mb-0 tracking-tighter" style={{ fontSize: '0.95rem' }}>{driver.name}</div>
                        <div className="d-flex align-items-center gap-3">
                           <div className="text-white opacity-40 fw-black text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.08em' }}>
                              {stats.active} ACTIVE • {stats.completed} DONE
                           </div>
                           <div className="fw-black text-uppercase" style={{ fontSize: '9px', color: efficiencyColor, letterSpacing: '0.08em' }}>
                              {efficiency}% EFFICIENCY
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-end d-flex flex-column justify-content-center align-items-end pe-2">
                      <div className="fw-black text-white lh-1 total-loads-count group-hover-scale">{stats.total}</div>
                      <div className="text-uppercase tracking-widest total-loads-label">Total Loads</div>
                    </div>
                  </div>
                  
                  {/* FULL WIDTH EFFICIENCY BAR */}
                  <div className="position-absolute bottom-0 start-0 w-100 bg-white bg-opacity-5" style={{ height: '3px' }}>
                     <div className="h-100 transition-all duration-1000" style={{ width: `${efficiency}%`, backgroundColor: efficiencyColor, boxShadow: `0 0 10px ${efficiencyColor}66` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .premium-inner-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
        }
        .border-orange { border-color: rgba(245, 158, 11, 0.15); }
        .border-emerald { border-color: rgba(43, 221, 102, 0.15); }
        .border-cyan { border-color: rgba(0, 212, 255, 0.15); }
        .border-purple { border-color: rgba(168, 85, 247, 0.15); }
        .bg-gradient-emerald { background: linear-gradient(90deg, #2bdd66, #059669); }
        .bg-gradient-orange { background: linear-gradient(90deg, #f59e0b, #d97706); }
        .shadow-emerald { box-shadow: 0 0 10px rgba(43, 221, 102, 0.4); }
        .shadow-orange { box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
        .pulse-dot { width: 6px; height: 6px; background: #2bdd66; border-radius: 50%; display: inline-block; animation: pulse-glow 2s infinite; }
        @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(43, 221, 102, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(43, 221, 102, 0); } 100% { box-shadow: 0 0 0 0 rgba(43, 221, 102, 0); } }
        .group-hover-scale { transition: transform 0.3s ease; }
        .group:hover .group-hover-scale { transform: scale(1.15); color: #fff !important; }
        .hover-float:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.4) !important; }
        .avatar-initial {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
          text-shadow: 0 0 10px rgba(43, 221, 102, 0.3);
        }
        .total-loads-count { font-size: 1.8rem; letter-spacing: -0.05em; }
        .total-loads-label { font-size: 8px; opacity: 0.3; font-weight: 900; margin-top: -3px; }
        .fw-black { font-weight: 900; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .x-small { font-size: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
