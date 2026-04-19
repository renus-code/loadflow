/**
 * ======================================================================================
 * COMPONENT: Dispatcher Analytics HUD
 * ======================================================================================
 * Delivers real-time operational intelligence to the dispatch team.
 * 
 * Features:
 * 1. Pipeline Funnel: Visualizes cargo distribution across lifecycle states using Recharts.
 * 2. Fleet Matrix: Tracks real-time driver availability (Idle vs Active) via cross-referencing loads.
 * 3. Dynamic Hydration: Memoizes complex array reductions to prevent render stalling.
 * ======================================================================================
 */
"use client";

import { useMemo, useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { ILoad } from '@/models/Load';

export default function DispatcherCharts({ loads, drivers }: { loads: ILoad[], drivers: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Funnel Data (Pending -> Assigned -> Picked Up -> In Transit -> Completed)
  const funnelData = useMemo(() => {
    const pending = loads.filter(l => l.status === 'PENDING').length;
    const assigned = loads.filter(l => l.status === 'ASSIGNED').length;
    const transit = loads.filter(l => l.status === 'IN_TRANSIT').length;
    const completed = loads.filter(l => l.status === 'COMPLETED').length;

    return [
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Assigned', value: assigned, color: '#00d4ff' },
      { name: 'In Transit', value: transit, color: '#a855f7' },
      { name: 'Completed', value: completed, color: '#2bdd66' },
    ];
  }, [loads]);

  // Active Drivers
  const activeDrivers = drivers.filter(d => loads.some(l => (l.assignedDriverId?._id === d._id || l.assignedDriverId === d._id) && l.status !== 'COMPLETED' && l.status !== 'CANCELLED'));
  const idleDrivers = drivers.filter(d => !activeDrivers.includes(d));

  if (!isMounted) return null;

  return (
    <div className="row g-4 animate-slide-up mt-1">
      {/* PIPELINE FUNNEL */}
      <div className="col-12 col-xl-6">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10 d-flex flex-column hover-float transition-all">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-black text-white m-0" style={{ fontFamily: 'var(--font-syne)' }}>Load Pipeline</h4>
              <p className="small text-white opacity-70 m-0">Live operations flow</p>
            </div>
            <div className="badge rounded-pill bg-white bg-opacity-10 text-white px-3 py-2 border border-white border-opacity-10">
              <i className="material-symbols-outlined text-orange fs-6 align-middle me-1">filter_alt</i> Pipeline
            </div>
          </div>
          <div className="w-100 mt-2">
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }} barSize={35}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 700 }} tickLine={false} axisLine={false} width={90} />
                   <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: 'rgba(10, 15, 20, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                      itemStyle={{ color: '#fff' }}
                   />
                   <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                     {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DRIVER AVAILABILITY MATRIX */}
      <div className="col-12 col-xl-6">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10 d-flex flex-column hover-float transition-all">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-black text-white m-0" style={{ fontFamily: 'var(--font-syne)' }}>Fleet Availability</h4>
              <p className="small text-white opacity-70 m-0">Live status of your drivers</p>
            </div>
            <div className="d-flex gap-3">
               <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill" style={{ background: 'rgba(43,221,102,0.1)', border: '1px solid rgba(43,221,102,0.2)' }}>
                  <span className="pulse-dot" style={{ background: '#2bdd66' }}></span>
                  <span className="x-small text-white fw-bold">IDLE ({idleDrivers.length})</span>
               </div>
               <div className="d-flex align-items-center gap-2 px-2 py-1 rounded-pill" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <span className="pulse-dot" style={{ background: '#f59e0b', animationDelay: '0.5s' }}></span>
                  <span className="x-small text-white fw-bold">ACTIVE ({activeDrivers.length})</span>
               </div>
            </div>
          </div>
          
          <div className="d-flex flex-wrap gap-3 overflow-auto custom-scrollbar pe-2" style={{ maxHeight: '250px' }}>
            {drivers.length === 0 ? (
               <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white opacity-30 italic small py-5">No drivers registered</div>
            ) : (
               drivers.map(d => {
                  const isActive = activeDrivers.includes(d);
                  return (
                     <div key={d._id} className="d-flex align-items-center p-2 rounded-4 border border-white border-opacity-10 transition-all group hover-float flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)', width: 'calc(50% - 0.5rem)', minWidth: '160px' }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-black shadow-lg me-3 position-relative flex-shrink-0" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', fontSize: '16px' }}>
                           {d.name ? d.name.charAt(0).toUpperCase() : '?'}
                           <span className="position-absolute bottom-0 end-0 rounded-circle border border-dark" style={{ width: '12px', height: '12px', background: isActive ? '#f59e0b' : '#2bdd66', transform: 'translate(15%, 15%)', boxShadow: `0 0 8px ${isActive ? '#f59e0b' : '#2bdd66'}` }}></span>
                        </div>
                        <div className="text-truncate flex-grow-1">
                           <div className="text-white fw-black text-truncate mb-1" style={{ fontSize: '0.9rem', letterSpacing: '-0.02em' }}>{d.name}</div>
                           <div className="text-uppercase tracking-widest fw-black px-2 py-0.5 rounded-pill d-inline-block" style={{ fontSize: '0.55rem', color: isActive ? '#f59e0b' : '#2bdd66', background: isActive ? 'rgba(245,158,11,0.15)' : 'rgba(43,221,102,0.15)' }}>
                              {isActive ? 'On A Run' : 'Available'}
                           </div>
                        </div>
                     </div>
                  );
               })
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
         .pulse-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; animation: pulse-glow 2s infinite; }
         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
         @keyframes pulse-glow {
           0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
           70% { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
           100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
         }
      `}</style>
    </div>
  );
}
