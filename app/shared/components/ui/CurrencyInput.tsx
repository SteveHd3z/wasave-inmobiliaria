"use client";

import { useState, useRef, useCallback } from "react";
import { formatCop, parseCopInput } from "@shared/utils";

interface CurrencyInputProps {
  name: string;
  value: number | undefined;
  onChange: (name: string, value: number | undefined) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function CurrencyInput({
  name,
  value,
  onChange,
  placeholder = "0",
  className = "",
  style,
}: CurrencyInputProps) {
  const [localDisplay, setLocalDisplay] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = isFocused
    ? localDisplay ?? ""
    : value != null
      ? formatCop(value)
      : "";

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setLocalDisplay(value != null ? String(value) : "");
    setTimeout(() => inputRef.current?.select(), 0);
  }, [value]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      const parsed = parseCopInput(e.target.value);
      onChange(name, parsed);
      setLocalDisplay(null);
    },
    [name, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const cursorPos = e.target.selectionStart ?? raw.length;

      const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, "").length;

      const digits = raw.replace(/\D/g, "");
      const parsed = digits === "" ? undefined : Number(digits);
      onChange(name, parsed);

      if (digits === "") {
        setLocalDisplay("");
        return;
      }

      const formatted = new Intl.NumberFormat("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(digits));

      let digitCount = 0;
      let newPos = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) digitCount++;
        if (digitCount >= digitsBeforeCursor) {
          newPos = i + 1;
          break;
        }
      }

      setLocalDisplay(formatted);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(newPos, newPos);
        }
      });
    },
    [name, onChange]
  );

  return (
    <div className="relative">
      <span
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--muted)" }}
      >
        $
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full pl-8 pr-4 py-3 rounded-lg outline-none ${className}`}
        style={style}
      />
    </div>
  );
}
