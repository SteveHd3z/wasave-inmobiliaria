import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section
      className="rounded-2xl p-5 sm:p-6"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border-color)",
      }}
    >
      <header className="mb-5">
        <h2
          className="text-base font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
