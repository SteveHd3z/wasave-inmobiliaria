"use client";

interface PropertyFiltersProps {
  selected: string;
  onChange: (value: string) => void;
  counts?: Record<string, number>;
}

const filters: { value: string; label: string; icon: string }[] = [
  { value: "", label: "Todos", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  { value: "lote", label: "Lotes", icon: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" },
  { value: "casa", label: "Casa Fincas", icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" },
  { value: "cabana", label: "Cabañas", icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" },
];

export default function PropertyFilters({ selected, onChange, counts }: PropertyFiltersProps) {
  return (
    <div className="flex gap-3 flex-wrap justify-center mb-10">
      {filters.map((f) => {
        const isActive = selected === f.value;
        const count = counts?.[f.value];

        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className="group relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              backgroundColor: isActive ? "var(--primary)" : "var(--surface)",
              color: isActive ? "white" : "var(--foreground)",
              border: `1.5px solid ${isActive ? "var(--primary)" : "var(--border-color)"}`,
              boxShadow: isActive ? "0 4px 14px rgba(0,0,0,0.15)" : "none",
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
            </svg>
            <span>{f.label}</span>
            {count !== undefined && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--background)",
                  color: isActive ? "white" : "var(--muted)",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
