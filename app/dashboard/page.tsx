"use client";

import { useEffect, useState, useCallback, useRef } from "react";

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

// Maps code OR full name (lowercase) → { name, country } for API lookup
const STATE_MAP = new Map<string, { name: string; country: string }>();
US_STATES.forEach(([code, name]) => {
  STATE_MAP.set(code.toUpperCase(), { name, country: 'United States' });
  STATE_MAP.set(name.toLowerCase(), { name, country: 'United States' });
});
CA_PROVINCES.forEach(([code, name]) => {
  STATE_MAP.set(code.toUpperCase(), { name, country: 'Canada' });
  STATE_MAP.set(name.toLowerCase(), { name, country: 'Canada' });
});

// Resolve a typed value (code or full name) → STATE_MAP entry
function resolveState(input: string) {
  if (!input) return undefined;
  // Try exact code match first (e.g. "IL"), then by full name
  return STATE_MAP.get(input.toUpperCase()) ?? STATE_MAP.get(input.toLowerCase());
}

// ─── CITY FETCH HOOK ──────────────────────────────────────────────────────────
function useCities(stateInput: string) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = useCallback(async (input: string) => {
    // Strip " — Full Name" suffix if user selected a datalist option like "IL — Illinois"
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
    } catch {
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (stateInput) fetchCities(stateInput);
    else setCities([]);
  }, [stateInput, fetchCities]);

  return { cities, loading };
}

// ─── REUSABLE FIELD STYLE ─────────────────────────────────────────────────────
const FIELD = "form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50";

// All states + provinces as flat list for filtering
const ALL_REGIONS: [string, string, string][] = [
  ...US_STATES.map(([c, n]): [string, string, string] => [c, n, '🇺🇸']),
  ...CA_PROVINCES.map(([c, n]): [string, string, string] => [c, n, '🇨🇦']),
];

// ─── STATE/PROVINCE CUSTOM COMBOBOX ─────────────────────────────────────────────
function StateProvinceSelect({ value, onChange, id }: { value: string; onChange: (v: string) => void; id?: string }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Keep query in sync when parent resets the value (e.g. form reset)
  useEffect(() => { setQuery(value); }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter: code starts with query (case-insensitive) OR full name starts with query
  const q = query.trim().toUpperCase();
  const filtered = q.length === 0 ? ALL_REGIONS : ALL_REGIONS.filter(
    ([code, name]) => code.startsWith(q) || name.toUpperCase().startsWith(q)
  );

  const select = (code: string) => {
    onChange(code);
    setQuery(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="position-relative">
      <input
        id={id}
        required
        autoComplete="off"
        spellCheck={false}
        className={FIELD}
        value={query}
        placeholder="Type code (IL, ON…) or province name"
        onChange={e => {
          const val = e.target.value.toUpperCase();
          setQuery(val);
          onChange(val); // keep parent in sync while typing
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <ul
          className="list-unstyled position-absolute w-100 bg-white border border-secondary border-opacity-10 rounded-4 shadow mt-1 py-1"
          style={{ zIndex: 9999, maxHeight: '220px', overflowY: 'auto' }}
        >
          {filtered.map(([code, name, flag]) => (
            <li key={code}>
              <button
                type="button"
                className="btn btn-link text-decoration-none text-dark w-100 text-start px-3 py-2 small fw-medium d-flex align-items-center gap-2"
                style={{ borderRadius: 0 }}
                onMouseDown={() => select(code)}
              >
                <span className="fw-bold text-primary" style={{ minWidth: '2rem' }}>{code}</span>
                <span className="text-secondary">{name}</span>
                <span className="ms-auto">{flag}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── CITY CUSTOM COMBOBOX ──────────────────────────────────────────────────────────
function CitySelect({ stateCode, value, onChange, id }: { stateCode: string; value: string; onChange: (v: string) => void; id?: string }) {
  const { cities, loading } = useCities(stateCode);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter: city name starts with typed query
  const q = query.trim().toLowerCase();
  const filtered = cities.filter(city => city.toLowerCase().startsWith(q));

  const select = (city: string) => {
    onChange(city);
    setQuery(city);
    setOpen(false);
  };

  const placeholder = loading
    ? 'Loading cities…'
    : stateCode
    ? 'Type or select city…'
    : 'Select state / province first…';

  return (
    <div ref={ref} className="position-relative">
      <input
        id={id}
        required
        autoComplete="off"
        className={FIELD}
        value={query}
        placeholder={placeholder}
        disabled={loading}
        onChange={e => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <ul
          className="list-unstyled position-absolute w-100 bg-white border border-secondary border-opacity-10 rounded-4 shadow mt-1 py-1"
          style={{ zIndex: 9999, maxHeight: '220px', overflowY: 'auto' }}
        >
          {filtered.map(city => (
            <li key={city}>
              <button
                type="button"
                className="btn btn-link text-decoration-none text-dark w-100 text-start px-3 py-2 small fw-medium"
                style={{ borderRadius: 0 }}
                onMouseDown={() => select(city)}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── LOCATION BLOCK (shared by pickup + delivery) ─────────────────────────────
interface LocationBlockProps {
  prefix: 'pickup' | 'delivery';
  data: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

function LocationBlock({ prefix, data, onChange }: LocationBlockProps) {
  const P = (f: string) => `${prefix}${f.charAt(0).toUpperCase() + f.slice(1)}`;
  const isPickup = prefix === 'pickup';

  return (
    <div className="d-flex flex-column gap-3">
      {/* State / Province — first */}
      <div>
        <label className="small fw-semibold text-secondary mb-1 px-1">State / Province *</label>
        <StateProvinceSelect
          id={P('state')}
          value={data[P('state')]}
          onChange={v => { onChange(P('state'), v); onChange(P('city'), ''); }}
        />
      </div>

      {/* City — depends on state */}
      <div>
        <label className="small fw-semibold text-secondary mb-1 px-1">City *</label>
        <CitySelect
          id={P('city')}
          stateCode={data[P('state')]}
          value={data[P('city')]}
          onChange={v => onChange(P('city'), v)}
        />
      </div>

      {/* Street Address */}
      <div>
        <label className="small fw-semibold text-secondary mb-1 px-1">Street Address *</label>
        <input required className={FIELD} value={data[P('address')]} onChange={e => onChange(P('address'), e.target.value)}
          placeholder={isPickup ? '123 Origin St' : '456 Destination Blvd'} />
      </div>

      {/* Postal + Appointment # on same row */}
      <div className="row g-2">
        <div className="col-5">
          <label className="small fw-semibold text-secondary mb-1 px-1">Postal Code *</label>
          <input required className={FIELD} value={data[P('postalCode')]} onChange={e => onChange(P('postalCode'), e.target.value)}
            placeholder={isPickup ? 'M5V 2L7' : '75201'} />
        </div>
        <div className="col-7">
          <label className="small fw-semibold text-secondary mb-1 px-1">Appointment # *</label>
          <input required className={FIELD} value={data[P('appointmentNumber')]} onChange={e => onChange(P('appointmentNumber'), e.target.value)}
            placeholder={isPickup ? 'P-12345' : 'D-67890'} />
        </div>
      </div>

      {/* Date + Time */}
      <div className="row g-2">
        <div className="col-7">
          <label className="small fw-semibold text-secondary mb-1 px-1">{isPickup ? 'Pickup' : 'Delivery'} Date *</label>
          <input required type="date" className={FIELD} value={data[P('date')]} onChange={e => onChange(P('date'), e.target.value)} />
        </div>
        <div className="col-5">
          <label className="small fw-semibold text-secondary mb-1 px-1">Time *</label>
          <input required type="time" className={FIELD} value={data[P('time')]} onChange={e => onChange(P('time'), e.target.value)} />
        </div>
      </div>
    </div>
  );
}

// Update the interface to match MongoDB model
interface Load {
  _id: string;
  loadNumber: string;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupPostalCode: string;
  pickupAppointmentNumber: string;
  pickupDate: string;
  pickupTime: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPostalCode: string;
  deliveryAppointmentNumber: string;
  deliveryDate: string;
  deliveryTime: string;
  quantity: number;
  quantityUnit: string;
  weight: number;
  weightUnit: string;
  status: 'Pending' | 'Assigned' | 'Transit' | 'In Transit' | 'Delivered';
  createdAt: string;
}

function formatStatus(status: string) {
  const baseClasses = "badge rounded-pill py-2 px-3 fw-bold border shadow-sm transition-all hover-glow";
  switch (status) {
    case "Transit":
    case "In Transit":
      return (
        <span className={`${baseClasses} bg-info bg-opacity-10 text-info border-info border-opacity-25`}>
          <span className="d-inline-block rounded-circle bg-info me-2 pulse-slow" style={{ width: '8px', height: '8px' }}></span>
          In Transit
        </span>
      );
    case "Delivered":
      return (
        <span className={`${baseClasses} bg-success bg-opacity-10 text-success border-success border-opacity-25`}>
          <span className="d-inline-block rounded-circle bg-success me-2" style={{ width: '8px', height: '8px' }}></span>
          Delivered
        </span>
      );
    case "Pending":
      return (
        <span className={`${baseClasses} bg-warning bg-opacity-10 text-dark border-warning border-opacity-25`}>
          <span className="d-inline-block rounded-circle bg-warning me-2" style={{ width: '8px', height: '8px' }}></span>
          Pending
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-secondary bg-opacity-10 text-secondary border-secondary border-opacity-25`}>
          <span className="d-inline-block rounded-circle bg-secondary me-2" style={{ width: '8px', height: '8px' }}></span>
          {status}
        </span>
      );
  }
}

export default function Dashboard() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    loadNumber: "",
    pickupAddress: "",
    pickupCity: "",
    pickupState: "",
    pickupPostalCode: "",
    pickupAppointmentNumber: "",
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryPostalCode: "",
    deliveryAppointmentNumber: "",
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryTime: "",
    quantity: "",
    quantityUnit: "pallets",
    weight: "",
    weightUnit: "lbs"
  });

  // Generic field setter for use by LocationBlock
  const setField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const fetchLoads = async () => {
    try {
      const res = await fetch("/api/loads");
      if (res.ok) {
        const data = await res.json();
        setLoads(data);
      }
    } catch (error) {
      console.error("Failed to fetch loads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchLoads();
  }, []);

  const handleCreateLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/loads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          loadNumber: "",
          pickupAddress: "",
          pickupCity: "",
          pickupState: "",
          pickupPostalCode: "",
          pickupAppointmentNumber: "",
          pickupDate: new Date().toISOString().split('T')[0],
          pickupTime: "",
          deliveryAddress: "",
          deliveryCity: "",
          deliveryState: "",
          deliveryPostalCode: "",
          deliveryAppointmentNumber: "",
          deliveryDate: new Date().toISOString().split('T')[0],
          deliveryTime: "",
          quantity: "",
          quantityUnit: "pallets",
          weight: "",
          weightUnit: "lbs"
        });
        fetchLoads();
      }
    } catch (error) {
      console.error("Failed to create load:", error);
    }
  };

  const handleDeleteLoad = async (id: string) => {
    if (!confirm("Are you sure you want to delete this dispatch?")) return;
    try {
      const res = await fetch(`/api/loads/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchLoads();
      }
    } catch (error) {
      console.error("Failed to delete load:", error);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/loads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchLoads();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const todayStr = mounted ? new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "Loading...";

  const totalLoads = loads.length;
  const inTransit = loads.filter(l => (l.status as string) === "In Transit" || l.status === "Transit").length;
  const delivered = loads.filter(l => l.status === "Delivered").length;
  const pending = loads.filter(l => l.status === "Pending").length;

  return (
    <div className="container-fluid px-0 px-md-3 pb-5" style={{ maxWidth: '1280px' }}>
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3 animate-fade-in">
        <div>
          <h1 className="fs-1 fw-bold text-dark m-0 tracking-tight text-glow-primary" style={{ fontFamily: 'var(--font-syne)' }}>
            Overview
          </h1>
          <p className="text-secondary mt-1 fw-medium mb-0 opacity-75">{todayStr}</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn border-0 text-white fw-bold px-4 py-3 d-inline-flex align-items-center gap-2 rounded-4 shadow-lg hover-shadow-sm transition-all bg-gradient-primary hover-float" 
          style={{ letterSpacing: '0.02em' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create Load
        </button>
      </div>

      {/* ... (stats cards remain same) ... */}

      {/* STATS CARDS */}
      <div className="row g-4 mb-5">
        {[
          { 
            label: "Total Loads", value: totalLoads, sub: "Real-time sync",
            gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
            trend: "+12%"
          },
          { 
            label: "In Transit", value: inTransit, sub: "Live tracking",
            gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
            trend: "+4%"
          },
          { 
            label: "Delivered", value: delivered, sub: "Full validation",
            gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 10 0 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
            trend: "+22%"
          },
          { 
            label: "Pending", value: pending, sub: "Awaiting action",
            gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
            trend: "-2%"
          },
        ].map((stat, i) => (
          <div key={i} className={`col-12 col-sm-6 col-lg-3 animate-slide-up delay-${(i + 1) * 100}`}>
            <div className="card h-100 border-0 shadow-lg rounded-4 p-4 glass-card hover-float overflow-hidden" style={{ transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
              <div 
                className="position-absolute top-0 end-0 opacity-10" 
                style={{ transform: 'translate(20%, -20%) scale(2)', color: 'white' }}
              >
                {stat.icon}
              </div>
              <div className="card-body p-0 d-flex flex-column position-relative z-1">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div 
                    className="rounded-4 shadow-lg d-flex align-items-center justify-content-center text-white" 
                    style={{ width: '56px', height: '56px', background: stat.gradient }}
                  >
                    {stat.icon}
                  </div>
                  <div className={`d-flex align-items-center ${stat.trend.startsWith('+') ? 'text-success' : 'text-danger'} fw-bold gap-1 bg-white bg-opacity-75 px-3 py-1 rounded-pill shadow-sm border border-light`}>
                    {stat.trend}
                  </div>
                </div>
                <div className="fs-1 fw-bold text-dark mb-1 tracking-tight" style={{ fontFamily: 'var(--font-syne)', lineHeight: 1 }}>{stat.value}</div>
                <div className="text-secondary fw-bold mb-1 opacity-75">{stat.label}</div>
                <div className="text-muted small fw-medium opacity-50">{stat.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LOADS TABLE CONTAINER */}
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden glass-card animate-slide-up delay-500">
        <div className="card-header bg-white bg-opacity-50 border-bottom border-secondary border-opacity-10 px-4 px-md-5 py-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <h2 className="fs-4 fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-syne)' }}>Recent Dispatches</h2>
          <div className="d-flex flex-wrap gap-2 p-1 bg-dark bg-opacity-5 rounded-4 border border-secondary border-opacity-10">
            {['All', 'In Transit', 'Pending', 'Delivered'].map((filter, i) => (
              <button 
                key={filter}
                className={`btn btn-sm rounded-3 px-4 py-2 fw-bold transition-all ${i === 0 ? 'bg-white shadow-sm text-dark' : 'text-secondary border-0 hover-bg-white'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-scroll">
            <table className="table table-hover mb-0 align-middle">
              <thead>
                <tr className="bg-light bg-opacity-50">
                  <th className="fw-bold text-secondary py-4 px-4 px-md-5 border-0 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Load #</th>
                  <th className="fw-bold text-secondary py-4 px-3 px-md-4 border-0 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Pickup</th>
                  <th className="fw-bold text-secondary py-4 px-3 px-md-4 border-0 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Delivery</th>
                  <th className="fw-bold text-secondary py-4 px-3 px-md-4 border-0 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>Weight/Qty</th>
                  <th className="fw-bold text-secondary py-4 px-3 px-md-4 border-0 text-uppercase tracking-widest text-end" style={{ fontSize: '0.7rem' }}>Actions</th>
                  <th className="fw-bold text-secondary py-4 px-4 px-md-5 border-0 text-uppercase tracking-widest text-end" style={{ fontSize: '0.7rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-5 text-center">
                      <div className="animate-pulse text-secondary fw-medium">Loading live dispatch data...</div>
                    </td>
                  </tr>
                ) : loads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-5 text-center text-muted fw-medium">
                      No loads found. Click &quot;Create Load&quot; to get started.
                    </td>
                  </tr>
                ) : (
                  loads.map((load, index) => (
                    <tr 
                      key={load._id} 
                      className={`animate-fade-in delay-${(index % 4 + 1) * 100} hover-row transition-all`}
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                    >
                      <td className="px-4 px-md-5 py-4">
                        <span className="fw-bold text-dark fs-6">{load.loadNumber || 'N/A'}</span>
                      </td>
                      <td className="px-3 px-md-4 py-4">
                        <div className="fw-bold text-dark fs-6">{load.pickupCity || 'Unknown'}, {load.pickupState || ''}</div>
                        <div className="small text-muted fw-medium mt-1">
                          {load.pickupDate ? new Date(load.pickupDate).toLocaleDateString() : ''} {load.pickupTime || ''}
                        </div>
                      </td>
                      <td className="px-3 px-md-4 py-4">
                        <div className="fw-bold text-dark fs-6">{load.deliveryCity || 'Unknown'}, {load.deliveryState || ''}</div>
                        <div className="small text-muted fw-medium mt-1">
                          {load.deliveryDate ? new Date(load.deliveryDate).toLocaleDateString() : ''} {load.deliveryTime || ''}
                        </div>
                      </td>
                      <td className="px-3 px-md-4 py-4">
                        <div className="fw-bold text-dark mb-1">{load.weight || 0} {load.weightUnit || ''}</div>
                        <div className="small text-muted">{load.quantity || 0} {load.quantityUnit || ''}</div>
                      </td>
                      <td className="px-3 px-md-4 py-4 text-end">
                        <button 
                          onClick={() => handleDeleteLoad(load._id)}
                          className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2 hover-shadow-sm transition-all"
                          title="Delete Dispatch"
                          aria-label="Delete Dispatch"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </td>
                      <td className="px-4 px-md-5 py-4 text-end">
                        <div className="dropdown d-inline-block">
                          <div 
                            className="cursor-pointer" 
                            data-bs-toggle="dropdown" 
                            style={{ cursor: 'pointer' }}
                          >
                            {formatStatus(load.status)}
                          </div>
                          <ul className="dropdown-menu dropdown-menu-end rounded-4 shadow-lg border-0 p-2 animate-slide-up">
                            <li><h6 className="dropdown-header small text-uppercase opacity-50 fw-bold">Update Status</h6></li>
                            {['Pending', 'In Transit', 'Delivered'].map(s => (
                              <li key={s}>
                                <button 
                                  className="dropdown-item rounded-3 fw-bold small py-2" 
                                  onClick={() => handleStatusUpdate(load._id, s)}
                                >
                                  {s}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* NEW DISPATCH MODAL */}
      {showModal && (
        <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center animate-fade-in" style={{ zIndex: 2000 }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="card border-0 shadow-2xl rounded-5 p-4 p-md-5 glass-card position-relative z-1 animate-slide-up modal-scroll" style={{ width: '95%', maxWidth: '850px', maxHeight: '90vh' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fs-3 fw-bold text-dark m-0" style={{ fontFamily: 'var(--font-syne)' }}>Create New Load</h3>
              <button className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleCreateLoad} className="row g-4">
              <div className="col-12">
                <h5 className="fw-bold text-primary mb-0" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>General Info</h5>
                <hr className="mt-2 mb-0 opacity-10" />
              </div>
              <div className="col-md-12">
                <label className="small fw-bold text-secondary mb-2 px-1">Load Number *</label>
                <input required className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.loadNumber} onChange={e => setFormData({...formData, loadNumber: e.target.value})} placeholder="LD-882299" />
              </div>

              {/* ── PICKUP ── */}
              <div className="col-lg-6">
                <div className="p-4 rounded-4 bg-light bg-opacity-50 border border-secondary border-opacity-10 h-100">
                  <h5 className="fw-bold text-primary mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    📦 Pickup Details
                  </h5>
                  <LocationBlock prefix="pickup" data={formData as unknown as Record<string, string>} onChange={setField} />
                </div>
              </div>

              {/* ── DELIVERY ── */}
              <div className="col-lg-6">
                <div className="p-4 rounded-4 bg-light bg-opacity-50 border border-secondary border-opacity-10 h-100">
                  <h5 className="fw-bold text-primary mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    🚚 Delivery Details
                  </h5>
                  <LocationBlock prefix="delivery" data={formData as unknown as Record<string, string>} onChange={setField} />
                </div>
              </div>

              <div className="col-12 mt-4">
                <h5 className="fw-bold text-primary mb-0" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Logistics Info</h5>
                <hr className="mt-2 mb-0 opacity-10" />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold text-secondary mb-2 px-1">Quantity *</label>
                <input required type="number" className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="24" />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold text-secondary mb-2 px-1">Unit *</label>
                <select className="form-select rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.quantityUnit} onChange={e => setFormData({...formData, quantityUnit: e.target.value})}>
                  <option value="skids">Skids</option>
                  <option value="pallets">Pallets</option>
                  <option value="packages">Packages</option>
                  <option value="pieces">Pieces</option>
                  <option value="box">Box</option>
                  <option value="cases">Cases</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="small fw-bold text-secondary mb-2 px-1">Weight *</label>
                <input required type="number" className="form-control rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="45000" />
              </div>
              <div className="col-md-3">
                <label className="small fw-bold text-secondary mb-2 px-1">Unit *</label>
                <select className="form-select rounded-4 p-3 border-secondary border-opacity-10 bg-light bg-opacity-50" value={formData.weightUnit} onChange={e => setFormData({...formData, weightUnit: e.target.value})}>
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>

              <div className="col-12 mt-5">
                <button type="submit" className="btn btn-dark w-100 rounded-4 py-3 fw-bold fs-5 shadow-lg bg-gradient-primary border-0 transition-all hover-float">
                  Create Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .hover-bg-white:hover { background-color: white !important; }
        .hover-row:hover { 
          background-color: rgba(99, 102, 241, 0.02) !important;
          transform: scale(1.002);
          box-shadow: inset 4px 0 0 #6366f1;
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .hover-float:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
        .tracking-tight { letter-spacing: -0.025em; }
        .tracking-widest { letter-spacing: 0.1em; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .pulse-slow { animation: pulse-slow 2s infinite; }
        .backdrop-blur-sm { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      `}</style>
    </div>
  );
}
