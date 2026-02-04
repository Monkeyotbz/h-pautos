import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Vehicle = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  condition: 'new' | 'used';
  mileage: number | null;
  fuel_type: string;
  transmission: string;
  type: string;
  color: string | null;
  description: string | null;
  features: string[];
  images: string[];
  is_featured: boolean;
  status: 'available' | 'sold' | 'reserved';
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  customer_photo: string | null;
  vehicle_id: string | null;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  vehicle_id: string | null;
  read: boolean;
  created_at: string;
};
