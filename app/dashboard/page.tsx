"use client";

import { useEffect, useState } from "react";
import { getLoads, LoadItem } from "@/lib/mockApi";

function formatStatus(status: string) {
  switch (status) {
    case "In Transit":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          In Transit
        </span>
      );
    case "Delivered":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Delivered
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          {status}
        </span>
      );
  }
}

export default function Dashboard() {
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLoads().then((data) => {
      setLoads(data);
      setIsLoading(false);
    });
  }, []);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate mock stats
  const totalLoads = loads.length || 5;
  const inTransit = loads.filter(l => l.status === "In Transit").length || 2;
  const delivered = loads.filter(l => l.status === "Delivered").length || 1;
  const pending = loads.filter(l => l.status === "Pending").length || 1;

  return (
    <div className="max-w-[1240px] mx-auto pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0f172a] font-syne tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-[15px] font-medium">{todayStr}</p>
        </div>
        <button className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2.5 rounded-lg font-semibold text-[15px] transition-colors shadow-sm flex items-center gap-2">
          <span>+</span>
          New load
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Loads", value: totalLoads, sub: "+3 this week" },
          { label: "In Transit", value: inTransit, sub: "2 on schedule" },
          { label: "Delivered", value: delivered, sub: "This month" },
          { label: "Pending", value: pending, sub: "Awaiting pickup" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100 flex flex-col relative w-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-11 h-11 rounded-[14px] bg-slate-50 border border-slate-100"></div>
              <div className="flex items-center text-emerald-500 font-bold text-xs gap-0.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10V2M6 2L2 6M6 2L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                12%
              </div>
            </div>
            <div className="text-[32px] font-bold text-[#0f172a] font-syne leading-none mb-2">{stat.value}</div>
            <div className="text-slate-600 font-semibold text-[15px]">{stat.label}</div>
            <div className="text-slate-400 text-sm mt-0.5 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* LOADS TABLE CONTAINER */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Table Header / Filters */}
        <div className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 gap-4">
          <h2 className="text-xl font-bold text-[#0f172a] font-syne">All Loads</h2>
          
          <div className="flex items-center gap-1 bg-white">
            <button className="bg-[#0f172a] text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
              All
            </button>
            <button className="text-slate-500 hover:text-slate-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              In Transit
            </button>
            <button className="text-slate-500 hover:text-slate-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              Pending
            </button>
            <button className="text-slate-500 hover:text-slate-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              Delivered
            </button>
            <button className="text-slate-500 hover:text-slate-900 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              Cancelled
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-4 text-sm font-semibold text-slate-400">Route</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Driver</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Weight</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Pickup</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-400">Rate</th>
                <th className="px-8 py-4 text-sm font-semibold text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-500">
                    Loading dashboard data...
                  </td>
                </tr>
              ) : (
                loads.map((load, index) => {
                  const pickupDate = new Date(load.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  // Mocking some display values based on the payload for exact UI matching
                  let driver = "Unassigned";
                  let rate = "$1,850";
                  if (load.status === "In Transit") {
                    driver = "Marcus Webb";
                    rate = "$2,400";
                  } else if (load.status === "Delivered") {
                    driver = "Tanya Rhodes";
                    rate = "$1,850";
                  } else if (load.status === "Pending") {
                    driver = "Unassigned";
                    rate = "$3,100";
                  }

                  return (
                    <tr key={load.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-semibold text-slate-700 text-[15px]">{load.origin}</div>
                        <div className="text-sm text-slate-400 mt-0.5">&rarr; {load.destination}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-600 font-medium text-[15px]">{driver}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-600 font-medium text-[15px]">{load.weight}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-slate-600 font-medium text-[15px]">{pickupDate}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[#0f172a] font-bold text-[15px]">{rate}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {formatStatus(load.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
