"use client";

import React, { useEffect, useState } from "react";

interface AuditLog {
  _id: string;
  userId: { _id: string; name: string; email: string; role: string };
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const fetchLogs = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audit?page=${p}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATED') || action.includes('REGISTER') || action.includes('ACTIVATED')) return 'text-emerald bg-emerald bg-opacity-10 border-emerald-opacity';
    if (action.includes('UPDATED')) return 'text-indigo bg-indigo bg-opacity-10 border-indigo-opacity';
    if (action.includes('DELETED') || action.includes('CANCELLED')) return 'text-danger bg-danger bg-opacity-10 border-danger-opacity';
    if (action.includes('REVOKED')) return 'text-warning bg-warning bg-opacity-10 border-warning-opacity';
    return 'text-white text-opacity-75 bg-white bg-opacity-5 border-white border-opacity-10';
  };

  return (
    <div className="h-100 d-flex flex-column animate-fade-in">
      <div className="ether-card p-4 rounded-5 flex-grow-1 d-flex flex-column overflow-hidden">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-black text-white m-0 tracking-widest text-uppercase">Security Audit Trail</h5>
            <p className="text-white-50 x-small fw-bold m-0 mt-1">Immutable record of critical administrative and system actions</p>
          </div>
          <button onClick={() => fetchLogs(page)} className="btn btn-sm btn-outline-white-glass rounded-pill px-4 fw-bold x-small tracking-widest">
            {loading ? 'SYNCING...' : 'REFRESH'}
          </button>
        </div>

        <div className="flex-grow-1 overflow-auto custom-scrollbar pe-2">
          {loading && logs.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border text-indigo opacity-50" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0" style={{ '--bs-table-bg': 'transparent' } as any}>
                <thead className="position-sticky top-0" style={{ background: 'rgba(9, 19, 40, 0.95)', backdropFilter: 'blur(10px)', zIndex: 1 }}>
                  <tr>
                    <th className="border-0 text-white-50 x-small fw-bold text-uppercase tracking-widest py-3">Timestamp</th>
                    <th className="border-0 text-white-50 x-small fw-bold text-uppercase tracking-widest py-3">Actor</th>
                    <th className="border-0 text-white-50 x-small fw-bold text-uppercase tracking-widest py-3">Action</th>
                    <th className="border-0 text-white-50 x-small fw-bold text-uppercase tracking-widest py-3">Target</th>
                    <th className="border-0 text-white-50 x-small fw-bold text-uppercase tracking-widest py-3">Context / IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="align-middle border-bottom border-white border-opacity-5">
                      <td className="py-3">
                        <div className="text-white small fw-bold">{new Date(log.timestamp).toLocaleDateString()}</div>
                        <div className="text-white-50 x-small">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                      </td>
                      <td className="py-3">
                        {log.userId ? (
                          <>
                            <div className="text-white small fw-bold">{log.userId.name}</div>
                            <div className="text-white-50 x-small">{log.userId.email}</div>
                          </>
                        ) : (
                          <div className="text-white-50 small font-monospace">System / Unknown</div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`badge rounded-pill px-3 py-2 border ${getActionColor(log.action)} fw-black x-small tracking-widest`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3">
                        {log.entityType ? (
                          <>
                            <div className="text-white small fw-bold">{log.entityType}</div>
                            <div className="text-white-50 x-small font-monospace">{log.entityId}</div>
                          </>
                        ) : (
                          <div className="text-white-50 small">—</div>
                        )}
                      </td>
                      <td className="py-3" style={{ maxWidth: '300px' }}>
                        <div className="d-flex flex-wrap gap-1 mb-1">
                          {log.details && Object.entries(log.details).map(([k, v]) => (
                            <span key={k} className="badge bg-white bg-opacity-10 text-white-50 fw-normal border border-white border-opacity-10 px-2 font-monospace" style={{ fontSize: '0.65rem' }}>
                              {k}: {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </span>
                          ))}
                        </div>
                        {log.ipAddress && (
                          <div className="text-white-50 x-small font-monospace opacity-50">IP: {log.ipAddress}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-5 text-white-50">No audit logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-white border-opacity-10">
            <button 
              className="btn btn-sm btn-outline-white-glass rounded-pill px-4 fw-bold"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <span className="text-white-50 x-small fw-bold tracking-widest text-uppercase">Page {page} of {totalPages}</span>
            <button 
              className="btn btn-sm btn-outline-white-glass rounded-pill px-4 fw-bold"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-indigo { background-color: #6366f1; }
        .text-indigo { color: #818cf8; }
        .border-indigo-opacity { border-color: rgba(99, 102, 241, 0.3) !important; }
        
        .bg-emerald { background-color: #10b981; }
        .text-emerald { color: #34d399; }
        .border-emerald-opacity { border-color: rgba(16, 185, 129, 0.3) !important; }
        
        .border-danger-opacity { border-color: rgba(239, 68, 68, 0.3) !important; }
        .border-warning-opacity { border-color: rgba(245, 158, 11, 0.3) !important; }

        .btn-outline-white-glass {
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .btn-outline-white-glass:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
        }
        .btn-outline-white-glass:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .ether-card {
          background: rgba(6, 14, 32, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 0 30px rgba(99, 102, 241, 0.02), 0 10px 40px rgba(0, 0, 0, 0.4);
        }
        .x-small { font-size: 0.65rem; }
        .tracking-widest { letter-spacing: 0.15em; }
        .fw-black { font-weight: 900; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
