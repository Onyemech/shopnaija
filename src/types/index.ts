
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  subdomain?: string;
  logo_url?: string;
  website_name?: string;
  primary_color?: string;
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  phone?: string;
  location?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  admin_id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  location: string;
  created_at?: string;
}

export interface Order {
  id: string;
  admin_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_details: any;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_date?: string;
  created_at?: string;
}

export interface Feedback {
  id: string;
  admin_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  message: string;
  type: string;
  timestamp: string;
  is_read: boolean;
}
