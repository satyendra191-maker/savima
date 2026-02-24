
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'brass' | 'steel' | 'machinery' | 'other' | 'precision' | 'hydraulic';
  short_description: string;
  long_description: string;
  industry_usage: string;
  technical_highlights: string[];
  image_url: string;
  model_name?: string;
  version?: string;
  specifications?: Record<string, string>;
  brochure_url?: string;
  images?: string[];
  status?: string;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  product?: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface UserProfile {
  id: string;
  role: 'super_admin' | 'admin' | 'sales_manager' | 'inventory_manager' | 'user' | 'guest';
  email: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  requirement_description?: string;
  source: 'website' | 'ai_chat' | 'rfq' | 'contact_form';
  status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  buying_intent_score?: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  payment_status: 'pending' | 'partial' | 'paid' | 'refunded';
  shipment_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: any[];
  created_at: string;
}

export interface Shipment {
  id: string;
  tracking_number: string;
  carrier: string;
  current_status: string;
  estimated_delivery?: string;
}

export type Category = 'brass' | 'steel' | 'other';

// --- CMS TYPES ---

export interface SiteSettings {
  id: number; // Singleton, always 1
  site_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_links: Record<string, string>;
  footer_text: string;
  updated_at?: string;
}

export interface CMSPage {
  id: string;
  slug: string; // 'home', 'about', 'quality', 'infrastructure'
  title: string;
  meta_title: string;
  meta_description: string;
  sections: any[]; // JSONB array of sections
  updated_at?: string;
}

// AI Agent Action Types
export interface AdminAction {
  type: 'CREATE_PRODUCT' | 'UPDATE_SETTINGS' | 'UPDATE_PAGE' | 'UNKNOWN';
  payload: any;
  summary: string;
  confirmationRequired: boolean;
}
