import { createContext, useContext } from "react";
import type { User } from "../AuthProvider";

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {}
});
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');

  if (context.token === null) {
    console.warn('No authentication token found, user might not be logged in');
  }

  return {
    token: context.token,
    user: context.user,
    login: context.login,
    logout: context.logout,
    register: context.register,
    isLoggedIn: context.token !== null,
  }
};