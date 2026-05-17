import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ==========================================
// MOCK STORAGE FALLBACK SYSTEM
// ==========================================

export interface Contact {
  id: string;
  name: string;
  phone_number: string;
  avatar_url?: string;
  kanban_stage: 'New Lead' | 'Interested' | 'Negotiation' | 'Won' | 'Lost';
  lead_score: number;
  tags: string[];
  ai_summary?: string;
  unread_count: number;
  last_message_at: string;
}

export interface Message {
  id: string;
  contact_id: string;
  sender_type: 'business' | 'customer';
  content: string;
  media_url?: string;
  media_type?: 'image' | 'audio' | 'document' | 'catalog';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentiment: 'positive' | 'neutral' | 'negative';
  ai_generated?: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock_count: number;
  image_url?: string;
  category: string;
  sku: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger_type: string;
  action_prompt: string;
  is_active: boolean;
}

// Initial Mock Data seeded for Hackathon Demo
const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Jenkins (TechCorp)',
    phone_number: '+1 (555) 019-2834',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    kanban_stage: 'Negotiation',
    lead_score: 92,
    tags: ['High Value', 'Enterprise', 'Warm'],
    ai_summary: 'Interested in annual enterprise licensing. Requesting custom invoice and SLA terms.',
    unread_count: 2,
    last_message_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
  },
  {
    id: 'c2',
    name: 'Michael Chang',
    phone_number: '+1 (555) 014-4920',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    kanban_stage: 'Interested',
    lead_score: 78,
    tags: ['Gadgets', 'Follow-up'],
    ai_summary: 'Asked about compatibility of Wireless Pro Earbuds with iOS devices.',
    unread_count: 0,
    last_message_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'c3',
    name: 'Emma Watson',
    phone_number: '+44 20 7946 0921',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    kanban_stage: 'New Lead',
    lead_score: 65,
    tags: ['New Inquiry'],
    ai_summary: 'First time inquiry about bulk shipping rates to the UK.',
    unread_count: 1,
    last_message_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'c4',
    name: 'David Rodriguez',
    phone_number: '+34 600 555 123',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    kanban_stage: 'Won',
    lead_score: 95,
    tags: ['VIP', 'Repeat Customer'],
    ai_summary: 'Completed purchase of 5x Smart Home Hubs. Very satisfied with AI support.',
    unread_count: 0,
    last_message_at: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  },
  {
    id: 'c5',
    name: 'Alex Mercer',
    phone_number: '+1 (555) 018-9933',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    kanban_stage: 'Lost',
    lead_score: 25,
    tags: ['Price Sensitive'],
    ai_summary: 'Budget constraints. Decided to postpone purchase until Q4.',
    unread_count: 0,
    last_message_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString()
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    contact_id: 'c1',
    sender_type: 'customer',
    content: 'Hi SmartBiz team, we are reviewing the contract for the 50-user license. Can we get a 10% discount if we pay upfront for the year?',
    status: 'read',
    sentiment: 'positive',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: 'm2',
    contact_id: 'c1',
    sender_type: 'business',
    content: 'Hello Sarah! Absolutely. We can apply the 10% annual prepayment discount. I will have our AI assistant generate the updated invoice for you right away.',
    status: 'read',
    sentiment: 'positive',
    ai_generated: true,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'm3',
    contact_id: 'c1',
    sender_type: 'customer',
    content: 'That sounds perfect. Also, could you send over the updated product catalog? We might add some wireless headsets to the order.',
    status: 'delivered',
    sentiment: 'positive',
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'm4',
    contact_id: 'c2',
    sender_type: 'customer',
    content: 'Hey there! Are the Wireless Pro Earbuds fully compatible with iPhone 15 Pro? How is the latency for video calls?',
    status: 'read',
    sentiment: 'neutral',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'm5',
    contact_id: 'c3',
    sender_type: 'customer',
    content: 'Hello, I run a boutique in London and would love to stock your eco-friendly phone cases. What are your international shipping terms?',
    status: 'delivered',
    sentiment: 'positive',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Pro Earbuds Ultra',
    description: 'Active noise cancellation, 36h battery life, ultra-low latency bluetooth 5.3. Perfect for business calls and immersive audio.',
    price: 149.99,
    currency: 'USD',
    stock_count: 145,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    category: 'Audio',
    sku: 'EAR-PRO-001'
  },
  {
    id: 'p2',
    name: 'Smart Home Hub Max',
    description: 'Centralize your automated business or home office. Compatible with Zigbee, Matter, and Apple HomeKit.',
    price: 229.50,
    currency: 'USD',
    stock_count: 82,
    image_url: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400',
    category: 'Smart Home',
    sku: 'HUB-MAX-002'
  },
  {
    id: 'p3',
    name: 'EcoLeather MagSafe Case',
    description: 'Premium biodegradable leather case with integrated MagSafe magnets. Drop tested up to 10 feet.',
    price: 45.00,
    currency: 'USD',
    stock_count: 310,
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
    category: 'Accessories',
    sku: 'CASE-ECO-003'
  },
  {
    id: 'p4',
    name: 'UltraWide 4K Productivity Monitor',
    description: '34-inch curved IPS display with 99% sRGB color accuracy, USB-C 90W power delivery, and built-in KVM switch.',
    price: 699.00,
    currency: 'USD',
    stock_count: 28,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    category: 'Displays',
    sku: 'MON-34C-004'
  }
];

const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'r1',
    name: 'Instant AI Welcome & Lead Qualification',
    trigger_type: 'new_lead',
    action_prompt: 'Greet the customer warmly, thank them for contacting SmartBiz, and ask what product or service they are interested in exploring today.',
    is_active: true
  },
  {
    id: 'r2',
    name: 'Auto Follow-up After 24h Inactivity',
    trigger_type: 'inactivity_24h',
    action_prompt: 'Send a polite check-in message asking if they have any remaining questions regarding the pricing or product specifications.',
    is_active: true
  },
  {
    id: 'r3',
    name: 'Abandoned Inquiry Recovery',
    trigger_type: 'abandoned_cart',
    action_prompt: 'Offer a limited-time 5% discount code (SMART5) to help finalize their pending purchase decision.',
    is_active: false
  }
];

// LocalStorage Helper Functions
export const getLocalContacts = (): Contact[] => {
  const data = localStorage.getItem('sb_contacts');
  if (!data) {
    localStorage.setItem('sb_contacts', JSON.stringify(INITIAL_CONTACTS));
    return INITIAL_CONTACTS;
  }
  return JSON.parse(data);
};

export const saveLocalContacts = (contacts: Contact[]) => {
  localStorage.setItem('sb_contacts', JSON.stringify(contacts));
};

export const getLocalMessages = (): Message[] => {
  const data = localStorage.getItem('sb_messages');
  if (!data) {
    localStorage.setItem('sb_messages', JSON.stringify(INITIAL_MESSAGES));
    return INITIAL_MESSAGES;
  }
  return JSON.parse(data);
};

export const saveLocalMessages = (messages: Message[]) => {
  localStorage.setItem('sb_messages', JSON.stringify(messages));
};

export const getLocalProducts = (): Product[] => {
  const data = localStorage.getItem('sb_products');
  if (!data) {
    localStorage.setItem('sb_products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(data);
};

export const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem('sb_products', JSON.stringify(products));
};

export const getLocalRules = (): AutomationRule[] => {
  const data = localStorage.getItem('sb_rules');
  if (!data) {
    localStorage.setItem('sb_rules', JSON.stringify(INITIAL_RULES));
    return INITIAL_RULES;
  }
  return JSON.parse(data);
};

export const saveLocalRules = (rules: AutomationRule[]) => {
  localStorage.setItem('sb_rules', JSON.stringify(rules));
};
