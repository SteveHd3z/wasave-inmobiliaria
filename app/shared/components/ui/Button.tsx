"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: {
    backgroundColor: "var(--primary)",
    color: "white",
    border: "none",
  },
  secondary: {
    backgroundColor: "var(--surface)",
    color: "var(--foreground)",
    border: "none",
  },
  outline: {
    backgroundColor: "transparent",
    color: "var(--primary)",
    border: "1px solid var(--primary)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--foreground)",
    border: "none",
  },
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full font-semibold transition-all hover:opacity-90 cursor-pointer ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}
