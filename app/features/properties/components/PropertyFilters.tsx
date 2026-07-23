"use client";

interface PropertyFiltersProps {
  selected: string;
  onChange: (value: string) => void;
}

const filters: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "lote", label: "Lotes" },
  { value: "casa", label: "Casa Fincas" },
  { value: "cabana", label: "Cabañas" },
];

export default function PropertyFilters({ selected, onChange }: PropertyFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-8">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
          style={{
            backgroundColor: selected === f.value ? "var(--primary)" : "var(--surface)",
            color: selected === f.value ? "white" : "var(--foreground)",
            border: `1px solid ${selected === f.value ? "var(--primary)" : "var(--border-color)"}`,
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
