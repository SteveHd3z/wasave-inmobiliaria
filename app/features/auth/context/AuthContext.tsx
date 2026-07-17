"use client";

import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import type { AdminUser, AuthState, LoginInput } from "../types";

interface AuthContextValue extends AuthState {
  login: (input: LoginInput) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ error: null }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
