export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description?: string;
  long_description?: string;
  industry_usage?: string;
  technical_highlights?: string[];
  image_url?: string;
  status: 'active' | 'inactive';
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at?: string;
}

export interface Catalog {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  thumbnail?: string;
  pages?: number;
  size?: string;
  downloads?: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  product_count?: number;
  status: 'active' | 'inactive';
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  product?: string;
  message?: string;
  attachment_url?: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'closed';
  priority?: 'low' | 'normal' | 'high';
  assigned_to?: string;
  notes?: string;
  created_at: string;
}

export interface Career {
  id: string;
  title: string;
  description?: string;
  department?: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'active' | 'inactive';
  requirements?: string[];
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  email: string;
  amount: number;
  currency?: string;
  message?: string;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  created_at: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  tracking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  product_details?: string;
  weight?: number;
  dimensions?: string;
  logistic_partner: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled';
  current_location?: string;
  estimated_delivery?: string;
  tracking_updates?: TrackingUpdate[];
  created_at: string;
}

export interface TrackingUpdate {
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

export interface Logistics {
  id: string;
  name: string;
  type: 'national' | 'international';
  coverage?: string[];
  services?: string[];
  tracking_url?: string;
  api_integration?: boolean;
  status: 'active' | 'inactive';
  logo_url?: string;
  description?: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  author?: string;
  status: 'draft' | 'published';
  featured?: boolean;
  views?: number;
  seo_score?: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  published_at?: string;
}

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline?: string;
  contact_email: string;
  contact_phone?: string;
  whatsapp?: string;
  address?: string;
  google_maps_embed?: string;
  footer_text?: string;
  logo_url?: string;
  favicon_url?: string;
  social_links?: Record<string, string>;
  seo_settings?: Record<string, string>;
  theme_settings?: Record<string, string>;
  maintenance_mode?: boolean;
  updated_at?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export type SortDirection = 'asc' | 'desc';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}
