"use client";

import { ReactNode } from "react";
import { Button } from "@shared/components/ui";
import PageHeader from "./PageHeader";

interface FormLayoutProps {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel?: string;
  onSubmit: () => void;
  submitLabel?: string;
  cancelHref: string;
  loading?: boolean;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const FORM_ID = "admin-form";

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
};

export default function FormLayout({
  title,
  subtitle,
  backHref,
  backLabel,
  submitLabel = "Guardar",
  cancelHref,
  loading = false,
  children,
  maxWidth = "md",
}: Omit<FormLayoutProps, "onSubmit">) {
  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto space-y-6 pb-24`}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        backHref={backHref}
        backLabel={backLabel}
      />

      <div className="space-y-6">{children}</div>

      <div
        className="fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-md"
        style={{
          backgroundColor: "var(--header-bg)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 py-3`}>
          <div className="flex items-center justify-end gap-3">
            <a
              href={cancelHref}
              className="px-5 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-80 cursor-pointer"
              style={{
                backgroundColor: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border-color)",
              }}
            >
              Cancelar
            </a>
            <Button type="submit" form={FORM_ID} size="md" disabled={loading}>
              {loading ? "Guardando..." : submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { FORM_ID };
