"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_REGIONS, fetchCitiesForState } from "@/lib/location";

export function useCities(stateInput: string) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = useCallback(async (input: string) => {
    if (!input) {
      setCities([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCitiesForState(input);
      setCities(data);
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

interface LocationSelectProps {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  className?: string;
  placeholder?: string;
}

export function StateProvinceSelect({
  value,
  onChange,
  id,
  className,
}: LocationSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = (value || "").trim().toUpperCase();
  const filtered =
    q.length === 0
      ? ALL_REGIONS
      : ALL_REGIONS.filter(
          ([code, name]) =>
            code.startsWith(q) || name.toUpperCase().startsWith(q),
        );

  return (
    <div ref={ref} className="position-relative w-100">
      <input
        id={id}
        required
        autoComplete="off"
        spellCheck={false}
        className={className}
        value={value || ""}
        placeholder="State/Province (e.g. ON, IL)"
        onChange={(e) => {
          const val = e.target.value.toUpperCase();
          onChange(val);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <ul
          className="list-unstyled position-absolute w-100 bg-dark border border-white border-opacity-10 rounded-4 shadow-2xl mt-1 py-1"
          style={{ zIndex: 9999, maxHeight: "220px", overflowY: "auto" }}
        >
          {filtered.map(([code, name, flag]) => (
            <li key={code}>
              <button
                type="button"
                className="btn btn-link text-decoration-none text-white w-100 text-start px-3 py-2 small fw-medium d-flex align-items-center gap-2 hover-bg-white-5"
                onMouseDown={() => {
                  onChange(code);
                  setOpen(false);
                }}
              >
                <span
                  className="fw-bold text-emerald"
                  style={{ minWidth: "2rem" }}
                >
                  {code}
                </span>
                <span className="text-white opacity-60">{name}</span>
                <span className="ms-auto">{flag}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CitySelect({
  stateCode,
  value,
  onChange,
  id,
  className,
  placeholder = "City",
}: LocationSelectProps & { stateCode: string }) {
  const { cities, loading } = useCities(stateCode);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const q = (value || "").trim().toLowerCase();
  const filtered = cities.filter((city) => city.toLowerCase().startsWith(q));

  return (
    <div ref={ref} className="position-relative w-100">
      <input
        id={id}
        required
        autoComplete="off"
        className={className}
        value={value || ""}
        placeholder={loading ? "Loading..." : placeholder}
        disabled={loading || !stateCode}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <ul
          className="list-unstyled position-absolute w-100 bg-dark border border-white border-opacity-10 rounded-4 shadow-2xl mt-1 py-1"
          style={{ zIndex: 9999, maxHeight: "220px", overflowY: "auto" }}
        >
          {filtered.map((city) => (
            <li key={city}>
              <button
                type="button"
                className="btn btn-link text-decoration-none text-white w-100 text-start px-3 py-2 small fw-medium hover-bg-white-5"
                onMouseDown={() => {
                  onChange(city);
                  setOpen(false);
                }}
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
