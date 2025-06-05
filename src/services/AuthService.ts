
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

  static async createAdminWithPassword(adminData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    nin: string;
    subdomain: string;
    website_name: string;
    primary_color?: string;
    account_name?: string;
    account_number?: string;
    bank_name?: string;
  }) {
    // Create the admin user with auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true,
      user_metadata: {
        name: adminData.name,
        role: 'admin',
        subdomain: adminData.subdomain,
        website_name: adminData.website_name,
        primary_color: adminData.primary_color || '#00A862',
        phone: adminData.phone,
        nin: adminData.nin,
        account_name: adminData.account_name,
        account_number: adminData.account_number,
        bank_name: adminData.bank_name,
      }
    });

    if (authError) throw authError;

    // Create profile in users table
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        nin: adminData.nin,
        role: 'admin',
        subdomain: adminData.subdomain,
        website_name: adminData.website_name,
        primary_color: adminData.primary_color || '#00A862',
        account_name: adminData.account_name,
        account_number: adminData.account_number,
        bank_name: adminData.bank_name,
        is_active: true,
        email_verified: true
      })
      .select()
      .single();

    if (profileError) throw profileError;

    return { user: authData.user, profile: profileData };
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
    console.log('Attempting to sign in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    
    console.log('Sign in successful:', data);
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
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Auth user found:', user.email);

      // Get user profile from our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      if (!profile) {
        console.log('No profile found, creating basic user object');
        // If no profile exists, create a basic user object from auth data
        return {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!,
          role: user.user_metadata?.role || 'customer',
          phone: user.phone,
          subdomain: user.user_metadata?.subdomain,
          website_name: user.user_metadata?.website_name,
          primary_color: user.user_metadata?.primary_color || '#00A862',
          is_active: true,
          email_verified: user.email_confirmed_at !== null,
          phone_verified: user.phone_confirmed_at !== null,
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        } as User;
      }

      console.log('Profile found:', profile.email, profile.role);
      return profile;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      return null;
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        const user = await this.getCurrentUser();
        console.log('Retrieved user profile for callback:', user?.email, user?.role);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  static async resendConfirmation(email: string) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
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
