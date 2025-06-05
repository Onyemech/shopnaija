import { supabase } from "@/integrations/supabase/client";
import { AuthService } from "./AuthService";

export interface AdminCreateData {
  name: string;
  email: string;
  password: string; // Added password field
  phone?: string;
  nin: string;
  subdomain: string;
  website_name: string;
  primary_color?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
}

export class AdminService {
  static async createAdmin(adminData: AdminCreateData) {
    try {
      // Generate a random referral code
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Create admin with password using AuthService
      const result = await AuthService.createAdminWithPassword({
        ...adminData,
        primary_color: adminData.primary_color || '#00A862'
      });

      // Update the profile with referral code
      const { data: updatedProfile, error: updateError } = await supabase
        .from('users')
        .update({ referral_code: referralCode })
        .eq('id', result.user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      return updatedProfile;
    } catch (error: any) {
      console.error('Error creating admin:', error);
      throw new Error(error.message || 'Failed to create admin');
    }
  }

  static async getAllAdmins() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getAdminById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('role', 'admin')
      .single();

    if (error) throw error;
    return data;
  }

  static async getAdminBySubdomain(subdomain: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('role', 'admin')
      .single();

    if (error) throw error;
    return data;
  }

  static async updateAdmin(id: string, updates: Partial<AdminCreateData>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .eq('role', 'admin')
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async activateAdmin(id: string) {
    return this.updateAdmin(id, { is_active: true });
  }

  static async deactivateAdmin(id: string) {
    return this.updateAdmin(id, { is_active: false });
  }

  static async deleteAdmin(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .eq('role', 'admin');

    if (error) throw error;
  }

  static async generateReferralCode(): Promise<string> {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `REF-${randomId}`;
  }

  static async updateReferralCode(adminId: string, referralCode: string) {
    return this.updateAdmin(adminId, { referral_code: referralCode });
  }

  static async getAdminByReferralCode(referralCode: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('role', 'admin')
      .single();

    if (error) throw error;
    return data;
  }
}
