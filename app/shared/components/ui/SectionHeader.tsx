interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export default function SectionHeader({
  label,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`mb-16 ${alignClass}`}>
      <span
        className="text-sm font-bold uppercase tracking-widest"
        style={{ color: "var(--primary)" }}
      >
        {label}
      </span>
      <h2
        className="text-3xl sm:text-4xl font-bold mt-2"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
