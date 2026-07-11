"use client";

import Image from "next/image";
import { useTheme } from "@shared/hooks";
import { ThemeToggle } from "@shared/components/layout";
import { NAV_ITEMS, COMPANY_NAME } from "@shared/constants";

export default function Header() {
  const { theme } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt={`${COMPANY_NAME} Logo`}
              width={40}
              height={40}
            />
            <Image
              src={theme === "dark" ? "/images/nombre_oscuro2png.png" : "/images/nombre-claro.png"}
              alt={COMPANY_NAME}
              width={140}
              height={30}
            />
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:opacity-80"
                style={{ color: "var(--foreground)" }}
              >
                {item.label}
              </a>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex lg:hidden items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
