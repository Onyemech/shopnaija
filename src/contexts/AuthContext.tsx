
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
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const path = window.location.pathname;
      const pathSegments = path.split('/').filter(Boolean);
      if (pathSegments.length > 0 && pathSegments[0] !== '') {
        setSubdomain(pathSegments[0]);
      }
      return;
    }
    
    // Production subdomain extraction
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      setSubdomain(parts[0]);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Check current session first
        const currentUser = await AuthService.getCurrentUser();
        
        if (mounted) {
          console.log('Current user:', currentUser?.email, currentUser?.role);
          setUser(currentUser);
          setIsSuperAdmin(currentUser?.role === 'superadmin');
          setIsAdmin(currentUser?.role === 'admin');
          setLoading(false);
        }

        // Set up auth listener
        const { data: { subscription } } = AuthService.onAuthStateChange(async (user) => {
          if (!mounted) return;
          
          console.log('Auth state changed:', user?.email, user?.role);
          setUser(user);
          setIsSuperAdmin(user?.role === 'superadmin');
          setIsAdmin(user?.role === 'admin');
          setLoading(false);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
    
    // Set maximum loading time of 3 seconds
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.log('Auth timeout - stopping loading');
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await AuthService.signIn(email, password);
      // Auth state change will be handled by the listener
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
