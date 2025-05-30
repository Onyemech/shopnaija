
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

export class ProductService {
  static async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProductsByAdmin(adminId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getPublicProductsByAdmin(adminId: string): Promise<Product[]> {
    // This will use the RLS policy to only show products from active admins
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data;
  }
}
