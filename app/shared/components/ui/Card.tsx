import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  hover = true,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border transition-all ${paddingStyles[padding]} ${hover ? "hover:shadow-xl hover:-translate-y-1" : ""} ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border-color)",
      }}
    >
      {children}
    </div>
  );
}
