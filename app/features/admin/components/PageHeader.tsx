import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = "Volver",
  actions,
}: PageHeaderProps) {
  return (
    <div className="space-y-3">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity"
        style={{ color: "var(--muted)" }}
      >
        <span>←</span>
        {backLabel}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
