
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { AuthService } from "./AuthService";

export class AdminService {
  static async createAdmin(adminData: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    account_name?: string;
    account_number?: string;
    bank_name?: string;
    logo_url?: string;
    website_name?: string;
    subdomain: string;
    primary_color?: string;
    password: string;
  }) {
    try {
      // Create auth user with metadata
      const { data, error } = await AuthService.signUp(
        adminData.email,
        adminData.password,
        {
          name: adminData.name,
          role: 'admin',
          subdomain: adminData.subdomain,
          website_name: adminData.website_name,
          primary_color: adminData.primary_color || '#1a56db',
          phone: adminData.phone,
          location: adminData.location,
          account_name: adminData.account_name,
          account_number: adminData.account_number,
          bank_name: adminData.bank_name,
          logo_url: adminData.logo_url,
          is_active: true
        }
      );

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  static async getAllAdmins(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateAdmin(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async toggleAdminStatus(id: string, isActive: boolean) {
    return this.updateAdmin(id, { is_active: isActive });
  }

  static async getAdminBySubdomain(subdomain: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('role', 'admin')
      .single();

    if (error || !data) return null;
    return data;
  }
}
