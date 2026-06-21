"use client";

import { CONTACT_INFO, COMPANY_NAME, COMPANY_TAGLINE } from "@shared/constants";
import { useTheme } from "@shared/hooks";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className="static bottom-0 left-0 right-0 border-t py-6"
      style={{
        backgroundColor: theme === "dark" ? "var(--surface)" : "var(--primary-dark)",
        borderColor: "var(--border-color)",
        color: theme === "dark" ? "var(--foreground)" : "var(--primary-light)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-bold text-lg">{COMPANY_NAME}</p>
            <p className="text-sm opacity-80">{COMPANY_TAGLINE}</p>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="font-semibold">{CONTACT_INFO.name}</p>
            <p className="text-sm opacity-80">Tel: {CONTACT_INFO.phone}</p>
            <p className="text-sm opacity-80">{CONTACT_INFO.email}</p>
          </div>
        </div>

        <div
          className="mt-4 pt-4 border-t text-center text-xs opacity-60"
          style={{ borderColor: "var(--border-color)" }}
        >
          <p>
            &copy; {new Date().getFullYear()} {COMPANY_NAME}. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
