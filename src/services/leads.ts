import { supabase } from '../lib/supabase';

export interface Lead {
  id: string;
  person_name: string;
  company_name?: string;
  country_code?: string;
  contact_number?: string;
  email?: string;
  requirement_description?: string;
  source: string;
  status: string;
  assigned_to?: string;
  notes?: string;
  converted: boolean;
  created_at: string;
}

export interface AIGeneratedLead {
  id: string;
  session_id?: string;
  person_name?: string;
  company_name?: string;
  country_code?: string;
  contact_number?: string;
  email?: string;
  requirement_description?: string;
  conversation_summary?: string;
  buying_intent_score: number;
  status: string;
  is_partial: boolean;
  created_at: string;
}

export interface LogisticsQuote {
  id: string;
  product_id?: string;
  product_name?: string;
  user_name: string;
  email: string;
  country: string;
  country_code?: string;
  delivery_address: string;
  weight?: number;
  dimensions?: string;
  estimated_cost?: number;
  currency: string;
  logistic_partner?: string;
  status: string;
  notes?: string;
  created_at: string;
}

const handleError = (error: any, operation: string) => {
  console.error(`Error ${operation}:`, error);
  throw new Error(error?.message || `Failed to ${operation}`);
};

// ============================================
// LEADS SERVICE
// ============================================
export const LeadsService = {
  async getAll(options?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
  }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`person_name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching leads');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching lead');
    return data;
  },

  async create(lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();

    if (error) handleError(error, 'creating lead');
    return data;
  },

  async update(id: string, updates: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating lead');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting lead');
  },

  async updateStatus(id: string, status: string) {
    return this.update(id, { status });
  },

  async markConverted(id: string) {
    return this.update(id, { converted: true, status: 'converted' });
  },

  async getStats() {
    const { data, error } = await supabase
      .from('leads')
      .select('status, converted');

    if (error) handleError(error, 'fetching lead stats');
    
    const stats = {
      total: data?.length || 0,
      new: data?.filter(l => l.status === 'new').length || 0,
      contacted: data?.filter(l => l.status === 'contacted').length || 0,
      qualified: data?.filter(l => l.status === 'qualified').length || 0,
      converted: data?.filter(l => l.converted).length || 0
    };
    
    return stats;
  }
};

// ============================================
// AI GENERATED LEADS SERVICE
// ============================================
export const AIGeneratedLeadsService = {
  async getAll(options?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
  }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('ai_generated_leads')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`person_name.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching AI leads');
    return { data: data || [], count: count || 0 };
  },

  async create(lead: Partial<AIGeneratedLead>) {
    const { data, error } = await supabase
      .from('ai_generated_leads')
      .insert([lead])
      .select()
      .single();

    if (error) handleError(error, 'creating AI lead');
    return data;
  },

  async createPartial(sessionId: string, data: Partial<AIGeneratedLead>) {
    return this.create({
      session_id: sessionId,
      ...data,
      is_partial: true,
      status: 'pending'
    });
  },

  async update(id: string, updates: Partial<AIGeneratedLead>) {
    const { data, error } = await supabase
      .from('ai_generated_leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating AI lead');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('ai_generated_leads')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting AI lead');
  },

  async convertToLead(id: string) {
    const aiLead = await this.getById(id);
    if (!aiLead) throw new Error('Lead not found');

    const lead = await LeadsService.create({
      person_name: aiLead.person_name || 'Unknown',
      company_name: aiLead.company_name,
      country_code: aiLead.country_code,
      contact_number: aiLead.contact_number,
      email: aiLead.email,
      requirement_description: aiLead.requirement_description,
      source: 'ai_chatbot'
    });

    await this.update(id, { status: 'converted' });
    return lead;
  },

  async getStats() {
    const { data, error } = await supabase
      .from('ai_generated_leads')
      .select('status, buying_intent_score, is_partial');

    if (error) handleError(error, 'fetching AI lead stats');
    
    const totalScore = data?.reduce((sum, l) => sum + (l.buying_intent_score || 0), 0) || 0;
    
    const stats = {
      total: data?.length || 0,
      pending: data?.filter(l => l.status === 'pending').length || 0,
      qualified: data?.filter(l => l.status === 'qualified').length || 0,
      converted: data?.filter(l => l.status === 'converted').length || 0,
      partial: data?.filter(l => l.is_partial).length || 0,
      avgIntentScore: data?.length ? Math.round(totalScore / data.length) : 0
    };
    
    return stats;
  }
};

// ============================================
// LOGISTICS QUOTES SERVICE
// ============================================
export const LogisticsQuotesService = {
  async getAll(options?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
  }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('logistics_quotes')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`user_name.ilike.%${search}%,email.ilike.%${search}%,country.ilike.%${search}%`);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) handleError(error, 'fetching logistics quotes');
    return { data: data || [], count: count || 0 };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('logistics_quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) handleError(error, 'fetching logistics quote');
    return data;
  },

  async create(quote: Partial<LogisticsQuote>) {
    const { data, error } = await supabase
      .from('logistics_quotes')
      .insert([quote])
      .select()
      .single();

    if (error) handleError(error, 'creating logistics quote');
    return data;
  },

  async calculateEstimate(weight: number, country: string, productName?: string): Promise<{ cost: number; partner: string; currency: string }> {
    // Simple estimation logic - in production, this would call a real API
    const baseRate = 25; // Base shipping rate
    const weightRate = weight * 2.5; // $2.5 per kg
    
    // Country zones (simplified)
    const countryZones: Record<string, number> = {
      'US': 1.0, 'CA': 1.1, 'UK': 1.2, 'DE': 1.2, 'FR': 1.2,
      'JP': 1.5, 'AU': 1.6, 'IN': 0.5, 'CN': 1.3, 'BR': 1.8,
      'AE': 1.4, 'SG': 1.4, 'IT': 1.2, 'ES': 1.2, 'NL': 1.2
    };
    
    const zone = countryZones[country] || 1.5;
    const estimatedCost = (baseRate + weightRate) * zone;
    
    return {
      cost: Math.round(estimatedCost * 100) / 100,
      partner: 'DHL Express',
      currency: 'USD'
    };
  },

  async update(id: string, updates: Partial<LogisticsQuote>) {
    const { data, error } = await supabase
      .from('logistics_quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) handleError(error, 'updating logistics quote');
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('logistics_quotes')
      .delete()
      .eq('id', id);

    if (error) handleError(error, 'deleting logistics quote');
  },

  async getStats() {
    const { data, error } = await supabase
      .from('logistics_quotes')
      .select('status, estimated_cost');

    if (error) handleError(error, 'fetching logistics quote stats');
    
    const totalRevenue = data?.reduce((sum, q) => sum + (q.estimated_cost || 0), 0) || 0;
    
    const stats = {
      total: data?.length || 0,
      pending: data?.filter(q => q.status === 'pending').length || 0,
      completed: data?.filter(q => q.status === 'completed').length || 0,
      totalEstimated: totalRevenue
    };
    
    return stats;
  }
};

// ============================================
// LOGISTICS PARTNERS SERVICE
// ============================================
export const LogisticsPartnersService = {
  async getInternational() {
    const { data, error } = await supabase
      .from('logistics_partners')
      .select('*')
      .eq('is_international', true)
      .eq('status', 'active')
      .order('rating', { ascending: false });

    if (error) handleError(error, 'fetching international partners');
    return data || [];
  },

  async getAll(options?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
  }) {
    const { page = 1, limit = 10, search, status } = options || {};
    
    let query = supabase
      .from('logistics_partners')
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

    if (error) handleError(error, 'fetching logistics partners');
    return { data: data || [], count: count || 0 };
  },

  async create(partner: any) {
    const { data, error } = await supabase
      .from('logistics_partners')
      .insert([partner])
      .select()
      .single();

    if (error) handleError(error, 'creating logistics partner');
    return data;
  },

  async update(id: string, updates: any) {
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
  }
};
