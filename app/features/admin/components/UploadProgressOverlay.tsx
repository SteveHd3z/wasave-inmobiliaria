"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export interface SaveProgress {
  phase: "saving" | "uploading" | "finishing";
  percent: number;
  current: number;
  total: number;
  fileName: string;
}

const PHASE_LABEL = {
  saving: "Guardando datos de la propiedad...",
  uploading: "Subiendo archivos multimedia...",
  finishing: "Finalizando...",
};

export default function UploadProgressOverlay({ progress }: { progress: SaveProgress | null }) {
  const open = progress !== null;

  useEffect(() => {
    if (!open) return;

    // Bloquea recargar o cerrar la pestana mientras se sube.
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    // Deshabilita todo lo demas (menu, enlaces, formulario), tambien con teclado.
    const blocked: Element[] = [];
    Array.from(document.body.children).forEach((el) => {
      if (el.hasAttribute("data-upload-overlay") || el.hasAttribute("inert")) return;
      el.setAttribute("inert", "");
      blocked.push(el);
    });

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      blocked.forEach((el) => el.removeAttribute("inert"));
    };
  }, [open]);

  if (!progress || typeof document === "undefined") return null;

  const indeterminate = progress.phase !== "uploading";

  return createPortal(
    <div
      data-upload-overlay
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="upload-progress-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
    >
      <div
        className="w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl"
        style={{ backgroundColor: "var(--background)", border: "1px solid var(--border-color)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="animate-spin rounded-full h-6 w-6 border-b-2 shrink-0"
            style={{ borderColor: "var(--primary)" }}
          />
          <h2 id="upload-progress-title" className="font-semibold" style={{ color: "var(--foreground)" }}>
            {PHASE_LABEL[progress.phase]}
          </h2>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={indeterminate ? undefined : progress.percent}
          className="h-3 w-full rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--surface)" }}
        >
          <div
            className={`h-full rounded-full transition-all duration-200 ${indeterminate ? "animate-pulse" : ""}`}
            style={{
              width: indeterminate ? "100%" : `${progress.percent}%`,
              backgroundColor: "var(--primary)",
            }}
          />
        </div>

        {progress.phase === "uploading" && (
          <div className="text-sm space-y-1" style={{ color: "var(--muted)" }}>
            <p aria-live="polite">
              Archivo {progress.current} de {progress.total} &middot; {progress.percent}%
            </p>
            <p className="truncate">{progress.fileName}</p>
          </div>
        )}

        <p className="text-xs" style={{ color: "var(--muted)" }}>
          No cierre ni recargue esta pagina hasta que termine el proceso.
        </p>
      </div>
    </div>,
    document.body
  );
}
