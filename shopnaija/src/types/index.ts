
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'superadmin' | 'admin' | 'customer';
  subdomain?: string;
  logo_url?: string;
  website_name?: string;
  primary_color?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  location?: string;
  nin?: string;
  is_active: boolean;
  referral_code?: string;
  referral_discount?: number;
  referred_by?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  admin_id: string;
  category_id?: string;
  title: string;
  description?: string;
  price: number;
  adjusted_price?: number;
  paystack_fee?: number;
  superadmin_fee?: number;
  image_url?: string;
  image_public_id?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  admin_id: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_details: any;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_date?: string;
  tracking_status?: 'processing' | 'shipped' | 'out for delivery' | 'delivered' | 'cancelled';
  order_reference?: string;
  verification_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Feedback {
  id: string;
  admin_id: string;
  customer_id?: string;
  product_id?: string;
  customer_name: string;
  rating: number;
  comment?: string;
  date?: string;
  is_approved: boolean;
  is_review?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  message: string;
  type: 'sale_notification' | 'admin_created' | 'admin_deactivated' | 'feedback_received' | 'order_failed' | 'payment_confirmed';
  timestamp: string;
  is_read: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Cart {
  id: string;
  customer_id?: string;
  admin_id: string;
  items: CartItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  admin_id?: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}
