"use client";

import { useAuthContext } from "@features/auth";
import { Button } from "@shared/components/ui";
import { ThemeToggle } from "@shared/components/layout";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { user, logout } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header
      className="sticky top-0 z-30 px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
      style={{
        backgroundColor: "var(--header-bg)",
        borderBottom: "1px solid var(--border-color)",
        backdropFilter: "blur(10px)",
      }}
    >
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg"
        style={{ color: "var(--foreground)" }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">        
        <span className="text-sm hidden sm:block" style={{ color: "var(--muted)" }}>
          {user?.email}
        </span>
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Cerrar sesion
        </Button>
      </div>
    </header>
  );
}
