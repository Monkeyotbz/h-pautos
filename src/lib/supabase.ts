import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseOrigin = new URL(supabaseUrl).origin;

export function normalizeStorageUrl(url: string | null | undefined) {
  if (!url) return null;
  
  try {
    const parsed = new URL(url);
    
    // Asegurarse de que sea del storage de Supabase
    if (parsed.pathname.startsWith('/storage/v1/object/')) {
      // Reconstruir la URL completa con el origin correcto
      return `${supabaseOrigin}${parsed.pathname}${parsed.search}`;
    }
    
    return url;
  } catch {
    // Si no es una URL válida, intentar construirla
    if (url.startsWith('/storage/v1/object/')) {
      return `${supabaseOrigin}${url}`;
    }
    return url;
  }
}

export type VehicleImage = {
  id: string;
  vehicle_id: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export type Vehicle = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
  condition: 'nuevo' | 'usado';
  description: string | null;
  status: 'activo' | 'reservado' | 'vendido';
  location: string | null;
  cover_image_url: string | null;
  rating: number;
  vehicle_images?: VehicleImage[];
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
