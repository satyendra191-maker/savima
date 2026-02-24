
import { createClient } from '@supabase/supabase-js';
import { Product, Inquiry, SiteSettings, CMSPage } from '../types';

// Use import.meta.env for Vite
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_ADMIN_KEY = import.meta.env.VITE_SUPABASE_ADMIN_KEY || 'saviman_admin_2024';

// Handle case where env vars might be the string "undefined" or empty
const isValidUrlString = (val: any): val is string => {
  return typeof val === 'string' && val.length > 0 && val !== 'undefined' && val !== 'null';
};

// Check if URL is valid (starts with https://)
const isValidSupabaseUrl = isValidUrlString(SUPABASE_URL) && SUPABASE_URL.startsWith('https://');

// Additional check: ensure key exists and is not empty
const hasValidKey = isValidUrlString(SUPABASE_ANON_KEY);

// Chainable Mock for Fallback
// This mimics the Supabase QueryBuilder interface to prevent crashes
const createMockChain = () => {
  const chain: any = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    upsert: () => chain,
    eq: () => chain,
    neq: () => chain,
    gt: () => chain,
    lt: () => chain,
    gte: () => chain,
    lte: () => chain,
    like: () => chain,
    ilike: () => chain,
    is: () => chain,
    in: () => chain,
    contains: () => chain,
    order: () => chain,
    limit: () => chain,
    range: () => chain,
    // Methods that execute the query
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    // 'then' makes this object awaitable (Thenable), resolving to a default empty list response
    then: (resolve: any) => Promise.resolve({ data: [], error: null }).then(resolve)
  };
  return chain;
};

// Create client only if URL is valid and key is present.
// We cast the mock to 'any' to bypass strict type checks for the complex Supabase client type.
const shouldUseMock = !isValidSupabaseUrl || !hasValidKey;
export const supabase = shouldUseMock
  ? {
    from: () => createMockChain(),
    storage: {
      from: () => ({
        upload: async () => ({ error: null, data: { path: '' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithOtp: async () => ({ error: null, data: { user: null, session: null } }),
      signInWithPassword: async () => ({ error: null, data: { user: null, session: null } }),
      signOut: async () => ({ error: null })
    }
  } as any
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          'x-admin-key': SUPABASE_ADMIN_KEY
        }
      }
    });

// --- FALLBACK DATA ---
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'f1',
    name: 'Precision Brass Knurled Inserts',
    slug: 'brass-knurled-inserts',
    category: 'brass',
    short_description: 'High-precision brass inserts designed for plastic injection molding, featuring diamond-knurled patterns for maximum pull-out resistance.',
    long_description: 'Our brass inserts are manufactured using premium grade CW614N/IS 319 brass. They are specifically engineered to provide superior torque and pull-out resistance when used in plastic components. Ideal for electronics, automotive, and medical device enclosures.',
    industry_usage: 'Electronics, Automotive, Medical Devices',
    technical_highlights: ['Material: CW614N Brass', 'Tolerances: ±0.01mm', 'RoHS Compliant', 'Diamond & Straight Knurling'],
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f2',
    name: 'Stainless Steel Hydraulic Fittings',
    slug: 'ss-hydraulic-fittings',
    category: 'steel',
    short_description: 'Extreme-pressure SS 316L hydraulic fittings designed for zero-leakage performance in harsh industrial environments.',
    long_description: 'Engineered for high-pressure systems, these hydraulic fittings are CNC machined from solid bar stock. The SS 316L construction ensures excellent corrosion resistance against seawater, chemicals, and extreme temperatures.',
    industry_usage: 'Oil & Gas, Marine, Hydraulics',
    technical_highlights: ['Grade: SS 316L / 304', 'Pressure: Up to 10,000 PSI', 'ISO 8434-1 Compliant', 'Zero-leakage seal'],
    image_url: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f3',
    name: 'SS-304 Heavy Duty Anchor Bolts',
    slug: 'ss-anchor-bolts',
    category: 'steel',
    short_description: 'Industrial-grade stainless steel anchor bolts for structural fastening and heavy machinery installation.',
    long_description: 'Our heavy-duty SS anchor bolts provide reliable fastening in concrete and masonry. Available in various lengths and diameters, they are used extensively in infrastructure and industrial construction projects.',
    industry_usage: 'Construction, Infrastructure, Heavy Industry',
    technical_highlights: ['Material: SS 304', 'High Tensile Strength', 'Precision Cut Threads', 'Corrosion Inhibiting Finish'],
    image_url: 'https://images.unsplash.com/photo-1563721301010-09756f2fb769?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f4',
    name: 'Brass Union Connectors',
    slug: 'brass-union-connectors',
    category: 'brass',
    short_description: 'Lead-free brass union connectors for sanitary and gas applications, ensuring durable and repeatable connections.',
    long_description: 'The Saviman brass union connectors are designed for easy assembly and disassembly without disturbing the pipeline. Manufactured with lead-free brass to meet international plumbing standards.',
    industry_usage: 'Plumbing, Gas Distribution, HVAC',
    technical_highlights: ['Lead-Free Brass', 'Precision Machined Threads', 'Easy Maintenance Design', 'Max Temp: 250°F'],
    image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5f649776?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f5',
    name: 'CNC Turned Aerospace Components',
    slug: 'cnc-aerospace-parts',
    category: 'other',
    short_description: 'Critical tolerance CNC components for aerospace and defense applications, manufactured under AS9100 quality standards.',
    long_description: 'High-precision aerospace components turned with 5-axis CNC capability. We work with exotic alloys including Titanium, Inconel, and high-grade stainless steel to meet the rigorous demands of flight-critical hardware.',
    industry_usage: 'Aerospace, Defense, Satellites',
    technical_highlights: ['Micro-Tolerance Machining', 'AS9100 Quality Standards', 'Exotic Alloy Experience', '100% Dimensional Inspection'],
    image_url: 'https://images.unsplash.com/photo-1565439320955-468cc53f938c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f6',
    name: 'Brass Gas Valve Components',
    slug: 'brass-gas-valve-components',
    category: 'brass',
    short_description: 'Safety-certified brass components for gas valves and regulators, meeting international safety standards.',
    long_description: 'Our brass gas valve components are manufactured under strict quality controls to ensure leak-proof performance. Compatible with natural gas, LPG, and compressed air systems.',
    industry_usage: 'Gas Distribution, Industrial Valves, HVAC',
    technical_highlights: ['ISO 5149 Certified', 'Lead-Free Option', 'Pressure Tested', 'Various Thread Configurations'],
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f7',
    name: 'Stainless Steel Fasteners Set',
    slug: 'ss-fasteners-set',
    category: 'steel',
    short_description: 'Comprehensive range of SS fasteners including nuts, bolts, washers, and custom special fasteners.',
    long_description: 'We manufacture a complete range of stainless steel fasteners in various grades (SS 304, 316, 316L). Our in-house tooling capabilities allow us to produce custom fastener solutions for unique applications.',
    industry_usage: 'Automotive, Construction, Marine',
    technical_highlights: ['Grades: SS 304/316/316L', 'Custom Manufacturing', 'ISO Certified', 'Bulk Production'],
    image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f8',
    name: 'Brass Electrical Terminals',
    slug: 'brass-electrical-terminals',
    category: 'brass',
    short_description: 'High-conductivity brass terminals and lugs for electrical power distribution and industrial wiring.',
    long_description: 'Our brass electrical terminals offer excellent electrical conductivity and corrosion resistance. Suitable for high-current applications in power distribution panels and industrial machinery.',
    industry_usage: 'Power Distribution, Electrical Panels, Railways',
    technical_highlights: ['99.9% Pure Brass', 'Tin Plated Option', 'High Current Rating', 'Custom Designs'],
    image_url: 'https://images.unsplash.com/photo-1555664424-778a69032054?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f9',
    name: 'Precision CNC Machined Parts',
    slug: 'cnc-machined-parts',
    category: 'other',
    short_description: 'Custom CNC machined components for various industrial applications with tight tolerances.',
    long_description: 'Our state-of-the-art CNC machining center can produce complex geometries with tolerances up to ±0.005mm. We work with all engineering materials including aluminum, steel, brass, and exotic alloys.',
    industry_usage: 'Automotive, Medical, Robotics, Industrial',
    technical_highlights: ['±0.005mm Tolerance', '4-Axis & 5-Axis', 'All Engineering Materials', 'Rapid Prototyping'],
    image_url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f10',
    name: 'Brass Plumbing Fittings',
    slug: 'brass-plumbing-fittings',
    category: 'brass',
    short_description: 'Complete range of brass plumbing fittings including elbows, tees, couplings, and adapters.',
    long_description: 'Our brass plumbing fittings are manufactured to meet international standards for potable water systems. Available in various sizes and thread configurations with optional chrome plating.',
    industry_usage: 'Residential Plumbing, Commercial Buildings, Water Treatment',
    technical_highlights: ['Lead-Free Available', 'WRAS Certified', 'Multiple Sizes', 'Chrome Plated Option'],
    image_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f11',
    name: 'Stainless Steel Springs',
    slug: 'ss-springs',
    category: 'steel',
    short_description: 'Custom-manufactured compression, tension, and torsion springs in stainless steel and exotic alloys.',
    long_description: 'We manufacture precision springs for automotive, industrial, and consumer applications. Our spring manufacturing facility can produce custom designs in various wire diameters and configurations.',
    industry_usage: 'Automotive, Industrial Machinery, Consumer Products',
    technical_highlights: ['Custom Designs', 'Various Configurations', 'SS 302/304/316', 'Quality Tested'],
    image_url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f12',
    name: 'Brass Auto Components',
    slug: 'brass-auto-components',
    category: 'brass',
    short_description: 'Precision brass components for automotive applications including fuel system and climate control parts.',
    long_description: 'Our automotive brass components meet the rigorous quality standards of the automotive industry. We supply to major OEMs and Tier 1 suppliers with complete traceability.',
    industry_usage: 'Automotive, Two-Wheelers, Commercial Vehicles',
    technical_highlights: ['IATF 16949 Compliant', 'OEM Supplier', 'Complete Traceability', 'Just-in-Time Delivery'],
    image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f13',
    name: 'Medical Grade Stainless Steel Parts',
    slug: 'medical-ss-parts',
    category: 'steel',
    short_description: 'ISO 13485 certified medical device components in surgical-grade stainless steel and titanium.',
    long_description: 'We manufacture medical device components under strict cleanroom conditions. Our facility is ISO 13485 certified and we maintain full traceability for all medical-grade products.',
    industry_usage: 'Surgical Instruments, Implants, Diagnostic Equipment',
    technical_highlights: ['ISO 13485 Certified', 'Surgical Grade SS', 'Cleanroom Manufacturing', 'Biocompatible Materials'],
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f14',
    name: 'Brass Household Fixtures',
    slug: 'brass-household-fixtures',
    category: 'brass',
    short_description: 'Premium brass fixtures for architectural and interior design applications.',
    long_description: 'Our brass household fixtures combine functionality with aesthetic appeal. Available in various finishes including chrome, nickel, and antique brass to complement modern and traditional interiors.',
    industry_usage: 'Architectural, Interior Design, Furniture',
    technical_highlights: ['Multiple Finishes', 'Custom Designs', 'Premium Quality', 'Export Grade'],
    image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f15',
    name: 'Industrial Pump Components',
    slug: 'pump-components',
    category: 'other',
    short_description: 'Precision-engineered components for industrial pumps, valves, and flow control equipment.',
    long_description: 'We manufacture critical pump components including impellers, housings, and shaft sleeves. Our expertise in precision machining ensures optimal performance and longevity of your pumping equipment.',
    industry_usage: 'Water Treatment, Oil & Gas, Chemical Processing',
    technical_highlights: ['Precision Machined', 'Various Materials', 'Balanced Design', 'Testing Available'],
    image_url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f16',
    name: 'Brass Heat Sink Inserts',
    slug: 'brass-heat-sink-inserts',
    category: 'brass',
    short_description: 'Thermally conductive brass inserts and standoffs engineered for PCB and electronic heat dissipation applications.',
    long_description: 'Our brass heat sink inserts provide excellent thermal conductivity (109 W/m·K) for electronics cooling. CNC precision-machined from free-cutting brass to ensure consistent contact surfaces. Widely used in EV battery management, telecom equipment, and industrial control panels.',
    industry_usage: 'Electronics, EV Manufacturing, Telecom, Industrial Controls',
    technical_highlights: ['Thermal Conductivity: 109 W/m·K', 'RoHS & REACH Compliant', 'ISO 2768 Tolerances', 'Custom Fin Profiles'],
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f17',
    name: 'SS 316 Ball Valves & Actuators',
    slug: 'ss-316-ball-valves',
    category: 'steel',
    short_description: 'Full-bore SS 316 ball valves with pneumatic and manual actuators for chemical, food, and pharmaceutical pipelines.',
    long_description: 'These industrial-grade SS 316 ball valves offer zero leakage with a PTFE seat and stuffing box gland. Available in 1/4" to 4" bore sizes. FDA-compliant versions available for food-grade and pharmaceutical processes. Compatible with corrosive media, steam up to 220°C, and aggressive chemicals.',
    industry_usage: 'Chemical Processing, Food & Beverage, Pharma, Oil & Gas',
    technical_highlights: ['Material: SS 316 / 316L', 'PTFE Seat, Zero-Leakage', 'Max 220°C / 40 Bar', 'FDA Grade Available'],
    image_url: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f18',
    name: 'Precision Ground Stainless Shafts',
    slug: 'precision-ground-shafts',
    category: 'steel',
    short_description: 'High-accuracy centerless ground stainless steel shafts for servo motors, linear actuators, and medical robotics.',
    long_description: 'Manufactured to h6 and g6 tolerances, our precision shafts achieve surface roughness Ra ≤0.4μm. Material options include SS 303, 304, 420, and 440C. Suitable for food processing lines, pharmaceutical automation, medical-grade robotics, and CNC machine spindles.',
    industry_usage: 'Medical Robotics, CNC Machines, Automation, Food Processing',
    technical_highlights: ['Tolerance: h6/g6', 'Surface Finish Ra ≤0.4μm', 'SS 303/304/420/440C', 'Cylindricity ≤0.005mm'],
    image_url: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f19',
    name: 'Antique Brass Architectural Hardware',
    slug: 'antique-brass-hardware',
    category: 'brass',
    short_description: 'Handcrafted antique-finish brass hardware for luxury hotels, heritage restorations, and premium interior design.',
    long_description: 'Our architectural brass hardware is forged and hand-finished to achieve a rich antique patina. Each piece passes a 200-hour salt spray test for lasting durability. We serve luxury hotel chains, heritage property restoration projects, and high-end furniture manufacturers across Europe and the Middle East.',
    industry_usage: 'Luxury Hotels, Architecture, Heritage Restoration, Interior Design',
    technical_highlights: ['200-hr Salt Spray Tested', 'Hand-Finished Patina', 'Custom Engravable', 'Export Packaged'],
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'f20',
    name: 'Marine Grade Fastener Sets',
    slug: 'marine-grade-fasteners',
    category: 'steel',
    short_description: 'A2-70 & A4-80 marine-grade stainless steel fastener kits rated for saltwater and deep-sea environments.',
    long_description: 'Designed for offshore platforms, shipbuilding, and coastal infrastructure, our marine fastener sets include bolts, nuts, and washers compliant with ASTM F593 and ISO 3506-A4. Each batch is electropolished and passivated for maximum pitting and crevice corrosion resistance in chloride-rich marine environments.',
    industry_usage: 'Shipbuilding, Offshore Oil Rigs, Port Infrastructure, Marine Engines',
    technical_highlights: ['Grade: A4-80 / A2-70', 'ASTM F593 / ISO 3506', 'Electropolished & Passivated', 'Certified Mill Reports'],
    image_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80'
  }
];

// --- DATA SERVICES ---

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn("Using fallback product data.");
      return DEFAULT_PRODUCTS;
    }
    return data;
  },

  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }
    return data || [];
  },

  async getBySlug(slug: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return undefined;
    return data;
  },

  async create(product: Omit<Product, 'id'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Product>) {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

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
  }
};

export const InquiryService = {
  async create(inquiry: Omit<Inquiry, 'id' | 'created_at' | 'status'>) {
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([inquiry]);

      if (error) throw error;
    } catch (e) {
      console.warn("Inquiries table not available");
    }
  },

  async getAll(): Promise<Inquiry[]> {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn("Inquiries fetch error, using empty array");
        return [];
      }
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async uploadAttachment(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `inquiry-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('saviman-inquiries')
        .upload(fileName, file);

      if (uploadError) {
        console.error("Supabase Storage Error:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('saviman-inquiries')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Attachment upload failed:', error.message);
      throw new Error(`Upload failed: ${error.message || 'Bucket not found'}`);
    }
  }
};

export const CMSService = {
  async getSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .maybeSingle();

    // Provide defaults if missing
    if (error || !data) return {
      id: 1,
      site_name: 'Saviman Industries',
      contact_email: 'export@saviman.com',
      contact_phone: '+91 98765 43210',
      address: '',
      footer_text: '© 2024 Saviman Industries',
      social_links: {}
    };

    return {
      ...data,
      social_links: data.social_links || {}
    };
  },

  async updateSettings(settings: Partial<SiteSettings>) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, ...settings });

    if (error) throw error;
  },

  async getAllPages(): Promise<CMSPage[]> {
    try {
      const { data, error } = await supabase.from('cms_pages').select('*');
      if (error) {
        console.warn("CMS pages table not available, using defaults");
        return [];
      }
      return data || [];
    } catch (e) {
      console.warn("CMS pages error, using defaults");
      return [];
    }
  },

  async getPage(slug: string): Promise<CMSPage | null> {
    try {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async updatePage(slug: string, pageData: Partial<CMSPage>) {
    const { data: existing } = await supabase.from('cms_pages').select('id').eq('slug', slug).single();

    if (existing) {
      const { error } = await supabase
        .from('cms_pages')
        .update(pageData)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cms_pages')
        .insert([{ ...pageData, slug }]);
      if (error) throw error;
    }
  }
};

// ============================================
// CMS CRUD SERVICES FOR ADMIN
// ============================================

export const CMSProductsService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_PRODUCTS;
    }
    return data;
  },

  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async create(product: Omit<Product, 'id'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Product>) {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const CMSIndustriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async create(industry: { name: string; slug: string; description?: string; status?: string }) {
    const { data, error } = await supabase
      .from('industries')
      .insert([industry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<{ name: string; description: string; status: string }>) {
    const { error } = await supabase
      .from('industries')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('industries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const CMSBlogsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  },

  async create(blog: { title: string; slug: string; excerpt?: string; content?: string; category?: string; status?: string }) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([blog])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<{ title: string; excerpt: string; content: string; category: string; status: string }>) {
    const { error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const CMSCareersService = {
  async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('career_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return DEMO_CAREERS;
    return data || [];
  },

  async create(data: {
    name: string;
    email: string;
    phone: string;
    position: string;
    resume_url?: string;
  }) {
    const { data: result, error } = await supabase
      .from('career_applications')
      .insert([{
        ...data,
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async uploadResume(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('career_applications')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('career_applications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Demo data for career applications
const DEMO_CAREERS = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul.sharma@email.com', phone: '+91 98765 43210', position: 'Mechanical Engineer', status: 'new', resume_url: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf', created_at: '2024-02-21' },
  { id: '2', name: 'Priya Patel', email: 'priya.patel@email.com', phone: '+91 87654 32109', position: 'Quality Engineer', status: 'reviewing', resume_url: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf', created_at: '2024-02-20' },
  { id: '3', name: 'Amit Kumar', email: 'amit.kumar@email.com', phone: '+91 76543 21098', position: 'CNC Operator', status: 'interview', resume_url: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf', created_at: '2024-02-19' },
  { id: '4', name: 'Sneha Reddy', email: 'sneha.reddy@email.com', phone: '+91 65432 10987', position: 'Production Manager', status: 'new', resume_url: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf', created_at: '2024-02-18' },
];

// Donations Service
export const CMSDonationsService = {
  async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return DEMO_DONATIONS;
    return data || [];
  },

  async create(data: {
    donor_name: string;
    donor_email: string;
    amount: number;
    message?: string;
    payment_method?: string;
    payment_status?: string;
    transaction_id?: string;
  }) {
    const { data: result, error } = await supabase
      .from('donations')
      .insert([{
        donor_name: data.donor_name,
        donor_email: data.donor_email,
        amount: data.amount,
        message: data.message || '',
        payment_method: data.payment_method || 'online',
        payment_status: data.payment_status || 'pending',
        transaction_id: data.transaction_id || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('donations')
      .update({ payment_status: status })
      .eq('id', id);

    if (error) throw error;
  },

  async update(id: string, data: {
    transaction_id?: string;
    payment_method?: string;
    payment_status?: string;
    amount?: number;
  }) {
    const { error } = await supabase
      .from('donations')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Demo donations data
const DEMO_DONATIONS = [
  { id: '1', donor_name: 'John Smith', donor_email: 'john@example.com', amount: 5000, message: 'For education', payment_status: 'completed', payment_method: 'UPI', transaction_id: 'TXN-20240221-ABC123', created_at: '2024-02-21' },
  { id: '2', donor_name: 'Sarah Johnson', donor_email: 'sarah@example.com', amount: 10000, message: 'Help children learn', payment_status: 'completed', payment_method: 'Card', transaction_id: 'TXN-20240220-DEF456', created_at: '2024-02-20' },
  { id: '3', donor_name: 'Mike Davis', donor_email: 'mike@example.com', amount: 2500, message: '', payment_status: 'pending', payment_method: 'Bank Transfer', transaction_id: 'TXN-20240219-GHI789', created_at: '2024-02-19' },
];

// Catalog Service
export const CMSCatalogService = {
  async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('catalogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return DEMO_CATALOGS;
    return data || [];
  },

  async create(data: {
    title: string;
    description: string;
    pages: number;
    size: string;
    thumbnail?: string;
    download_url?: string;
  }) {
    const { data: result, error } = await supabase
      .from('catalogs')
      .insert([{
        ...data,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async update(id: string, data: {
    title?: string;
    description?: string;
    pages?: number;
    size?: string;
    thumbnail?: string;
    download_url?: string;
    status?: string;
  }) {
    const { error } = await supabase
      .from('catalogs')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('catalogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Demo catalogs data
const DEMO_CATALOGS = [
  { id: '1', title: 'Brass Components Catalog 2024', description: 'Complete guide to brass inserts, turned parts, and fasteners', pages: 48, size: '4.5 MB', status: 'active', created_at: '2024-01-15' },
  { id: '2', title: 'Stainless Steel Solutions', description: 'Technical specifications for SS 304, 316, and specialized alloys', pages: 32, size: '3.2 MB', status: 'active', created_at: '2024-01-10' },
  { id: '3', title: 'Custom Manufacturing Capabilities', description: 'Overview of CNC, forging, and casting capabilities', pages: 24, size: '2.8 MB', status: 'active', created_at: '2024-01-05' },
];

// Export donations to CSV
export const exportDonationsToCSV = () => {
  const donations = DEMO_DONATIONS;
  const headers = ['Donor Name', 'Email', 'Amount', 'Transaction ID', 'Payment Mode', 'Status', 'Date'];
  const rows = donations.map(d => [
    d.donor_name,
    d.donor_email,
    d.amount,
    d.transaction_id,
    d.payment_method,
    d.payment_status,
    d.created_at
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `donations_report_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

export const CMSInquiriesService = {
  async getAll(): Promise<Inquiry[]> {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return DEMO_INQUIRIES as unknown as Inquiry[];
    return data || [];
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Demo data for fallback
const DEMO_INQUIRIES = [
  { id: '1', name: 'John Smith', company: 'TechCorp', email: 'john@techcorp.com', product: 'Brass Inserts', status: 'new', created_at: '2024-02-21' },
  { id: '2', name: 'Maria Garcia', company: 'AutoParts Ltd', email: 'maria@autoparts.com', product: 'Hydraulic Fittings', status: 'contacted', created_at: '2024-02-20' },
  { id: '3', name: 'Hans Mueller', company: 'GermanEng', email: 'hans@germaneng.de', product: 'SS Fasteners', status: 'quoted', created_at: '2024-02-19' },
  { id: '4', name: 'Akira Tanaka', company: 'TokyoMfg', email: 'akira@tokyo.co.jp', product: 'Precision Turned Parts', status: 'won', created_at: '2024-02-18' },
];

// ============================================
// EXPORT FUNCTIONS
// ============================================

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? '' : String(value);
        return stringValue.includes(',') || stringValue.includes('"') 
          ? `"${stringValue.replace(/"/g, '""')}"` 
          : stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportProductsToCSV = async () => {
  const products = await CMSProductsService.getAll();
  const exportData = products.map(p => ({
    Name: p.name,
    Slug: p.slug,
    Category: p.category,
    Short_Description: p.short_description,
    Long_Description: p.long_description,
    Industry_Usage: p.industry_usage,
    Technical_Highlights: p.technical_highlights?.join('; '),
    Image_URL: p.image_url,
    Status: p.status || 'active',
    Created_At: p.created_at
  }));
  exportToCSV(exportData, 'products');
};

export const exportInquiriesToCSV = async () => {
  const inquiries = await CMSInquiriesService.getAll();
  const exportData = inquiries.map(i => ({
    Name: i.name,
    Company: i.company,
    Email: i.email,
    Phone: i.phone,
    Product: i.product,
    Message: i.message,
    Status: i.status,
    Created_At: i.created_at
  }));
  exportToCSV(exportData, 'inquiries');
};

export const exportIndustriesToCSV = async () => {
  const industries = await CMSIndustriesService.getAll();
  const exportData = industries.map(i => ({
    Name: i.name,
    Slug: i.slug,
    Description: i.description,
    Status: i.status || 'active',
    Created_At: i.created_at
  }));
  exportToCSV(exportData, 'industries');
};

export const exportBlogsToCSV = async () => {
  const blogs = await CMSBlogsService.getAll();
  const exportData = blogs.map(b => ({
    Title: b.title,
    Slug: b.slug,
    Excerpt: b.excerpt,
    Category: b.category,
    Status: b.status,
    Views: b.views,
    Created_At: b.created_at,
    Published_At: b.published_at
  }));
  exportToCSV(exportData, 'blogs');
};

// Shipments Service - Real-time tracking with logistics partners
export const CMSShipmentsService = {
  async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return DEMO_SHIPMENTS;
    return data || [];
  },

  async getByTracking(trackingNumber: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .single();

    if (error) {
      // Try demo shipments
      return DEMO_SHIPMENTS.find(s => s.tracking_number === trackingNumber) || null;
    }
    return data;
  },

  async create(data: {
    order_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    product_details: string;
    weight: number;
    dimensions?: string;
    logistic_partner: string;
    status: string;
    current_location: string;
    estimated_delivery: string;
  }) {
    const trackingNumber = `SAV-IN-${Date.now().toString().slice(-8)}`;
    
    const { data: result, error } = await supabase
      .from('shipments')
      .insert([{
        ...data,
        tracking_number: trackingNumber,
        status: 'processing'
      }])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async updateStatus(id: string, status: string, location?: string) {
    const updates: any = { status };
    if (location) updates.current_location = location;
    
    const { data, error } = await supabase
      .from('shipments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addTrackingUpdate(id: string, update: {
    status: string;
    location: string;
    description: string;
    timestamp?: string;
  }) {
    const { data: shipment } = await supabase
      .from('shipments')
      .select('tracking_updates')
      .eq('id', id)
      .single();

    const updates = shipment?.tracking_updates || [];
    updates.push({
      ...update,
      timestamp: update.timestamp || new Date().toISOString()
    });

    const { data, error } = await supabase
      .from('shipments')
      .update({ 
        tracking_updates: updates,
        status: update.status,
        current_location: update.location
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Demo shipments data
const DEMO_SHIPMENTS = [
  {
    id: '1',
    tracking_number: 'SAV-IN-2024-001',
    order_id: 'ORD-001',
    customer_name: 'Robert Chen',
    customer_email: 'robert@globalauto.de',
    customer_phone: '+49 123456789',
    shipping_address: 'Industriestraße 45, 80331 München, Germany',
    product_details: 'Brass Inserts - 1000 pcs',
    weight: 2.5,
    dimensions: '20x15x10 cm',
    logistic_partner: 'DHL Express',
    status: 'in_transit',
    current_location: 'Frankfurt, Germany',
    estimated_delivery: '2024-02-28',
    tracking_updates: [
      { status: 'processing', location: 'Jamnagar, India', description: 'Order confirmed and processing', timestamp: '2024-02-20T10:00:00Z' },
      { status: 'shipped', location: 'Jamnagar, India', description: 'Package dispatched from warehouse', timestamp: '2024-02-21T14:30:00Z' },
      { status: 'in_transit', location: 'Mumbai, India', description: 'Arrived at Mumbai sorting facility', timestamp: '2024-02-22T08:00:00Z' },
      { status: 'in_transit', location: 'Frankfurt, Germany', description: 'In transit to destination', timestamp: '2024-02-24T12:00:00Z' }
    ],
    created_at: '2024-02-20'
  },
  {
    id: '2',
    tracking_number: 'SAV-IN-2024-002',
    order_id: 'ORD-002',
    customer_name: 'John Smith',
    customer_email: 'john@usaindustries.com',
    customer_phone: '+1 555-123-4567',
    shipping_address: '123 Industrial Ave, Detroit, MI 48201, USA',
    product_details: 'SS Fasteners - 500 pcs',
    weight: 1.2,
    dimensions: '15x10x8 cm',
    logistic_partner: 'FedEx',
    status: 'delivered',
    current_location: 'Detroit, USA',
    estimated_delivery: '2024-02-18',
    tracking_updates: [
      { status: 'processing', location: 'Jamnagar, India', description: 'Order confirmed', timestamp: '2024-02-15T09:00:00Z' },
      { status: 'shipped', location: 'Jamnagar, India', description: 'Package dispatched', timestamp: '2024-02-16T11:00:00Z' },
      { status: 'in_transit', location: 'New York, USA', description: 'Customs cleared', timestamp: '2024-02-17T14:00:00Z' },
      { status: 'out_for_delivery', location: 'Detroit, USA', description: 'Out for delivery', timestamp: '2024-02-18T08:00:00Z' },
      { status: 'delivered', location: 'Detroit, USA', description: 'Delivered successfully', timestamp: '2024-02-18T15:30:00Z' }
    ],
    created_at: '2024-02-15'
  },
  {
    id: '3',
    tracking_number: 'SAV-IN-2024-003',
    order_id: 'ORD-003',
    customer_name: 'Yuki Tanaka',
    customer_email: 'yuki@japantech.co.jp',
    customer_phone: '+81 90-1234-5678',
    shipping_address: '2-4-1 Marunouchi, Chiyoda, Tokyo 100-0005, Japan',
    product_details: 'Precision Turned Parts - 200 pcs',
    weight: 0.8,
    dimensions: '10x8x5 cm',
    logistic_partner: 'UPS',
    status: 'processing',
    current_location: 'Jamnagar, India',
    estimated_delivery: '2024-03-05',
    tracking_updates: [
      { status: 'processing', location: 'Jamnagar, India', description: 'Order confirmed and being prepared', timestamp: '2024-02-23T10:00:00Z' }
    ],
    created_at: '2024-02-23'
  }
];

// Export Service - Admin Only PDF, Excel, DOC
export const CMSExportService = {
  isAdmin: (): boolean => {
    const role = localStorage.getItem('saviman_admin_role');
    return role === 'admin' || !role;
  },

  exportToExcel: async (data: any[], filename: string, title: string) => {
    if (!CMSExportService.isAdmin()) {
      alert('Only administrators can export data.');
      return;
    }
    const headers = Object.keys(data[0] || {});
    let xlsContent = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>';
    xlsContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
    xlsContent += '<Worksheet ss:Name="' + title + '"><Table>';
    xlsContent += '<Row>';
    headers.forEach(h => xlsContent += '<Cell><Data ss:Type="String">' + h + '</Data></Cell>');
    xlsContent += '</Row>';
    data.forEach(row => {
      xlsContent += '<Row>';
      headers.forEach(h => xlsContent += '<Cell><Data ss:Type="String">' + String(row[h] || '') + '</Data></Cell>');
      xlsContent += '</Row>';
    });
    xlsContent += '</Table></Worksheet></Workbook>';
    const blob = new Blob([xlsContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + '_' + new Date().toISOString().split('T')[0] + '.xls';
    link.click();
  },

  exportToPDF: async (data: any[], filename: string, title: string) => {
    if (!CMSExportService.isAdmin()) {
      alert('Only administrators can export data.');
      return;
    }
    const headers = Object.keys(data[0] || {});
    const html = `<!DOCTYPE html><html><head><title>${title}</title><style>
      body{font-family:Arial;padding:20px}h1{color:#1a1a1a;border-bottom:2px solid #007BFF}
      table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#007BFF;color:white;padding:12px;text-align:left}
      td{padding:10px;border-bottom:1px solid #ddd}tr:nth-child(even){background:#f9f9f9}</style></head><body>
      <h1>${title}</h1><table><thead><tr>${headers.map(h=>`<th>${h.replace(/_/g,' ')}</th>`).join('')}</tr></thead>
      <tbody>${data.map(row=>`<tr>${headers.map(h=>`<td>${row[h]||''}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <p style="font-size:12px;color:#666;">Generated by Saviman CMS on ${new Date().toLocaleDateString()}</p><script>window.print()</script></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + '_' + new Date().toISOString().split('T')[0] + '.pdf.html';
    link.click();
  },

  exportToDOC: async (data: any[], filename: string, title: string) => {
    if (!CMSExportService.isAdmin()) {
      alert('Only administrators can export data.');
      return;
    }
    const headers = Object.keys(data[0] || {});
    const docContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><title>${title}</title><style>
        body{font-family:Arial}h1{color:#1a1a1a}table{width:100%;border-collapse:collapse}
        th{background:#007BFF;color:white;padding:10px;text-align:left}td{padding:8px;border:1px solid #ddd}
      </style></head><body><h1>${title}</h1>
      <table><thead><tr>${headers.map(h=>`<th>${h.replace(/_/g,' ')}</th>`).join('')}</tr></thead>
      <tbody>${data.map(row=>`<tr>${headers.map(h=>`<td>${row[h]||''}</td>`).join('')}</tr>`).join('')}</tbody></table>
      <p style="font-size:12px;color:#666;">Generated by Saviman CMS on ${new Date().toLocaleDateString()}</p></body></html>`;
    const blob = new Blob([docContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename + '_' + new Date().toISOString().split('T')[0] + '.doc';
    link.click();
  },

  exportProducts: async (format: 'excel' | 'pdf' | 'doc') => {
    const products = await CMSProductsService.getAll();
    const exportData = products.map(p => ({ Name: p.name, Category: p.category, Slug: p.slug, Description: p.short_description, Status: p.status, Created: p.created_at }));
    if (format === 'excel') CMSExportService.exportToExcel(exportData, 'products', 'Products Report');
    else if (format === 'pdf') CMSExportService.exportToPDF(exportData, 'products', 'Products Report');
    else CMSExportService.exportToDOC(exportData, 'products', 'Products Report');
  },

  exportInquiries: async (format: 'excel' | 'pdf' | 'doc') => {
    const inquiries = await CMSInquiriesService.getAll();
    const exportData = inquiries.map(i => ({ Name: i.name, Company: i.company, Email: i.email, Phone: i.phone, Product: i.product, Status: i.status, Created: i.created_at }));
    if (format === 'excel') CMSExportService.exportToExcel(exportData, 'inquiries', 'Inquiries Report');
    else if (format === 'pdf') CMSExportService.exportToPDF(exportData, 'inquiries', 'Inquiries Report');
    else CMSExportService.exportToDOC(exportData, 'inquiries', 'Inquiries Report');
  },

  exportDonations: async (format: 'excel' | 'pdf' | 'doc') => {
    const donations = await CMSDonationsService.getAll();
    const exportData = donations.map(d => ({ Donor: d.donor_name, Email: d.donor_email, Amount: d.amount, Currency: d.currency || 'INR', Method: d.payment_method, Transaction: d.transaction_id, Status: d.payment_status, Date: d.created_at }));
    if (format === 'excel') CMSExportService.exportToExcel(exportData, 'donations', 'Donations Report');
    else if (format === 'pdf') CMSExportService.exportToPDF(exportData, 'donations', 'Donations Report');
    else CMSExportService.exportToDOC(exportData, 'donations', 'Donations Report');
  },

  exportShipments: async (format: 'excel' | 'pdf' | 'doc') => {
    const shipments = await CMSShipmentsService.getAll();
    const exportData = shipments.map(s => ({ Tracking: s.tracking_number, Order: s.order_id, Customer: s.customer_name, Email: s.customer_email, Partner: s.logistic_partner, Status: s.status, Location: s.current_location, ETA: s.estimated_delivery, Created: s.created_at }));
    if (format === 'excel') CMSExportService.exportToExcel(exportData, 'shipments', 'Shipments Report');
    else if (format === 'pdf') CMSExportService.exportToPDF(exportData, 'shipments', 'Shipments Report');
    else CMSExportService.exportToDOC(exportData, 'shipments', 'Shipments Report');
  }
};

// Logistics Partners Service
export const CMSLogisticsService = {
  async getAll(): Promise<any[]> {
    const { data, error } = await supabase
      .from('logistics_partners')
      .select('*')
      .order('name', { ascending: true });

    if (error) return DEMO_LOGISTICS_PARTNERS;
    return data || [];
  },

  async getById(id: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('logistics_partners')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async create(data: {
    name: string;
    type: 'national' | 'international';
    coverage: string[];
    services: string[];
    tracking_url: string;
    api_integration: boolean;
    status: 'active' | 'inactive';
  }) {
    const { data: result, error } = await supabase
      .from('logistics_partners')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async update(id: string, data: Partial<{
    name: string;
    type: 'national' | 'international';
    coverage: string[];
    services: string[];
    tracking_url: string;
    api_integration: boolean;
    status: 'active' | 'inactive';
  }>) {
    const { data: result, error } = await supabase
      .from('logistics_partners')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('logistics_partners')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get partners by type
  async getByType(type: 'national' | 'international'): Promise<any[]> {
    const { data, error } = await supabase
      .from('logistics_partners')
      .select('*')
      .eq('type', type)
      .eq('status', 'active')
      .order('name', { ascending: true });

    if (error) return DEMO_LOGISTICS_PARTNERS.filter(p => p.type === type);
    return data || [];
  }
};

// Demo Logistics Partners Data
const DEMO_LOGISTICS_PARTNERS = [
  {
    id: '1',
    name: 'DHL Express',
    type: 'international',
    coverage: ['USA', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Canada', 'UAE', 'Singapore'],
    services: ['Express Delivery', 'Air Freight', 'Ocean Freight', 'Customs Clearance', 'Warehousing'],
    tracking_url: 'https://www.dhl.com/en/express/tracking.html',
    api_integration: true,
    status: 'active',
    logo_url: 'https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg',
    description: 'Global leader in logistics and express delivery services'
  },
  {
    id: '2',
    name: 'FedEx',
    type: 'international',
    coverage: ['USA', 'Canada', 'Mexico', 'UK', 'Germany', 'France', 'Japan', 'China', 'India'],
    services: ['Express', 'Freight', 'Ground', 'International Priority', 'Customs Clearance'],
    tracking_url: 'https://www.fedex.com/fedextrack/',
    api_integration: true,
    status: 'active',
    logo_url: 'https://www.fedex.com/content/dam/fedex-com/logos/logo.png',
    description: 'World\'s largest express transportation company'
  },
  {
    id: '3',
    name: 'UPS',
    type: 'international',
    coverage: ['USA', 'UK', 'Germany', 'Canada', 'Japan', 'France', 'Italy', 'Spain', 'China'],
    services: ['UPS Ground', 'UPS Air', 'UPS Worldwide', 'UPS Freight', 'UPS Supply Chain'],
    tracking_url: 'https://www.ups.com/track',
    api_integration: true,
    status: 'active',
    logo_url: 'https://www.ups.com/assets/resources/webcontent/images/ups-logo.svg',
    description: 'Global package delivery and logistics services'
  },
  {
    id: '4',
    name: 'Shiprocket',
    type: 'national',
    coverage: ['All India', '22000+ PIN codes'],
    services: ['Domestic Shipping', 'COD', 'Reverse Logistics', 'NDR Management', 'Warehouse'],
    tracking_url: 'https://shiprocket.co/tracking/',
    api_integration: true,
    status: 'active',
    logo_url: 'https://www.shiprocket.in/wp-content/uploads/2021/08/shiprocket-logo.png',
    description: 'India\'s leading logistics and shipping aggregator'
  },
  {
    id: '5',
    name: 'Blinkit',
    type: 'national',
    coverage: ['Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'],
    services: ['Same Day Delivery', 'Express Delivery', 'Quick Commerce'],
    tracking_url: 'https://blinkit.com/',
    api_integration: true,
    status: 'active',
    logo_url: 'https://blinkit.com/images/logo.png',
    description: 'Instant delivery platform for quick commerce'
  },
  {
    id: '6',
    name: 'DTDC',
    type: 'national',
    coverage: ['All India', '24000+ PIN codes'],
    services: ['Express Delivery', 'Surface', 'Air Cargo', 'International', 'E-commerce'],
    tracking_url: 'https://www.dtdc.in/',
    api_integration: true,
    status: 'active',
    logo_url: 'https://www.dtdc.com/images/logo.png',
    description: 'India\'s leading domestic cargo services'
  },
  {
    id: '7',
    name: 'Blue Dart',
    type: 'national',
    coverage: ['All India', '35000+ PIN codes'],
    services: ['Express Delivery', 'Air Freight', 'Surface', 'Customs', 'Supply Chain'],
    tracking_url: 'https://www.bluedart.com/',
    api_integration: true,
    status: 'active',
    logo_url: 'https://www.bluedart.com/assets/images/logo.png',
    description: 'India\'s premier express cargo services provider'
  },
  {
    id: '8',
    name: 'Maersk',
    type: 'international',
    coverage: ['Global', '130+ Countries', 'Ports Worldwide'],
    services: ['Ocean Shipping', 'Container Terminals', 'Port Operations', 'Supply Chain'],
    tracking_url: 'https://www.maersk.com/tracking/',
    api_integration: true,
    status: 'active',
    logo_url: 'https://www.maersk.com/-/media/maersk/logo.svg',
    description: 'Global container logistics leader'
  }
];

// ============================================
// VISITOR TRACKING SERVICE (Cookie Lead Intelligence)
// ============================================

const SESSION_COOKIE_NAME = 'antigravit_session';
const SESSION_DURATION_DAYS = 30;

function generateSessionId(): string {
  return 'sess_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number = SESSION_DURATION_DAYS): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getUTMParams(): { source?: string; medium?: string; campaign?: string; term?: string; content?: string } {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined
  };
}

function getDeviceInfo(): { device_type?: string; browser?: string; os?: string } {
  if (typeof navigator === 'undefined') return {};
  
  const ua = navigator.userAgent;
  let device_type = 'desktop';
  if (/mobile/i.test(ua)) device_type = 'mobile';
  else if (/tablet/i.test(ua)) device_type = 'tablet';
  
  let browser = 'Unknown';
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/edge/i.test(ua)) browser = 'Edge';
  
  let os = 'Unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac/i.test(ua)) os = 'MacOS';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/ios|iphone|ipad/i.test(ua)) os = 'iOS';
  
  return { device_type, browser, os };
}

export const VisitorTrackingService = {
  getSessionId: (): string => {
    let sessionId = getCookie(SESSION_COOKIE_NAME);
    if (!sessionId) {
      sessionId = generateSessionId();
      setCookie(SESSION_COOKIE_NAME, sessionId);
    }
    return sessionId;
  },

  initSession: async (): Promise<string> => {
    const sessionId = VisitorTrackingService.getSessionId();
    const utm = getUTMParams();
    const device = getDeviceInfo();
    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    try {
      await supabase
        .from('visitor_sessions')
        .upsert([{
          session_id: sessionId,
          visited_pages: [window.location.pathname],
          referrer,
          utm_source: utm.source,
          utm_medium: utm.medium,
          utm_campaign: utm.campaign,
          utm_term: utm.term,
          utm_content: utm.content,
          device_type: device.device_type,
          browser: device.browser,
          os: device.os,
          cookies_consented: localStorage.getItem('cookie_consent') === 'accepted'
        }], { onConflict: 'session_id' });
    } catch (e) {
      console.warn('Visitor session tracking not available');
    }

    return sessionId;
  },

  trackPageVisit: async (pageUrl: string): Promise<void> => {
    const sessionId = getCookie(SESSION_COOKIE_NAME);
    if (!sessionId) {
      await VisitorTrackingService.initSession();
      return;
    }

    try {
      const { data: session } = await supabase
        .from('visitor_sessions')
        .select('visited_pages')
        .eq('session_id', sessionId)
        .single();

      if (session) {
        const pages = session.visited_pages || [];
        if (!pages.includes(pageUrl)) {
          pages.push(pageUrl);
          await supabase
            .from('visitor_sessions')
            .update({
              visited_pages: pages,
              last_visit_at: new Date().toISOString()
            })
            .eq('session_id', sessionId);
        }
      }
    } catch (e) {
      console.warn('Page visit tracking not available');
    }
  },

  updateConsent: async (consented: boolean): Promise<void> => {
    const sessionId = getCookie(SESSION_COOKIE_NAME);
    if (!sessionId) return;

    try {
      await supabase
        .from('visitor_sessions')
        .update({ cookies_consented: consented })
        .eq('session_id', sessionId);
    } catch (e) {
      console.warn('Consent update failed');
    }
  },

  getSession: async (): Promise<any | null> => {
    const sessionId = getCookie(SESSION_COOKIE_NAME);
    if (!sessionId) return null;

    try {
      const { data } = await supabase
        .from('visitor_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      return data;
    } catch (e) {
      return null;
    }
  }
};

// ============================================
// LEAD SERVICE
// ============================================

export const LeadService = {
  async create(lead: {
    full_name: string;
    company_name?: string;
    email: string;
    phone?: string;
    country_code?: string;
    message?: string;
    material_details?: string;
    file_url?: string;
    source_page?: string;
  }): Promise<any> {
    const sessionId = getCookie(SESSION_COOKIE_NAME);
    
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        ...lead,
        session_id: sessionId,
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(filters?: { status?: string; assigned_to?: string }): Promise<any[]> {
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }

    const { data, error } = await query;
    if (error) return [];
    return data || [];
  },

  async update(id: string, updates: {
    status?: string;
    priority?: string;
    notes?: string;
    assigned_to?: string;
    buying_intent_score?: number;
  }): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ============================================
// AUDIT LOG SERVICE
// ============================================

export const AuditLogService = {
  async log(action: string, tableName: string, recordId: string, oldValues?: any, newValues?: any): Promise<void> {
    try {
      await supabase
        .from('audit_logs')
        .insert([{
          action,
          table_name: tableName,
          record_id: recordId,
          old_values: oldValues,
          new_values: newValues,
          created_at: new Date().toISOString()
        }]);
    } catch (e) {
      console.warn('Audit log failed:', e);
    }
  },

  async getRecent(limit: number = 50): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async getByTable(tableName: string, limit: number = 50): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', tableName)
        .order('created_at', { ascending: false })
        .limit(limit);
      return data || [];
    } catch (e) {
      return [];
    }
  },

  async getByActor(actorId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('actor_id', actorId)
        .order('created_at', { ascending: false })
        .limit(limit);
      return data || [];
    } catch (e) {
      return [];
    }
  }
};

// ============================================
// ORDER SERVICE
// ============================================

export const OrderService = {
  async create(order: {
    customer_name: string;
    customer_company?: string;
    email: string;
    phone?: string;
    billing_address?: string;
    shipping_address?: string;
    items?: any[];
    total_amount: number;
    currency?: string;
    payment_gateway?: string;
    payment_method?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        ...order,
        payment_status: 'pending',
        order_status: 'Order Confirmed'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(filters?: { status?: string; payment_status?: string }): Promise<any[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('order_status', filters.status);
    }
    if (filters?.payment_status) {
      query = query.eq('payment_status', filters.payment_status);
    }

    const { data, error } = await query;
    if (error) return DEMO_ORDERS;
    return data || [];
  },

  async getByTransaction(transactionId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error) return DEMO_ORDERS.find(o => o.transaction_id === transactionId) || null;
    return data;
  },

  async updateStatus(id: string, status: string, paymentStatus?: string): Promise<void> {
    const updates: any = { order_status: status };
    if (paymentStatus) updates.payment_status = paymentStatus;

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    // Add tracking entry
    await supabase
      .from('order_tracking')
      .insert([{
        order_id: id,
        status,
        description: `Order status updated to ${status}`,
        created_at: new Date().toISOString()
      }]);
  },

  async getTracking(orderId: string): Promise<any[]> {
    const { data } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });
    return data || [];
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Demo Orders
const DEMO_ORDERS = [
  {
    id: '1',
    transaction_id: 'ORD-000001',
    customer_name: 'John Smith',
    customer_company: 'TechCorp Industries',
    email: 'john@techcorp.com',
    phone: '+1 555-123-4567',
    total_amount: 25000,
    currency: 'USD',
    payment_status: 'completed',
    order_status: 'Delivered',
    items: [{ name: 'Brass Inserts', quantity: 1000, price: 25 }],
    created_at: '2024-02-15'
  },
  {
    id: '2',
    transaction_id: 'ORD-000002',
    customer_name: 'Maria Garcia',
    customer_company: 'AutoParts Ltd',
    email: 'maria@autoparts.com',
    phone: '+34 612 345 678',
    total_amount: 45000,
    currency: 'USD',
    payment_status: 'completed',
    order_status: 'Dispatched',
    items: [{ name: 'SS Hydraulic Fittings', quantity: 500, price: 90 }],
    created_at: '2024-02-20'
  },
  {
    id: '3',
    transaction_id: 'ORD-000003',
    customer_name: 'Hans Mueller',
    customer_company: 'GermanEng GmbH',
    email: 'hans@germaneng.de',
    phone: '+49 171 2345678',
    total_amount: 12500,
    currency: 'USD',
    payment_status: 'pending',
    order_status: 'Order Confirmed',
    items: [{ name: 'Precision CNC Parts', quantity: 50, price: 250 }],
    created_at: '2024-02-22'
  }
];

// ============================================
// DONATION SERVICE
// ============================================

export const DonationService = {
  async create(donation: {
    donor_name: string;
    donor_email?: string;
    donor_phone?: string;
    amount: number;
    currency?: string;
    payment_gateway?: string;
    payment_method?: string;
    message?: string;
    anonymous?: boolean;
    campaign?: string;
  }): Promise<any> {
    const { data, error } = await supabase
      .from('donations')
      .insert([{
        ...donation,
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(filters?: { status?: string }): Promise<any[]> {
    let query = supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('payment_status', filters.status);
    }

    const { data, error } = await query;
    if (error) return DEMO_DONATIONS;
    return data || [];
  },

  async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('donations')
      .update({ payment_status: status })
      .eq('id', id);

    if (error) throw error;
  },

  async getTotal(): Promise<number> {
    const { data } = await supabase
      .from('donations')
      .select('amount')
      .eq('payment_status', 'completed');

    if (!data) return 0;
    return data.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
  }
};

// ============================================
// ANALYTICS TRACKING
// ============================================

export const AnalyticsService = {
  async trackEvent(eventType: string, eventName: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      const sessionId = getCookie(SESSION_COOKIE_NAME);
      
      await supabase
        .from('analytics_events')
        .insert([{
          event_type: eventType,
          event_name: eventName,
          session_id: sessionId,
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          metadata,
          created_at: new Date().toISOString()
        }]);
    } catch (e) {
      console.warn('Analytics tracking failed:', e);
    }
  },

  async getEventsByType(eventType: string, days: number = 30): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', eventType)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    return data || [];
  },

  async getPageViews(days: number = 30): Promise<number> {
    const { count } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view');

    return count || 0;
  },

  async getTopPages(limit: number = 10): Promise<{ page_url: string; count: number }[]> {
    const { data } = await supabase
      .from('analytics_events')
      .select('page_url')
      .eq('event_type', 'page_view');

    if (!data) return [];

    const pageCounts: Record<string, number> = {};
    data.forEach((event: any) => {
      const page = event.page_url;
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });

    return Object.entries(pageCounts)
      .map(([page_url, count]) => ({ page_url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
};
