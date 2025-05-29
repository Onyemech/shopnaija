
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  subdomain: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
      const subdomain = window.location.pathname.split('/')[1];
      if (subdomain && subdomain !== '') {
        setSubdomain(subdomain);
      }
      setLoading(false);
      return;
    }
    
    // Production subdomain extraction
    const parts = hostname.split('.');
    if (parts.length > 2) {
      setSubdomain(parts[0]);
    }
    setLoading(false);
  }, []);

  // Mock login function (will be replaced with Supabase Auth)
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // This is a placeholder for Supabase auth
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        name: email === 'admin@example.com' ? 'Admin User' : 'Super Admin',
        email,
        role: email === 'admin@example.com' ? 'admin' : 'superadmin',
        subdomain: email === 'admin@example.com' ? 'admin1' : undefined,
        website_name: email === 'admin@example.com' ? 'Admin Store' : 'Multi-Tenant Platform',
        is_active: true,
        logo_url: 'https://via.placeholder.com/150',
      };
      
      setUser(mockUser);
      setIsSuperAdmin(mockUser.role === 'superadmin');
      setIsAdmin(mockUser.role === 'admin');
      
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // This will be replaced with Supabase logout
    // supabase.auth.signOut()
    setUser(null);
    setIsSuperAdmin(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      setIsSuperAdmin(parsedUser.role === 'superadmin');
      setIsAdmin(parsedUser.role === 'admin');
    }
    setLoading(false);
  }, []);

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
