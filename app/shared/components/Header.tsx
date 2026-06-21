"use client";

import Image from "next/image";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Seguros", href: "#seguros" },
  { label: "Trámites", href: "#tramites" },
  { label: "Mantenimiento", href: "#mantenimiento" },
  { label: "Compra y Venta", href: "#compra-venta" },
  { label: "Representante", href: "#representante" },
];

export default function Header() {
  const { theme } = useTheme();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor:
          theme === "dark"
            ? "rgba(13, 17, 23, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        borderColor: theme === "dark" ? "var(--border-color)" : "#D0D7DE",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Wasave Logo"
              width={40}
              height={40}
            />
            <Image
              src="/images/nombre.png"
              alt="Wasave Inmobiliaria"
              width={140}
              height={30}
            />
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
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
