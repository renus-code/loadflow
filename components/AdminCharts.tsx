/**
 * ======================================================================================
 * COMPONENT: AdminCharts (Visual Intelligence Dashboard)
 * ======================================================================================
 * A high-fidelity data visualization suite for fleet and load analytics.
 * 
 * Features:
 * 1. Volume Trends: Area charts tracking monthly load throughput (Completed vs Active).
 * 2. Status Distribution: Interactive pie charts for a real-time operational snapshot.
 * 3. Driver Performance: Leaderboards visualizing completion rates for top personnel.
 * 4. Route Analytics: Aggregated intelligence on transit efficiency and mileage.
 * 5. Recharts Integration: Uses premium, responsive SVG charts with custom kinetic tooltips.
 * ======================================================================================
 */
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { ILoad } from '@/models/Load';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { calculateMockRouteStatsSync } from '@/lib/maps';

interface AdminChartsProps {
  loads: any[];
  drivers: any[];
}

export default function AdminCharts({ loads, drivers }: AdminChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Monthly Trends Data
  const monthlyData = useMemo(() => {
    const months: Record<string, { name: string; completed: number; active: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      months[key] = { name: monthNames[d.getMonth()], completed: 0, active: 0 };
    }

    loads.forEach((load) => {
      const d = new Date(load.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (months[key]) {
        if (load.status === 'COMPLETED') {
          months[key].completed += 1;
        } else if (load.status !== 'CANCELLED') {
          months[key].active += 1;
        }
      }
    });

    return Object.values(months);
  }, [loads]);

  // 2. Load Status Distribution
  const statusData = useMemo(() => {
    const counts = { PENDING: 0, IN_TRANSIT: 0, DELIVERED: 0, COMPLETED: 0 };
    loads.forEach(load => {
      if (load.status === 'PENDING' || !load.status) counts.PENDING++;
      else if (load.status === 'IN_TRANSIT' || load.status === 'PICKED_UP') counts.IN_TRANSIT++;
      else if (load.status === 'DELIVERED') counts.DELIVERED++;
      else if (load.status === 'COMPLETED') counts.COMPLETED++;
    });
    
    return [
      { name: 'Pending', value: counts.PENDING, color: '#00d4ff' },
      { name: 'In Transit', value: counts.IN_TRANSIT, color: '#f59e0b' },
      { name: 'Delivered', value: counts.DELIVERED, color: '#9093ff' },
      { name: 'Completed', value: counts.COMPLETED, color: '#2bdd66' },
    ].filter(d => d.value > 0);
  }, [loads]);

  // 3. Driver Performance Data
  const driverPerformanceData = useMemo(() => {
    return drivers.map(driver => {
      const driverLoads = loads.filter(l => String(l.assignedDriverId?._id || l.assignedDriverId) === String(driver._id));
      const completed = driverLoads.filter(l => l.status === 'COMPLETED').length;
      const active = driverLoads.filter(l => l.status !== 'COMPLETED' && l.status !== 'CANCELLED').length;
      return {
        name: driver.name.split(' ')[0], // First name for compactness
        Completed: completed,
        Active: active,
      };
    }).sort((a, b) => (b.Completed + b.Active) - (a.Completed + a.Active)).slice(0, 5); // Top 5 drivers
  }, [loads, drivers]);

  // 4. Transit Times & Efficiency
  const avgTransitStats = useMemo(() => {
    let totalMiles = 0;
    let totalDuration = 0;
    let count = 0;

    loads.forEach(load => {
      let distance = load.totalDistance || 0;
      let duration = load.estimatedDuration || 0;

      if (!distance || !duration) {
         const stats = calculateMockRouteStatsSync(load.pickups || [], load.deliveries || []);
         distance = distance || stats.distance;
         duration = duration || stats.duration;
      }

      if (distance > 0) {
        totalMiles += distance;
        totalDuration += duration;
        count++;
      }
    });

    return {
      avgDistance: count > 0 ? Math.round(totalMiles / count) : 0,
      avgDuration: count > 0 ? (totalDuration / count).toFixed(1) : 0,
      totalVolume: count
    };
  }, [loads]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-stitch p-3 rounded-3" style={{ background: 'rgba(10, 15, 30, 0.95)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <p className="fw-black text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="small mb-1 fw-bold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!isMounted) return null;

  return (
    <div className="row g-4 animate-slide-up mt-1">
      {/* 1. MONTHLY TRENDS AREA CHART */}
      <div className="col-12 col-xl-8">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10 d-flex flex-column hover-float transition-all">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-black text-white m-0" style={{ fontFamily: 'var(--font-syne)' }}>Volume Trends</h4>
              <p className="small text-white opacity-70 m-0">Last 6 months load volume</p>
            </div>
            <div className="text-end d-none d-sm-block">
               <div className="fw-black h4 m-0 text-white">{avgTransitStats.totalVolume}</div>
               <div className="x-small text-uppercase tracking-widest opacity-40 text-white fw-bold">Total Recorded</div>
            </div>
          </div>
          <div className="w-100 mt-2">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} className="mobile-chart">
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2bdd66" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2bdd66" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }} tickLine={false} axisLine={false} />
                <YAxis className="desktop-only-axis" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="completed" name="Completed Loads" stroke="#2bdd66" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="active" name="Active Loads" stroke="#00d4ff" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. LOAD STATUS PIE CHART */}
      <div className="col-12 col-md-6 col-xl-4">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10 d-flex flex-column hover-float transition-all">
          <h4 className="fw-black text-white m-0" style={{ fontFamily: 'var(--font-syne)' }}>Status Distribution</h4>
          <p className="small text-white opacity-70 m-0 mb-3">Current snapshot of all loads</p>
          <div className="w-100 mt-2 position-relative">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}66)` }} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-100 w-100 d-flex align-items-center justify-content-center text-white opacity-20 small italic">No data available</div>
            )}
            {/* Center Label */}
            {statusData.length > 0 && (
               <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ pointerEvents: 'none' }}>
                  <div className="fw-black h3 m-0 text-white" style={{ lineHeight: 1 }}>{loads.length}</div>
                  <div className="x-small fw-bold text-white opacity-50 tracking-widest text-uppercase mt-1">Total</div>
               </div>
            )}
            </div>
          </div>
        </div>

      {/* 3. DRIVER PERFORMANCE BAR CHART */}
      <div className="col-12 col-md-6 col-xl-8">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10 d-flex flex-column hover-float transition-all">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-black text-white m-0" style={{ fontFamily: 'var(--font-syne)' }}>Top Drivers</h4>
              <p className="small text-white opacity-70 m-0">Performance by volume</p>
            </div>
            <div className="badge rounded-pill bg-white bg-opacity-10 text-white px-3 py-2 border border-white border-opacity-10">
              <i className="material-symbols-outlined text-orange fs-6 align-middle me-1">workspace_premium</i> Top 5
            </div>
          </div>
          <div className="w-100 mt-2">
               {driverPerformanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={driverPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={15} className="mobile-chart">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700 }} tickLine={false} axisLine={false} />
                    <YAxis className="desktop-only-axis" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                    <Bar dataKey="Completed" stackId="a" fill="#2bdd66" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Active" stackId="a" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
               ) : (
                 <div className="h-100 w-100 d-flex align-items-center justify-content-center text-white opacity-20 small italic">No drivers active</div>
               )}
          </div>
        </div>
      </div>

      {/* 4. ROUTE METRICS */}
      <div className="col-12 col-xl-4">
        <div className="glass-card-stitch p-4 h-100 rounded-5 border border-white border-opacity-10 d-flex flex-column hover-float transition-all position-relative overflow-hidden">
          {/* Background decoration */}
          <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'translate(20%, -20%)' }}>
             <span className="material-symbols-outlined" style={{ fontSize: '150px' }}>route</span>
          </div>

          <h4 className="fw-black text-white m-0 position-relative z-index-2" style={{ fontFamily: 'var(--font-syne)' }}>Route Analytics</h4>
          <p className="small text-white opacity-70 m-0 mb-4 position-relative z-index-2">Averages across all recorded routes</p>
          
          <div className="row g-3 flex-grow-1 position-relative z-index-2">
             <div className="col-12">
                <div className="p-3 rounded-4 bg-dark bg-opacity-50 border border-white border-opacity-10 d-flex align-items-center gap-3">
                   <div className="p-3 rounded-circle bg-indigo bg-opacity-20 text-indigo d-flex align-items-center justify-content-center">
                      <span className="material-symbols-outlined">map</span>
                   </div>
                   <div>
                      <div className="x-small text-uppercase tracking-widest text-white opacity-50 fw-bold">Average Distance</div>
                      <div className="h3 fw-black text-white m-0">{avgTransitStats.avgDistance} <span className="fs-6 opacity-50 fw-bold text-lowercase tracking-normal">miles</span></div>
                   </div>
                </div>
             </div>
             <div className="col-12">
                <div className="p-3 rounded-4 bg-dark bg-opacity-50 border border-white border-opacity-10 d-flex align-items-center gap-3">
                   <div className="p-3 rounded-circle bg-orange bg-opacity-20 text-orange d-flex align-items-center justify-content-center">
                      <span className="material-symbols-outlined">schedule</span>
                   </div>
                   <div>
                      <div className="x-small text-uppercase tracking-widest text-white opacity-50 fw-bold">Average Transit</div>
                      <div className="h3 fw-black text-white m-0">{avgTransitStats.avgDuration} <span className="fs-6 opacity-50 fw-bold text-lowercase tracking-normal">hours</span></div>
                   </div>
                </div>
             </div>
             <div className="col-12">
                <div className="p-3 rounded-4 bg-dark bg-opacity-50 border border-white border-opacity-10 d-flex align-items-center gap-3">
                   <div className="p-3 rounded-circle bg-emerald bg-opacity-20 text-emerald d-flex align-items-center justify-content-center">
                      <span className="material-symbols-outlined">moving</span>
                   </div>
                   <div>
                      <div className="x-small text-uppercase tracking-widest text-white opacity-50 fw-bold">Total Mileage</div>
                      <div className="h3 fw-black text-white m-0">{avgTransitStats.avgDistance * avgTransitStats.totalVolume} <span className="fs-6 opacity-50 fw-bold text-lowercase tracking-normal">miles</span></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .chart-area-volume { min-height: 300px; }
        .chart-area-pie { min-height: 250px; }
        .chart-area-bar { min-height: 250px; }
        
        @media (max-width: 768px) {
          .chart-area-volume { min-height: 220px; }
          .chart-area-pie { min-height: 220px; }
          .chart-area-bar { min-height: 220px; }
          
          /* Hide Y axis on mobile to save space, but keep tooltips */
          :global(.desktop-only-axis) {
             display: none;
          }
          :global(.mobile-chart .recharts-surface) {
             transform: translateX(-15px);
          }
        }
      `}</style>
    </div>
  );
}
