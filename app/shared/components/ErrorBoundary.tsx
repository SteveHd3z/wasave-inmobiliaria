"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div
          className="min-h-[60vh] flex items-center justify-center p-4"
          style={{ backgroundColor: "var(--background)" }}
        >
          <div
            className="max-w-md w-full rounded-2xl p-8 text-center"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#FEE2E2" }}
            >
              <span className="text-3xl">⚠️</span>
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: "var(--foreground)" }}
            >
              Algo salio mal
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              {this.state.error.message ||
                "Ha ocurrido un error inesperado. Por favor intenta de nuevo."}
            </p>
            <button
              onClick={this.reset}
              className="px-6 py-2.5 text-sm rounded-full font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
