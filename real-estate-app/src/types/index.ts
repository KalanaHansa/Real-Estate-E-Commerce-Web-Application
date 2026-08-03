export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  auth_provider: 'local' | 'google';
  firebase_uid?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Province {
  id: number;
  name: string;
  code: string;
}

export interface District {
  id: number;
  province_id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  district_id: number;
  name: string;
  code: string;
}

export interface Property {
  id: number;
  title: string;
  description?: string;
  property_type: 'sale' | 'rent';
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  address: string;
  province_id: number;
  district_id: number;
  city_id: number;
  latitude?: number;
  longitude?: number;
  images?: string[];
  features?: string[];
  status: 'available' | 'sold' | 'rented' | 'pending';
  owner_id: number;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  province_name?: string;
  district_name?: string;
  city_name?: string;
  owner_name?: string;
}

export interface Transaction {
  id: number;
  property_id: number;
  buyer_id: number;
  seller_id: number;
  transaction_type: 'buy' | 'rent';
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  property_title?: string;
  buyer_name?: string;
  seller_name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}