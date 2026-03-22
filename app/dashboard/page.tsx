"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import DispatchTable from "@/components/DispatchTable";
import LoadDetailsModal from "@/components/LoadDetailsModal";
import { User } from "@/context/AuthContext";
import { ILoad } from "@/models/Load";

// ─── STATE / PROVINCE DATA ────────────────────────────────────────────────────
const US_STATES: [string, string][] = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
  ['DC','District of Columbia'],
];

const CA_PROVINCES: [string, string][] = [
  ['AB','Alberta'],['BC','British Columbia'],['MB','Manitoba'],['NB','New Brunswick'],
  ['NL','Newfoundland and Labrador'],['NS','Nova Scotia'],['ON','Ontario'],
  ['PE','Prince Edward Island'],['QC','Quebec'],['SK','Saskatchewan'],
  ['NT','Northwest Territories'],['NU','Nunavut'],['YT','Yukon'],
];

const STATE_MAP = new Map<string, { name: string; country: string }>();
US_STATES.forEach(([code, name]) => {
  STATE_MAP.set(code.toUpperCase(), { name, country: 'United States' });
  STATE_MAP.set(name.toLowerCase(), { name, country: 'United States' });
});
CA_PROVINCES.forEach(([code, name]) => {
  STATE_MAP.set(code.toUpperCase(), { name, country: 'Canada' });
  STATE_MAP.set(name.toLowerCase(), { name, country: 'Canada' });
});

function resolveState(input: string) {
  if (!input) return undefined;
  return STATE_MAP.get(input.toUpperCase()) ?? STATE_MAP.get(input.toLowerCase());
}

function useCities(stateInput: string) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchCities = useCallback(async (input: string) => {
    const code = input.includes(' — ') ? input.split(' — ')[0].trim() : input;
    const info = resolveState(code);
    if (!info) { setCities([]); return; }
    setLoading(true);
    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: info.country, state: info.name }),
      });
      const json = await res.json();
      setCities(json?.data ?? []);
    } catch { setCities([]); } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    if (stateInput) fetchCities(stateInput);
    else setCities([]);
  }, [stateInput, fetchCities]);
  return { cities, loading };
}

const FIELD = "form-control rounded-4 p-3 border border-white border-opacity-50 bg-white bg-opacity-60 backdrop-blur-sm shadow-sm focus-ring-primary transition-all";

const ALL_REGIONS: [string, string, string][] = [
  ...US_STATES.map(([c, n]): [string, string, string] => [c, n, '🇺🇸']),
  ...CA_PROVINCES.map(([c, n]): [string, string, string] => [c, n, '🇨🇦']),
];

function StateProvinceSelect({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setQuery(value); }, [value]);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const q = query.trim().toUpperCase();
  const filtered = q.length === 0 ? ALL_REGIONS : ALL_REGIONS.filter(([code, name]) => code.startsWith(q) || name.toUpperCase().startsWith(q));
  return (
    <div ref={ref} className="position-relative">
      <input id={id} required autoComplete="off" spellCheck={false} className={FIELD} value={query} placeholder="State/Province (e.g. ON, IL)" onChange={e => { setQuery(e.target.value.toUpperCase()); onChange(e.target.value.toUpperCase()); setOpen(true); }} onFocus={() => setOpen(true)} />
      {open && filtered.length > 0 && (
        <ul className="list-unstyled position-absolute w-100 bg-white border rounded-4 shadow-lg mt-1 py-1" style={{ zIndex: 9999, maxHeight: '220px', overflowY: 'auto' }}>
          {filtered.map(([code, name, flag]) => (
            <li key={code}><button type="button" className="btn btn-link text-decoration-none text-dark w-100 text-start px-3 py-2 small fw-medium d-flex align-items-center gap-2" onMouseDown={() => { onChange(code); setQuery(code); setOpen(false); }}><span className="fw-bold text-primary" style={{ minWidth: '2rem' }}>{code}</span><span className="text-secondary">{name}</span><span className="ms-auto">{flag}</span></button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CitySelect({ stateCode, value, onChange, id }: { stateCode: string; value: string; onChange: (v: string) => void; id?: string }) {
  const { cities, loading } = useCities(stateCode);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setQuery(value); }, [value]);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const q = query.trim().toLowerCase();
  const filtered = cities.filter(city => city.toLowerCase().startsWith(q));
  return (
    <div ref={ref} className="position-relative">
      <input id={id} required autoComplete="off" className={FIELD} value={query} placeholder={loading ? 'Loading...' : 'City'} disabled={loading} onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
      {open && filtered.length > 0 && (
        <ul className="list-unstyled position-absolute w-100 bg-white border rounded-4 shadow-lg mt-1 py-1" style={{ zIndex: 9999, maxHeight: '220px', overflowY: 'auto' }}>
          {filtered.map(city => (<li key={city}><button type="button" className="btn btn-link text-decoration-none text-dark w-100 text-start px-3 py-2 small fw-medium" onMouseDown={() => { onChange(city); setQuery(city); setOpen(false); }}>{city}</button></li>))}
        </ul>
      )}
    </div>
  );
}

function LocationBlock({ type, index, data, onChange, onRemove, isRemovable }: { type: 'pickups' | 'deliveries', index: number, data: any, onChange: any, onRemove: any, isRemovable: boolean }) {
  const isPickup = type === 'pickups';
  return (
    <div className={`card border-0 shadow-sm rounded-4 p-4 bg-white bg-opacity-70 backdrop-blur-sm stop-card h-100 position-relative transition-all`} style={{ borderLeft: `6px solid ${isPickup ? '#6366f1' : '#10b981'}` }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="badge rounded-pill bg-light text-primary fw-bold px-3 py-2 border shadow-sm stop-label d-flex align-items-center gap-2">
          {type === 'pickups' ? '📦 PICKUP' : '🚚 DELIVERY'} #{index + 1}
        </span>
        {isRemovable && (
          <button type="button" className="btn btn-link text-danger p-0 text-decoration-none opacity-50 hover-opacity-100 transition-all" onClick={onRemove} title="Remove Stop">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>
      <div className="d-flex flex-column gap-3">
        <div className="row g-3">
          <div className="col-12"><label htmlFor={`${type}-${index}-address`} className="small fw-bold text-secondary mb-1 px-1 opacity-75">Address *</label><input id={`${type}-${index}-address`} required className={FIELD} value={data.address} onChange={e => onChange(type, index, 'address', e.target.value)} placeholder="123 Industrial Way" /></div>
          <div className="col-md-6"><label htmlFor={`${type}-${index}-state`} className="small fw-bold text-secondary mb-1 px-1 opacity-75">State / Province *</label><StateProvinceSelect id={`${type}-${index}-state`} value={data.state} onChange={v => { onChange(type, index, 'state', v); onChange(type, index, 'city', ''); }} /></div>
          <div className="col-md-6"><label htmlFor={`${type}-${index}-city`} className="small fw-bold text-secondary mb-1 px-1 opacity-75">City *</label><CitySelect id={`${type}-${index}-city`} stateCode={data.state} value={data.city} onChange={v => onChange(type, index, 'city', v)} /></div>
        </div>
        <div className="row g-3">
          <div className="col-md-5"><label className="small fw-bold text-secondary mb-1 opacity-75">Postal Code *</label><input required className={FIELD} value={data.postalCode} onChange={e => onChange(type, index, 'postalCode', e.target.value)} placeholder="M5V 2L7" /></div>
          <div className="col-md-7"><label className="small fw-bold text-secondary mb-1 opacity-75">Appt / PO # *</label><input required className={FIELD} value={data.appointmentNumber} onChange={e => onChange(type, index, 'appointmentNumber', e.target.value)} placeholder="A-998811" /></div>
        </div>
        <div className="row g-3">
          <div className="col-md-7"><label className="small fw-bold text-secondary mb-1 opacity-75">Date *</label><input required type="date" className={FIELD} value={data.date} onChange={e => onChange(type, index, 'date', e.target.value)} /></div>
          <div className="col-md-5"><label className="small fw-bold text-secondary mb-1 opacity-75">Time *</label><input required type="time" className={FIELD} value={data.time} onChange={e => onChange(type, index, 'time', e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}

// ─── INTERFACES ───────────────────────────────────────────────────────────────
interface Stop { address: string; city: string; state: string; postalCode: string; appointmentNumber: string; date: string; time: string; status: string; }
interface Load {
  _id: string; loadNumber: string; pickups: Stop[]; deliveries: Stop[]; quantity: number; quantityUnit: string; weight: number; weightUnit: string;
  status: "PENDING" | "IN_TRANSIT" | "PICKED_UP" | "DELIVERED" | "CANCELLED" | "COMPLETED";
  createdAt: string; trailerNumber?: string; truckNumber?: string; assignedDriverId?: { _id: string; name: string };
  podUrl?: string;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [drivers, setDrivers] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingLoadId, setEditingLoadId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [activeTab, setActiveTab] = useState<"loads" | "users">("loads");
  const [uploadingPodLoadId, setUploadingPodLoadId] = useState<string | null>(null);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initialStop = { address: "", city: "", state: "", postalCode: "", appointmentNumber: "", date: new Date().toISOString().split("T")[0], time: "", status: "PENDING" };
  const [formData, setFormData] = useState({ loadNumber: "", pickups: [{ ...initialStop }], deliveries: [{ ...initialStop }], quantity: "", quantityUnit: "pallets", weight: "", weightUnit: "lbs" });

  const setFormDataField = (field: string, value: string | number) => setFormData((prev) => ({ ...prev, [field]: value }));
  const setStopField = (type: "pickups" | "deliveries", index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newStops = [...prev[type]];
      newStops[index] = { ...newStops[index], [field]: value };
      return { ...prev, [type]: newStops };
    });
  };
  const addStop = (type: "pickups" | "deliveries") => setFormData((prev) => ({ ...prev, [type]: [...prev[type], { ...initialStop }] }));
  const removeStop = (type: "pickups" | "deliveries", index: number) => {
    setFormData((prev) => {
      if (prev[type].length <= 1) return prev;
      const newStops = [...prev[type]];
      newStops.splice(index, 1);
      return { ...prev, [type]: newStops };
    });
  };

  const fetchLoads = useCallback(async () => {
    try {
      const res = await fetch("/api/loads");
      if (res.ok) {
        let data = await res.json();
        // Role-based filtering for drivers (handled by API too, but extra safety)
        if (user?.role === 'Driver') {
          data = data.filter((l: ILoad) => (l.assignedDriverId as any)?._id === user.id || (l.assignedDriverId as any) === user.id);
        }
        setLoads(data);
      }
    } catch (error) { console.error("Failed to fetch loads:", error); } 
    finally { setIsLoading(false); }
  }, [user]);

  const fetchDrivers = useCallback(async () => {
    try {
      if (user?.role === "Admin" || user?.role === "Dispatcher") {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setDrivers(data.filter((u: { role: string }) => u.role === "Driver"));
        }
      }
    } catch (error) { console.error("Failed to fetch drivers:", error); }
  }, [user?.role]);

  useEffect(() => {
    if (user) {
      fetchLoads();
      fetchDrivers();
    }
  }, [user, fetchLoads, fetchDrivers]);

  // LISTEN FOR SIDEBAR EVENT
  useEffect(() => {
    const handleOpenModal = () => {
      setEditingLoadId(null);
      resetForm();
      setShowModal(true);
    };
    window.addEventListener('open-create-load', handleOpenModal);
    return () => window.removeEventListener('open-create-load', handleOpenModal);
  }, []);

  const resetForm = () => setFormData({ loadNumber: "", pickups: [{ ...initialStop }], deliveries: [{ ...initialStop }], quantity: "", quantityUnit: "pallets", weight: "", weightUnit: "lbs" });

  const handleCreateLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingLoadId ? `/api/loads/${editingLoadId}` : "/api/loads";
      const method = editingLoadId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setEditingLoadId(null);
        resetForm();
        fetchLoads();
      }
    } catch (error) { console.error("Failed to save load:", error); }
  };

  const handleEditLoad = (load: Load) => {
    setEditingLoadId(load._id);
    setFormData({
      loadNumber: load.loadNumber,
      pickups: load.pickups.map(p => ({ ...p, date: p.date.split('T')[0] })),
      deliveries: load.deliveries.map(d => ({ ...d, date: d.date.split('T')[0] })),
      quantity: load.quantity.toString(),
      quantityUnit: load.quantityUnit,
      weight: load.weight.toString(),
      weightUnit: load.weightUnit
    } as any);
    setShowModal(true);
  };

  const filteredLoads = loads.filter(l => {
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      l.loadNumber.toLowerCase().includes(searchLower) ||
      (l.assignedDriverId as any)?.name?.toLowerCase().includes(searchLower) ||
      l.pickups.some(p => p.city.toLowerCase().includes(searchLower)) ||
      l.deliveries.some(d => d.city.toLowerCase().includes(searchLower));
    
    return matchesStatus && matchesSearch;
  });

  const totalLoadsCount = loads.length;
  const transitCount = loads.filter((l) => l.status === "IN_TRANSIT").length;
  const deliveredCount = loads.filter((l) => l.status === "DELIVERED").length;
  const completedCount = loads.filter((l) => l.status === "COMPLETED").length;

  return (
    <div className="container-fluid px-0 animate-fade-in" style={{ maxWidth: "1600px" }}>
      {/* DASHBOARD HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 mt-3 gap-4 border-bottom pb-4 border-opacity-10 border-white">
        <div className="text-start">
          <h1 className="display-4 fw-black text-white m-0 tracking-tight premium-header-accent" style={{ fontFamily: "var(--font-syne)", letterSpacing: '-0.05em' }}>
            {user?.role === 'Driver' ? 'My Fleet' : <>{'Logistics '.split('').map((char, i) => <span key={i} className="text-gradient-emerald">{char}</span>)} Overview</>}
          </h1>
          <p className="text-white mt-2 fw-bold mb-0 opacity-40 text-uppercase small tracking-widest" style={{ letterSpacing: '0.2rem' }}>{todayStr}</p>
        </div>
        
        {/* QUICK SEARCH & FILTER - PREMIUM GLASS */}
        <div className="d-flex gap-2 bg-white bg-opacity-5 p-2 rounded-pill shadow-lg border border-white border-opacity-10 transition-all hover-bg-white-10">
          <div className="input-group input-group-sm border-end border-white border-opacity-10 pe-3" style={{ maxWidth: '280px' }}>
             <span className="input-group-text bg-transparent border-0 text-white opacity-25">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             </span>
             <input type="text" className="form-control border-0 bg-transparent text-white shadow-none px-1 small fw-medium" placeholder="Search loads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select className="form-select form-select-sm border-0 bg-dark bg-opacity-50 shadow-none small fw-bold cursor-pointer w-auto pe-4 text-white rounded-pill" style={{ color: '#2bdd66' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
             <option value="ALL" className="bg-dark text-white">All Status</option>
             {['PENDING', 'IN_TRANSIT', 'PICKED_UP', 'DELIVERED', 'COMPLETED'].map(s => <option key={s} value={s} className="bg-dark text-white">{s.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* STATS CARDS GRID - PREMIUM GLASS V4 */}
      <div className="row g-4 mb-5">
        {[
          user?.role === 'Driver' 
            ? { label: "My Assignments", value: totalLoadsCount, color: "var(--accent-emerald)", glow: "nebula-glow-emerald", icon: "local_shipping", bg: "linear-gradient(135deg, rgba(43, 221, 102, 0.12) 0%, rgba(43, 221, 102, 0.05) 100%)" }
            : { label: "Active Loads", value: totalLoadsCount, color: "var(--accent-emerald)", glow: "nebula-glow-emerald", icon: "local_shipping", bg: "linear-gradient(135deg, rgba(43, 221, 102, 0.12) 0%, rgba(43, 221, 102, 0.05) 100%)" },
          
          user?.role === 'Driver'
            ? { label: "Running", value: transitCount, color: "var(--accent-orange)", glow: "nebula-glow-orange", icon: "route", bg: "linear-gradient(135deg, rgba(255, 140, 0, 0.12) 0%, rgba(255, 140, 0, 0.05) 100%)" }
            : { label: "In Transit", value: transitCount, color: "var(--accent-orange)", glow: "nebula-glow-orange", icon: "route", bg: "linear-gradient(135deg, rgba(255, 140, 0, 0.12) 0%, rgba(255, 140, 0, 0.05) 100%)" },
            
          user?.role === 'Driver'
            ? { label: "Reached", value: deliveredCount, color: "#9093ff", glow: "nebula-glow-indigo", icon: "verified_user", bg: "linear-gradient(135deg, rgba(144, 147, 255, 0.12) 0%, rgba(144, 147, 255, 0.05) 100%)" }
            : { label: "Awaiting Verify", value: deliveredCount, color: "#9093ff", glow: "nebula-glow-indigo", icon: "verified_user", bg: "linear-gradient(135deg, rgba(144, 147, 255, 0.12) 0%, rgba(144, 147, 255, 0.05) 100%)" },
            
          user?.role === 'Driver'
            ? { label: "Done", value: completedCount, color: "#dee5ff", glow: "", icon: "task_alt", bg: "rgba(255, 255, 255, 0.03)" }
            : { label: "Completed", value: completedCount, color: "#dee5ff", glow: "", icon: "task_alt", bg: "rgba(255, 255, 255, 0.03)" },
        ].map((stat, i) => (
          <div key={i} className="col-12 col-md-6 col-xl-3">
            <div className={`glass-card-stitch p-4 rounded-4 position-relative overflow-hidden group ${stat.glow} h-100 d-flex flex-column animate-slide-up hover-float transition-all`} style={{ animationDelay: `${i * 100}ms`, background: stat.bg }}>
              <div className="position-absolute top-0 start-0 h-100" style={{ width: '6px', background: stat.color }}></div>
              <p className="text-uppercase fw-black mb-4" style={{ fontSize: '12px', letterSpacing: '0.2rem', color: '#a3aac4' }}>{stat.label}</p>
              <div className="d-flex align-items-end justify-content-between mt-auto position-relative z-index-2">
                 <h3 className="fw-black mb-0" style={{ color: '#fff', fontSize: '3.5rem', fontFamily: 'var(--font-syne)', letterSpacing: '-0.05em', lineHeight: '1' }}>{stat.value}</h3>
                 <span className="material-symbols-outlined stat-icon-bg">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DISPATCH table SECTION - GLASS V4 */}
      <div className="card border border-white border-opacity-10 shadow-2xl rounded-5 overflow-hidden bg-glass-5 backdrop-blur-3xl animate-slide-up">
        <div className="px-5 py-4 border-bottom border-white border-opacity-10 d-flex align-items-center justify-content-between bg-glass-5">
           <h3 className="fs-4 fw-black text-white m-0 d-flex align-items-center gap-3 premium-header-accent premium-header-accent-emerald" style={{ fontFamily: "var(--font-syne)" }}>
             <div className="d-flex align-items-center gap-2">
               Real-time <span className="text-emerald" style={{ color: '#2bdd66' }}>Board</span>
             </div>
           </h3>
           <div className="d-flex gap-2">
              <button className="btn btn-sm btn-dark border border-white border-opacity-10 bg-glass-5 text-white shadow-sm rounded-pill px-4 py-2 fw-black transition-all hover-bg-white-10" onClick={fetchLoads}>
                 <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                 Sync Data
              </button>
           </div>
        </div>
        <div className="table-responsive">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : filteredLoads.length === 0 ? (
            <div className="text-center py-5">
              <div className="opacity-10 mb-4 d-flex justify-content-center text-white">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <h3 className="fs-5 fw-black text-white opacity-40">No Dispatch Records</h3>
              <p className="text-white opacity-20 small">Satellite systems are clear. Try adjusting your filters.</p>
            </div>
          ) : (
            <DispatchTable loads={filteredLoads as any} onRowClick={(load) => setSelectedLoad(load as any)} />
          )}
        </div>
      </div>

      {/* MODALS */}
      {selectedLoad && (
        <LoadDetailsModal 
          load={selectedLoad as any} 
          user={user} 
          drivers={drivers} 
          onClose={() => setSelectedLoad(null)} 
          onUpdate={() => { fetchLoads(); setSelectedLoad(null); }} 
        />
      )}

      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center p-3 p-md-5 animate-fade-in overflow-y-auto no-scrollbar py-5" style={{ zIndex: 99999 }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-60 backdrop-blur-2xl" style={{ position: 'fixed' }} onClick={() => { setShowModal(false); window.dispatchEvent(new CustomEvent('close-create-load')); }}></div>
          <div className="card border-0 shadow-2xl rounded-5 glass-modal-v3 position-relative z-index-modal animate-slide-up my-auto" style={{ maxWidth: "1000px", width: "100%", borderRadius: '2.5rem' }}>
            <div className="d-flex justify-content-between align-items-center sticky-top glass-header-v3 p-4 p-md-5 pb-3 rounded-top-5" style={{ zIndex: 20, marginTop: '-1rem', marginLeft: '-0.5rem', marginRight: '-0.5rem' }}>
              <h3 className="fs-1 fw-black text-dark m-0 d-flex align-items-center gap-2" style={{ fontFamily: "var(--font-syne)", letterSpacing: "-0.05em" }}>
                {editingLoadId ? 'Edit' : 'Create New'} <span style={{ color: '#2bdd66' }}>Load</span>
              </h3>
              <button className="btn-close shadow-none opacity-40 hover-opacity-100 transition-all scale-125" onClick={() => { setShowModal(false); setEditingLoadId(null); resetForm(); window.dispatchEvent(new CustomEvent('close-create-load')); }} title="Close Modal"></button>
            </div>
            <form onSubmit={handleCreateLoad} className="p-4 p-md-5 pt-0 row g-5">
              <div className="col-12 text-start">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "45px", height: "45px", background: 'rgba(43, 221, 102, 0.1)', border: '1px solid rgba(43, 221, 102, 0.2)' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2bdd66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
                  <h5 className="fw-black text-dark m-0 text-uppercase tracking-widest opacity-80" style={{ fontSize: "0.85rem", color: '#444' }}>General Information</h5>
                </div>
                <hr className="mt-2 mb-4 opacity-5" />
                <div className="px-1">
                  <label htmlFor="loadNumberField" className="small fw-bold text-secondary mb-2 px-1 opacity-75">Load Reference Number *</label>
                  <input id="loadNumberField" required className={FIELD} value={formData.loadNumber} onChange={(e) => setFormDataField("loadNumber", e.target.value)} placeholder="e.g. #LD-882299" />
                </div>
              </div>

              <div className="col-12 text-start">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "45px", height: "45px", background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.27 6.96 12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></svg></div>
                    <h5 className="fw-black text-dark m-0 text-uppercase tracking-widest opacity-80" style={{ fontSize: "0.85rem", color: '#444' }}>Pickup Stops</h5>
                  </div>
                  <button type="button" className="btn btn-sm btn-emerald-pill fw-bold d-flex align-items-center gap-2 hover-float px-4 py-2 rounded-pill shadow-sm transition-all" onClick={() => addStop("pickups")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    Add Station
                  </button>
                </div>
                <hr className="mt-2 mb-4 opacity-5" />
                <div className="row g-4">
                  {formData.pickups.map((stop, idx) => (
                    <div key={idx} className="col-lg-6">
                      <LocationBlock type="pickups" index={idx} data={stop} onChange={setStopField} onRemove={() => removeStop("pickups", idx)} isRemovable={formData.pickups.length > 1} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 mt-4 text-start">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "45px", height: "45px", background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                    <h5 className="fw-black text-dark m-0 text-uppercase tracking-widest opacity-80" style={{ fontSize: "0.85rem", color: '#444' }}>Delivery Stops</h5>
                  </div>
                  <button type="button" className="btn btn-sm btn-emerald-pill fw-bold d-flex align-items-center gap-2 hover-float px-4 py-2 rounded-pill shadow-sm transition-all" onClick={() => addStop("deliveries")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    Add Destination
                  </button>
                </div>
                <hr className="mt-2 mb-4 opacity-5" />
                <div className="row g-4">
                  {formData.deliveries.map((stop, idx) => (
                    <div key={idx} className="col-lg-6">
                      <LocationBlock type="deliveries" index={idx} data={stop} onChange={setStopField} onRemove={() => removeStop("deliveries", idx)} isRemovable={formData.deliveries.length > 1} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 mt-5 text-start">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "45px", height: "45px", background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>
                  <h5 className="fw-black text-dark m-0 text-uppercase tracking-widest opacity-80" style={{ fontSize: "0.85rem", color: '#444' }}>Cargo Logistics</h5>
                </div>
                <hr className="mt-2 mb-4 opacity-5" />
              </div>

              <div className="col-md-3 text-start">
                <label className="small fw-bold text-secondary mb-2 px-1 opacity-75">Quantity *</label>
                <input required type="number" className={FIELD} value={formData.quantity} onChange={(e) => setFormDataField("quantity", e.target.value)} placeholder="24" />
              </div>
              <div className="col-md-3 text-start">
                <label className="small fw-bold text-secondary mb-2 px-1 opacity-75">Unit *</label>
                <select className={FIELD} value={formData.quantityUnit} onChange={(e) => setFormDataField("quantityUnit", e.target.value)}>
                  <option value="skids">Skids</option><option value="pallets">Pallets</option><option value="packages">Packages</option><option value="pieces">Pieces</option><option value="box">Box</option><option value="cases">Cases</option>
                </select>
              </div>
              <div className="col-md-3 text-start">
                <label className="small fw-bold text-secondary mb-2 px-1 opacity-75">Weight *</label>
                <input required type="number" className={FIELD} value={formData.weight} onChange={(e) => setFormDataField("weight", e.target.value)} placeholder="45000" />
              </div>
              <div className="col-md-3 text-start">
                <label className="small fw-bold text-secondary mb-2 px-1 opacity-75">Weight Unit *</label>
                <select className={FIELD} value={formData.weightUnit} onChange={(e) => setFormDataField("weightUnit", e.target.value)}>
                  <option value="lbs">lbs</option><option value="kg">kg</option>
                </select>
              </div>

              <div className="col-12 mt-5 pb-5 px-1">
                <button type="submit" className="btn btn-emerald w-100 rounded-pill py-4 fw-black fs-4 shadow-emerald-lg transition-all hover-float hover-scale active-scale-95 d-flex align-items-center justify-content-center gap-3">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                   {editingLoadId ? 'Confirm & Update Dispatch' : 'Complete & Launch Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .section-label { font-family: var(--font-syne); }
        .hover-float:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1) !important; }
        .hover-scale:hover { transform: scale(1.02); }
        .active-scale-95:active { transform: scale(0.95); }
        .tracking-tight { letter-spacing: -0.025em; }
        .z-index-modal { z-index: 100000; }
        .glass-modal-v3 { background: rgba(255, 255, 255, 0.9) !important; backdrop-filter: blur(15px); border: 1.5px solid rgba(255, 255, 255, 0.8); }
        .glass-header-v3 { background: rgba(255, 255, 255, 0.5) !important; backdrop-filter: blur(8px); }
        .shadow-2xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.25); }
        .shadow-emerald-lg { box-shadow: 0 20px 50px -10px rgba(43, 221, 102, 0.4); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .btn-emerald-pill { background: #2bdd66; color: #000; border: none; }
        .btn-emerald-pill:hover { background: #16a34a; color: #fff; }
        .btn-emerald { background: #2bdd66; color: #000; border: none; }
        .btn-emerald:hover { background: #16a34a; color: #fff; }
        .stop-card { background: rgba(255, 255, 255, 0.5) !important; border: 1px solid rgba(255, 255, 255, 0.6) !important; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .stop-card:hover { transform: translateY(-10px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important; }
        .fw-black { font-weight: 900; }
        input::placeholder { opacity: 0.3; }
      `}</style>
    </div>
  );
}
