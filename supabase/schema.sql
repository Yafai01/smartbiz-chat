-- SmartBiz Chat - Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table (Business Users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    whatsapp_phone_number TEXT,
    whatsapp_phone_number_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts Table (WhatsApp Leads / Customers)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    avatar_url TEXT,
    kanban_stage TEXT DEFAULT 'New Lead', -- New Lead, Interested, Negotiation, Won, Lost
    lead_score INTEGER DEFAULT 50,
    tags TEXT[] DEFAULT '{}',
    ai_summary TEXT,
    unread_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, phone_number)
);

-- Messages Table (WhatsApp Chat History)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    whatsapp_message_id TEXT UNIQUE,
    sender_type TEXT NOT NULL, -- 'business' or 'customer'
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT, -- 'image', 'audio', 'document', 'catalog'
    status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
    sentiment TEXT DEFAULT 'neutral', -- 'positive', 'neutral', 'negative'
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table (Product Catalog)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    stock_count INTEGER DEFAULT 100,
    image_url TEXT,
    category TEXT DEFAULT 'General',
    sku TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Rules Table
CREATE TABLE IF NOT EXISTS automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    trigger_type TEXT NOT NULL, -- 'inactivity_24h', 'new_lead', 'abandoned_cart'
    action_prompt TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL UNIQUE,
    total_leads INTEGER DEFAULT 0,
    response_rate NUMERIC(5, 2) DEFAULT 98.5,
    conversion_rate NUMERIC(5, 2) DEFAULT 24.5,
    sales_estimate NUMERIC(12, 2) DEFAULT 0.00,
    ai_handled_percentage NUMERIC(5, 2) DEFAULT 85.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_profile_id ON contacts(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_contact_id ON messages(contact_id);
CREATE INDEX IF NOT EXISTS idx_products_profile_id ON products(profile_id);
