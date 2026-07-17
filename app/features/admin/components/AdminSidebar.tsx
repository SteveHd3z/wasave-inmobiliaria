"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/propiedades", label: "Propiedades", icon: "🏠" },
  { href: "/admin/owners", label: "Owners", icon: "👤" },
  { href: "/admin/clientes", label: "Clientes", icon: "👥" },
  { href: "/admin/citas", label: "Citas", icon: "📅" },
  { href: "/admin/certificados", label: "Certificados", icon: "📜" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--surface)",
          borderRight: "1px solid var(--border-color)",
        }}
      >
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              W
            </div>
            <span className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
              Admin Panel
            </span>
          </Link>
        </div>

        <nav className="px-3 pb-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive ? "font-semibold" : ""
                }`}
                style={{
                  backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--muted)",
                }}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
