"use client";

interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const rules: Rule[] = [
  { label: "At least 12 characters",              test: (v) => v.length >= 12 },
  { label: "Uppercase letter (A-Z)",              test: (v) => /[A-Z]/.test(v) },
  { label: "Lowercase letter (a-z)",              test: (v) => /[a-z]/.test(v) },
  { label: "Number (0-9)",                        test: (v) => /[0-9]/.test(v) },
  { label: "Special character (!@#$%^&*...)",     test: (v) => /[!@#$%^&*()\-_=+[\]{};':"\\|,.<>/?]/.test(v) },
];

export default function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const results = rules.map((r) => r.test(password));
  const passed = results.filter(Boolean).length;

  // Hide completely once all rules are satisfied
  if (passed === rules.length) return null;

  const strength = passed <= 1 ? "Weak" : passed <= 3 ? "Fair" : passed === 4 ? "Good" : "Strong";
  const barColor = passed <= 1 ? "#ef4444" : passed <= 3 ? "#f97316" : passed === 4 ? "#eab308" : "#22c55e";

  return (
    <div className="mt-2 px-1 animate-fade-in">
      {/* Strength bar */}
      <div className="d-flex align-items-center gap-2 mb-2">
        <div className="flex-grow-1 rounded-pill overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-100 rounded-pill transition-all"
            style={{
              width: `${(passed / rules.length) * 100}%`,
              background: barColor,
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        </div>
        <span className="small fw-bold" style={{ color: barColor, minWidth: '48px', fontSize: '0.7rem' }}>
          {strength}
        </span>
      </div>

      {/* Rule checklist */}
      <ul className="list-unstyled mb-0 d-flex flex-column gap-1">
        {rules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.label} className="d-flex align-items-center gap-2 small" style={{ color: ok ? '#22c55e' : 'rgba(255,255,255,0.45)', transition: 'color 0.2s ease', fontSize: '0.75rem' }}>
              <i className={`bi ${ok ? 'bi-check-circle-fill' : 'bi-circle'}`} style={{ fontSize: '0.7rem', flexShrink: 0 }} />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
