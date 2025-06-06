
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
    
    // For preview URLs like preview--shopnaija.lovable.app, extract the actual subdomain
    if (hostname.includes('preview--')) {
      const parts = hostname.split('.');
      if (parts.length > 0) {
        const previewPart = parts[0]; // e.g., "preview--shopnaija"
        if (previewPart.includes('--')) {
          const actualSubdomain = previewPart.split('--')[1]; // e.g., "shopnaija"
          if (actualSubdomain && actualSubdomain !== 'shopnaija') {
            setSubdomain(actualSubdomain);
          }
          // If it's "shopnaija" or empty, leave subdomain as null (main domain)
        }
      }
      return;
    }
    
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
      const potentialSubdomain = parts[0];
      if (potentialSubdomain !== 'www' && potentialSubdomain !== 'shopnaija') {
        setSubdomain(potentialSubdomain);
      }
    }
  }, []);

  // Set up auth state listener with timeout
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          console.log('Auth initialization timeout - stopping loading');
          if (mounted) {
            setLoading(false);
          }
        }, 5000);

        // Check for existing session first
        const currentUser = await AuthService.getCurrentUser();
        if (mounted) {
          console.log('Current user check:', currentUser?.email, currentUser?.role);
          setUser(currentUser);
          setIsSuperAdmin(currentUser?.role === 'superadmin');
          setIsAdmin(currentUser?.role === 'admin');
          setLoading(false);
          clearTimeout(timeoutId);
        }

        // Set up auth state change listener
        const { data: { subscription } } = AuthService.onAuthStateChange(async (user) => {
          if (!mounted) return;
          
          console.log('Auth state change:', user?.email, user?.role);
          setUser(user);
          setIsSuperAdmin(user?.role === 'superadmin');
          setIsAdmin(user?.role === 'admin');
          setLoading(false);
          clearTimeout(timeoutId);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await AuthService.signIn(email, password);
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
