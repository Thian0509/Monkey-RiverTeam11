import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export interface User {
  email: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      setUser({ email: parseJwt(token).email }); // Or fetch from backend
      console.log("User authenticated with token:", token);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Invalid token format", e);
    return null;
  }
}
