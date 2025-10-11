"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

// Define user types
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Define auth context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@vthealthcare.org",
    password: "adminpassword",
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@vthealthcare.org",
    password: "userpassword",
    role: "user",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("auth-user", JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
