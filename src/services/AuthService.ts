
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
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
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

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async resetPassword(email: string, redirectTo?: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo
    });

    if (error) throw error;
    return data;
  }

  static async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({ password });
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
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}
