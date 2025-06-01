
import { supabase } from "@/integrations/supabase/client";

export class ProductService {
  static async getProductsByAdmin(adminId: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getCategoriesByAdmin(adminId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('admin_id', adminId)
      .order('name');

    if (error) throw error;
    return data;
  }

  static async createProduct(productData: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProduct(id: string, productData: any) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
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

  static async createCategory(categoryData: any) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCategory(id: string, categoryData: any) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
