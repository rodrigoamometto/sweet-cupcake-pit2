import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available: boolean;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  notes: string;
  created_at: string;
  order_items?: OrderItem[];
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  role: 'admin' | 'cliente';
  created_at: string;
};
