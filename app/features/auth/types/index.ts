export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
