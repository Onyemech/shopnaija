
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { AuthService } from "@/services/AuthService";

interface AuthContextType {
  user: User | null;
  subdomain: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Extract subdomain from URL
  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Local development handling
    if (hostname === 'localhost') {
      const path = window.location.pathname;
      const pathSegments = path.split('/').filter(Boolean);
      if (pathSegments.length > 0 && pathSegments[0] !== '') {
        setSubdomain(pathSegments[0]);
      }
      return;
    }
    
    // Production subdomain extraction for .growthsmallbeez.com
    const parts = hostname.split('.');
    if (parts.length >= 3 && parts[1] === 'growthsmallbeez') {
      setSubdomain(parts[0]);
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    setLoading(true);

    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user);
      setIsSuperAdmin(user?.role === 'superadmin');
      setIsAdmin(user?.role === 'admin');
      setLoading(false);
    });

    // Check for existing session
    AuthService.getCurrentUser().then((user) => {
      setUser(user);
      setIsSuperAdmin(user?.role === 'superadmin');
      setIsAdmin(user?.role === 'admin');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await AuthService.signIn(email, password);
      // The auth state listener will handle updating the user state
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await AuthService.signOut();
    setUser(null);
    setIsSuperAdmin(false);
    setIsAdmin(false);
  };

  const value = {
    user,
    subdomain,
    loading,
    login,
    logout,
    isSuperAdmin,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
