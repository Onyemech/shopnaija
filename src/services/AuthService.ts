
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";

export class AuthService {
  static async signUp(email: string, password: string, userData: {
    name: string;
    role: 'superadmin' | 'admin' | 'customer';
    subdomain?: string;
    website_name?: string;
    primary_color?: string;
    phone?: string;
    location?: string;
    account_name?: string;
    account_number?: string;
    bank_name?: string;
    logo_url?: string;
    is_active?: boolean;
    nin?: string;
  }) {
    // Validate NIN for admin users
    if (userData.role === 'admin' && userData.nin) {
      const ninValidation = await this.validateNIN(userData.nin);
      if (!ninValidation.valid) {
        throw new Error(ninValidation.error || "Invalid NIN format");
      }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  }

  static async validateNIN(nin: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('validate-nin', {
        body: { nin }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('NIN validation error:', error);
      // Fallback validation
      const ninRegex = /^\d{11}$/;
      return {
        valid: ninRegex.test(nin.replace(/[\s-]/g, '')),
        error: ninRegex.test(nin.replace(/[\s-]/g, '')) ? undefined : "Please enter a valid 11-digit NIN"
      };
    }
  }

  static async signUpWithPhone(phone: string, password: string, userData: {
    name: string;
    role: 'customer';
  }) {
    const { data, error } = await supabase.auth.signUp({
      phone,
      password,
      options: {
        data: userData
      }
    });

    if (error) throw error;
    return data;
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  static async signInWithPhone(phone: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password
    });

    if (error) throw error;
    return data;
  }

  static async signInWithOAuth(provider: 'google' | 'github' | 'twitter') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async resetPassword(email: string, redirectTo?: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || `${window.location.origin}/reset-password`
    });

    if (error) throw error;
    return data;
  }

  static async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  }

  static async verifyOtp(email: string, token: string, type: 'signup' | 'recovery' | 'email_change') {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    });

    if (error) throw error;
    return data;
  }

  static async verifyPhoneOtp(phone: string, token: string, type: 'sms') {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type
    });

    if (error) throw error;
    return data;
  }

  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get user profile from our users table
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !profile) return null;
    return profile;
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        const user = await this.getCurrentUser();
        console.log('Retrieved user profile:', user);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  static async resendConfirmation(email: string) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email
    });

    if (error) throw error;
    return data;
  }

  static async updateUserMetadata(metadata: Partial<User>) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });

    if (error) throw error;
    return data;
  }
}
