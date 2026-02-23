import { supabase } from '../../lib/supabase';

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
  status: string;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Catalog {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  thumbnail?: string;
  pages?: number;
  file_size?: string;
  downloads?: number;
  status: string;
  featured?: boolean;
  category?: string;
  language?: string;
  version?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  product_count?: number;
  status: string;
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  product?: string;
  message?: string;
  attachment_url?: string;
  status: string;
  priority?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  description?: string;
  requirements?: string;
  department?: string;
  location?: string;
  job_type?: string;
  experience?: string;
  salary_range?: string;
  status: string;
  featured?: boolean;
  posted_at?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CareerApplication {
  id: string;
  career_id?: string;
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  cover_letter?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  status: string;
  notes?: string;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_email?: string;
  donor_phone?: string;
  amount: number;
  currency?: string;
  payment_method?: string;
  payment_status: string;
  transaction_id?: string;
  message?: string;
  anonymous?: boolean;
  campaign?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Shipment {
  id: string;
  order_id?: string;
  tracking_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  product_details?: string;
  weight?: number;
  dimensions?: string;
  logistic_partner?: string;
  carrier?: string;
  shipment_status: string;
  current_location?: string;
  origin_location?: string;
  destination_country?: string;
  tracking_updates?: any[];
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LogisticsPartner {
  id: string;
  name: string;
  partner_type?: string;
  description?: string;
  logo_url?: string;
  website?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  service_types?: string[];
  coverage_countries?: string[];
  rating?: number;
  status: string;
  contract_start?: string;
  contract_end?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
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
  status: string;
  featured?: boolean;
  views?: number;
  seo_score?: number;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface SiteSettings {
  id: number;
  site_name?: string;
  tagline?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp?: string;
  address?: string;
  google_maps_embed?: string;
  footer_text?: string;
  logo_url?: string;
  favicon_url?: string;
  social_links?: Record<string, string>;
  seo_settings?: Record<string, any>;
  theme_settings?: Record<string, any>;
  updated_at?: string;
}

const handleError = (error: any, operation: string) => {
  console.error(`Error ${operation}:`, error);
  throw new Error(error?.message || `Failed to ${operation}`);
};

// ============================================
// PRODUCTS SERVICE
// ============================================
// Use new_ prefix for all tables to avoid conflicts
const TABLE_PREFIX = '';

export const ProductsService = {
  async getAll(options?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    category?: string; 
    status?: string;
    featured?: boolean;
  }) {
    const { page = 1, limit = 10, search, category, status, featured } = options || {};
    
    let query = supabase
      .from(TABLE_PREFIX + 'products')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching products');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching product');
    return data;
  },

  async create(product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) handleError(error, 'creating product');
    return data;
  },

  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating product');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting product');
  },

  async toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return this.update(id, { status: newStatus });
  },

  async toggleFeatured(id: string, currentFeatured: boolean) {
    return this.update(id, { featured: !currentFeatured });
  },

  async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) handleError(error, 'fetching categories');
    const categories = [...new Set(data?.map(p => p.category).filter(Boolean))];
    return categories;
  }
};

// ============================================
// CATALOGS SERVICE
// ============================================
export const CatalogsService = {
  async getAll(options?: { page?: number; limit?: number; search?: string; status?: string }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('catalogs')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching catalogs');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('catalogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching catalog');
    return data;
  },

  async create(catalog: Partial<Catalog>) {
    const { data, error } = await supabase
      .from('catalogs')
      .insert([catalog])
      .select()
      .single();

    if (error) handleError(error, 'creating catalog');
    return data;
  },

  async update(id: string, updates: Partial<Catalog>) {
    const { data, error } = await supabase
      .from('catalogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating catalog');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('catalogs')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting catalog');
  },

  async uploadFile(file: File): Promise<{ url: string; size: string } | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `catalog-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `catalogs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('catalogs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('catalogs')
        .getPublicUrl(filePath);

      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      return { url: data.publicUrl, size: `${sizeMB} MB` };
    } catch (error) {
      console.error('Error uploading catalog file:', error);
      return null;
    }
  },

  async incrementDownloads(id: string) {
    const { data: catalog } = await supabase
      .from('catalogs')
      .select('downloads')
      .eq('id', id)
      .single();

    if (catalog) {
      await supabase
        .from('catalogs')
        .update({ downloads: (catalog.downloads || 0) + 1 })
        .eq('id', id);
    }
  }
};

// ============================================
// INDUSTRIES SERVICE
// ============================================
export const IndustriesService = {
  async getAll(options?: { page?: number; limit?: number; search?: string; status?: string }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('industries')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching industries');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching industry');
    return data;
  },

  async create(industry: Partial<Industry>) {
    const { data, error } = await supabase
      .from('industries')
      .insert([industry])
      .select()
      .single();

    if (error) handleError(error, 'creating industry');
    return data;
  },

  async update(id: string, updates: Partial<Industry>) {
    const { data, error } = await supabase
      .from('industries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating industry');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('industries')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting industry');
  },

  async toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return this.update(id, { status: newStatus });
  },

  async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `industry-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `industries/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading industry image:', error);
      return null;
    }
  }
};

// ============================================
// INQUIRIES SERVICE
// ============================================
export const InquiriesService = {
  async getAll(options?: { page?: number; limit?: number; search?: string; status?: string }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('inquiries')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching inquiries');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching inquiry');
    return data;
  },

  async updateStatus(id: string, status: string, notes?: string) {
    const updates: any = { status };
    if (notes) updates.notes = notes;

    const { data, error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating inquiry status');
    return data;
  },

  async update(id: string, updates: Partial<Inquiry>) {
    const { data, error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating inquiry');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting inquiry');
  },

  async getStats() {
    const { data, error } = await supabase
      .from('inquiries')
      .select('status');

    if (error) handleError(error, 'fetching inquiry stats');
    
    const stats = {
      total: data?.length || 0,
      new: data?.filter(i => i.status === 'new').length || 0,
      responded: data?.filter(i => i.status === 'responded').length || 0,
      closed: data?.filter(i => i.status === 'closed').length || 0
    };
    
    return stats;
  }
};

// ============================================
// CAREERS SERVICE
// ============================================
export const CareersService = {
  async getAll(options?: { page?: number; limit?: number; search?: string; status?: string; department?: string }) {
    const { page = 1, limit = 10, search, status, department } = options || {};
    
    let query = supabase
      .from('careers')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (department) {
      query = query.eq('department', department);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('posted_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching careers');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching career');
    return data;
  },

  async create(career: Partial<Career>) {
    const { data, error } = await supabase
      .from('careers')
      .insert([career])
      .select()
      .single();

    if (error) handleError(error, 'creating career');
    return data;
  },

  async update(id: string, updates: Partial<Career>) {
    const { data, error } = await supabase
      .from('careers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating career');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('careers')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting career');
  },

  async toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return this.update(id, { status: newStatus });
  },

  // Applications
  async getApplications(careerId?: string) {
    let query = supabase
      .from('career_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (careerId) {
      query = query.eq('career_id', careerId);
    }

    const { data, error, count } = await query;
    if (error) handleError(error, 'fetching applications');
    return { data: data || [], count: count || 0 };
  },

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    const updates: any = { status };
    if (notes) updates.notes = notes;

    const { data, error } = await supabase
      .from('career_applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating application status');
    return data;
  },

  async deleteApplication(id: string) {
    const { error } = await supabase
      .from('career_applications')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting application');
  }
};

// ============================================
// DONATIONS SERVICE
// ============================================
export const DonationsService = {
  async getAll(options?: { page?: number; limit?: number; search?: string; status?: string }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('donations')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`donor_name.ilike.%${search}%,donor_email.ilike.%${search}%,transaction_id.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('payment_status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching donations');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching donation');
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('donations')
      .update({ payment_status: status })
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating donation status');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting donation');
  },

  async getStats() {
    const { data, error } = await supabase
      .from('donations')
      .select('amount, payment_status');

    if (error) handleError(error, 'fetching donation stats');
    
    const total = data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
    const completed = data?.filter(d => d.payment_status === 'completed').length || 0;
    const pending = data?.filter(d => d.payment_status === 'pending').length || 0;
    
    return { total, completed, pending, count: data?.length || 0 };
  },

  exportToCSV(donations: Donation[]) {
    const headers = ['Donor Name', 'Email', 'Phone', 'Amount', 'Currency', 'Transaction ID', 'Payment Method', 'Status', 'Message', 'Date'];
    const rows = donations.map(d => [
      d.donor_name,
      d.donor_email || '',
      d.donor_phone || '',
      d.amount,
      d.currency || 'USD',
      d.transaction_id || '',
      d.payment_method || '',
      d.payment_status,
      d.message || '',
      d.created_at ? new Date(d.created_at).toLocaleDateString() : ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }
};

// ============================================
// SHIPMENTS SERVICE
// ============================================
export const ShipmentsService = {
  async getAll(options?: { page?: number; limit?: number; search?: string; status?: string }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('shipments')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`tracking_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('shipment_status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching shipments');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching shipment');
    return data;
  },

  async getByTrackingNumber(trackingNumber: string) {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .single();

    if (error) handleError(error, 'fetching shipment by tracking');
    return data;
  },

  async create(shipment: Partial<Shipment>) {
    const trackingNumber = `SAV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const { data, error } = await supabase
      .from('shipments')
      .insert([{ ...shipment, tracking_number: trackingNumber, shipment_status: shipment.shipment_status || 'pending' }])
      .select()
      .single();

    if (error) handleError(error, 'creating shipment');
    return data;
  },

  async update(id: string, updates: Partial<Shipment>) {
    const { data, error } = await supabase
      .from('shipments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating shipment');
    return data;
  },

  async updateStatus(id: string, status: string, location?: string) {
    const updates: any = { shipment_status: status };
    if (location) updates.current_location = location;
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();

    return this.update(id, updates);
  },

  async addTrackingUpdate(id: string, update: { status: string; location: string; description: string }) {
    const { data: shipment } = await supabase
      .from('shipments')
      .select('tracking_updates')
      .eq('id', id)
      .single();

    const updates = shipment?.tracking_updates || [];
    updates.push({ ...update, timestamp: new Date().toISOString() });

    return this.update(id, { 
      tracking_updates: updates,
      shipment_status: update.status,
      current_location: update.location
    });
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting shipment');
  }
};

// ============================================
// LOGISTICS SERVICE
// ============================================
export const LogisticsService = {
  async getAll(options?: { page?: number; limit?: number; search?: string; status?: string; type?: string }) {
    const { page = 1, limit = 10, search, status, type } = options || {};
    
    let query = supabase
      .from('logistics_partners')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('partner_type', type);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching logistics partners');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('logistics_partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching logistics partner');
    return data;
  },

  async create(partner: Partial<LogisticsPartner>) {
    const { data, error } = await supabase
      .from('logistics_partners')
      .insert([partner])
      .select()
      .single();

    if (error) handleError(error, 'creating logistics partner');
    return data;
  },

  async update(id: string, updates: Partial<LogisticsPartner>) {
    const { data, error } = await supabase
      .from('logistics_partners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating logistics partner');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('logistics_partners')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting logistics partner');
  },

  async toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    return this.update(id, { status: newStatus });
  }
};

// ============================================
// BLOG POSTS SERVICE
// ============================================
export const BlogPostsService = {
  async getAll(options?: { page?: number; limit?: number; search?: string; status?: string; category?: string }) {
    const { page = 1, limit = 10, search, status, category } = options || {};
    
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching blog posts');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching blog post');
    return data;
  },

  async create(post: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();

    if (error) handleError(error, 'creating blog post');
    return data;
  },

  async update(id: string, updates: Partial<BlogPost>) {
    if (updates.status === 'published') {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating blog post');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting blog post');
  },

  async incrementViews(id: string) {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('views')
      .eq('id', id)
      .single();

    if (post) {
      await supabase
        .from('blog_posts')
        .update({ views: (post.views || 0) + 1 })
        .eq('id', id);
    }
  },

  async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading blog image:', error);
      return null;
    }
  },

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
};

// ============================================
// SETTINGS SERVICE
// ============================================
export const SettingsService = {
  async get() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) handleError(error, 'fetching settings');
    return data;
  },

  async update(settings: Partial<SiteSettings>) {
    const { data, error } = await supabase
      .from('site_settings')
      .update(settings)
      .eq('id', 1)
      .select()
      .single();

    if (error) handleError(error, 'updating settings');
    return data;
  },

  async uploadLogo(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      const filePath = `site-assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  }
};

// ============================================
// ANALYTICS SERVICE
// ============================================
export const AnalyticsService = {
  async getDashboardStats() {
    const [products, inquiries, donations, shipments, careers, leads, logisticsQuotes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }),
      supabase.from('donations').select('amount', { count: 'exact' }),
      supabase.from('shipments').select('id', { count: 'exact', head: true }),
      supabase.from('careers').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('logistics_quotes').select('estimated_cost', { count: 'exact' })
    ]);

    const totalDonations = donations.data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
    const totalLogisticsValue = logisticsQuotes.data?.reduce((sum, q) => sum + (q.estimated_cost || 0), 0) || 0;

    return {
      totalProducts: products.count || 0,
      totalInquiries: inquiries.count || 0,
      totalDonations: totalDonations,
      totalShipments: shipments.count || 0,
      totalCareers: careers.count || 0,
      totalLeads: leads.count || 0,
      totalLogisticsQuotes: logisticsQuotes.count || 0,
      totalLogisticsValue: totalLogisticsValue,
      revenue: totalDonations + totalLogisticsValue
    };
  },

  async getRecentActivity() {
    const [recentInquiries, recentDonations, recentShipments, recentLeads, recentLogisticsQuotes] = await Promise.all([
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('donations').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('shipments').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('logistics_quotes').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

    return {
      inquiries: recentInquiries.data || [],
      donations: recentDonations.data || [],
      shipments: recentShipments.data || [],
      leads: recentLeads.data || [],
      logisticsQuotes: recentLogisticsQuotes.data || []
    };
  },

  async getMonthlyTrends() {
    // Get data grouped by month for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const [inquiries, donations, leads] = await Promise.all([
      supabase.from('inquiries').select('created_at').gte('created_at', sixMonthsAgo.toISOString()),
      supabase.from('donations').select('created_at, amount').gte('created_at', sixMonthsAgo.toISOString()),
      supabase.from('leads').select('created_at').gte('created_at', sixMonthsAgo.toISOString())
    ]);

    // Group by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: Record<string, { inquiries: number; donations: number; leads: number }> = {};

    inquiries.data?.forEach(item => {
      const date = new Date(item.created_at);
      const key = months[date.getMonth()];
      if (!monthlyData[key]) monthlyData[key] = { inquiries: 0, donations: 0, leads: 0 };
      monthlyData[key].inquiries++;
    });

    donations.data?.forEach(item => {
      const date = new Date(item.created_at);
      const key = months[date.getMonth()];
      if (!monthlyData[key]) monthlyData[key] = { inquiries: 0, donations: 0, leads: 0 };
      monthlyData[key].donations += item.amount || 0;
    });

    leads.data?.forEach(item => {
      const date = new Date(item.created_at);
      const key = months[date.getMonth()];
      if (!monthlyData[key]) monthlyData[key] = { inquiries: 0, donations: 0, leads: 0 };
      monthlyData[key].leads++;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    }));
  },

  async getConversionStats() {
    const [leads, aiLeads, inquiries] = await Promise.all([
      supabase.from('leads').select('status, converted'),
      supabase.from('ai_generated_leads').select('status, buying_intent_score'),
      supabase.from('inquiries').select('status')
    ]);

    const leadStats = {
      total: leads.data?.length || 0,
      new: leads.data?.filter(l => l.status === 'new').length || 0,
      contacted: leads.data?.filter(l => l.status === 'contacted').length || 0,
      qualified: leads.data?.filter(l => l.status === 'qualified').length || 0,
      converted: leads.data?.filter(l => l.converted).length || 0
    };

    const aiLeadStats = {
      total: aiLeads.data?.length || 0,
      qualified: aiLeads.data?.filter(l => l.status === 'qualified').length || 0,
      converted: aiLeads.data?.filter(l => l.status === 'converted').length || 0,
      avgIntentScore: aiLeads.data?.length 
        ? Math.round(aiLeads.data.reduce((sum, l) => sum + (l.buying_intent_score || 0), 0) / aiLeads.data.length)
        : 0
    };

    const inquiryStats = {
      total: inquiries.data?.length || 0,
      new: inquiries.data?.filter(i => i.status === 'new').length || 0,
      responded: inquiries.data?.filter(i => i.status === 'responded').length || 0,
      closed: inquiries.data?.filter(i => i.status === 'closed').length || 0
    };

    return { leadStats, aiLeadStats, inquiryStats };
  },

  async getProductPerformance() {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, category, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) return [];
    return data || [];
  }
};
