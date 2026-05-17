import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Contact, 
  Message, 
  Product, 
  AutomationRule, 
  getLocalContacts, 
  saveLocalContacts, 
  getLocalMessages, 
  saveLocalMessages, 
  getLocalProducts, 
  saveLocalProducts, 
  getLocalRules, 
  saveLocalRules 
} from '../lib/supabase';
import { sendWhatsAppMessage } from '../lib/whatsapp';
import toast from 'react-hot-toast';

interface AppContextType {
  // Auth State
  isAuthenticated: boolean;
  userEmail: string;
  businessName: string;
  login: (email: string, business: string) => void;
  logout: () => void;

  // Navigation State
  currentTab: 'chat' | 'crm' | 'catalog' | 'automation' | 'analytics';
  setCurrentTab: (tab: 'chat' | 'crm' | 'catalog' | 'automation' | 'analytics') => void;

  // Contacts / Leads State
  contacts: Contact[];
  activeContactId: string | null;
  setActiveContactId: (id: string | null) => void;
  updateContactStage: (contactId: string, stage: Contact['kanban_stage']) => void;
  addContactTag: (contactId: string, tag: string) => void;
  removeContactTag: (contactId: string, tag: string) => void;

  // Messages State
  messages: Message[];
  activeMessages: Message[];
  sendMessage: (content: string, type?: 'text' | 'image' | 'audio' | 'interactive', mediaUrl?: string, catalogId?: string) => Promise<void>;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;

  // Product Catalog State
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;

  // Automation Rules State
  rules: AutomationRule[];
  toggleRule: (ruleId: string) => void;
  addRule: (rule: Omit<AutomationRule, 'id'>) => void;

  // Simulation Helpers
  simulateCustomerMessage: (contactId: string, content: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sb_auth') === 'true';
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('sb_email') || 'admin@smartbiz.ai';
  });
  const [businessName, setBusinessName] = useState<string>(() => {
    return localStorage.getItem('sb_business') || 'SmartBiz Commerce';
  });

  // Navigation
  const [currentTab, setCurrentTab] = useState<'chat' | 'crm' | 'catalog' | 'automation' | 'analytics'>('chat');

  // Entity States
  const [contacts, setContacts] = useState<Contact[]>(getLocalContacts);
  const [messages, setMessages] = useState<Message[]>(getLocalMessages);
  const [products, setProducts] = useState<Product[]>(getLocalProducts);
  const [rules, setRules] = useState<AutomationRule[]>(getLocalRules);

  const [activeContactId, setActiveContactId] = useState<string | null>('c1');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Sync to LocalStorage on changes
  useEffect(() => { saveLocalContacts(contacts); }, [contacts]);
  useEffect(() => { saveLocalMessages(messages); }, [messages]);
  useEffect(() => { saveLocalProducts(products); }, [products]);
  useEffect(() => { saveLocalRules(rules); }, [rules]);

  // Auth Actions
  const login = (email: string, business: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    setBusinessName(business);
    localStorage.setItem('sb_auth', 'true');
    localStorage.setItem('sb_email', email);
    localStorage.setItem('sb_business', business);
    toast.success(`Welcome back to ${business}!`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sb_auth');
    toast.success('Logged out successfully');
  };

  // Active messages filter
  const activeMessages = messages.filter(m => m.contact_id === activeContactId);

  // Contact Modifiers
  const updateContactStage = (contactId: string, stage: Contact['kanban_stage']) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, kanban_stage: stage } : c));
    toast.success(`Lead moved to ${stage}`);
  };

  const addContactTag = (contactId: string, tag: string) => {
    setContacts(prev => prev.map(c => {
      if (c.id === contactId && !c.tags.includes(tag)) {
        return { ...c, tags: [...c.tags, tag] };
      }
      return c;
    }));
    toast.success(`Tag "${tag}" added`);
  };

  const removeContactTag = (contactId: string, tag: string) => {
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, tags: c.tags.filter(t => t !== tag) } : c));
    toast.success(`Tag removed`);
  };

  // Message Sender
  const sendMessage = async (content: string, type: 'text' | 'image' | 'audio' | 'interactive' = 'text', mediaUrl?: string, catalogId?: string) => {
    if (!activeContactId) return;

    const activeContact = contacts.find(c => c.id === activeContactId);
    if (!activeContact) return;

    // Optimistic UI Update
    const newMessage: Message = {
      id: `m_${Date.now()}`,
      contact_id: activeContactId,
      sender_type: 'business',
      content,
      media_url: mediaUrl,
      media_type: type === 'interactive' ? 'catalog' : type === 'text' ? undefined : type,
      status: 'sent',
      sentiment: 'positive',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      await sendWhatsAppMessage({
        to: activeContact.phone_number,
        type,
        content,
        mediaUrl,
        catalogId
      });

      // Update status to delivered
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m));
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'failed' } : m));
      toast.error('Failed to send WhatsApp message');
    }
  };

  // Product Modifiers
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProd: Product = { ...product, id: `p_${Date.now()}` };
    setProducts(prev => [newProd, ...prev]);
    toast.success('Product added to catalog');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast.success('Product removed');
  };

  // Rule Modifiers
  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, is_active: !r.is_active } : r));
    toast.success('Automation rule updated');
  };

  const addRule = (rule: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = { ...rule, id: `r_${Date.now()}` };
    setRules(prev => [...prev, newRule]);
    toast.success('New automation rule activated');
  };

  // Simulation Helper for incoming customer messages
  const simulateCustomerMessage = (contactId: string, content: string) => {
    const newMsg: Message = {
      id: `m_sim_${Date.now()}`,
      contact_id: contactId,
      sender_type: 'customer',
      content,
      status: 'read',
      sentiment: 'positive',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, unread_count: c.unread_count + 1, last_message_at: new Date().toISOString() } : c));
    toast(`New WhatsApp message from ${contacts.find(c => c.id === contactId)?.name || 'Customer'}`, { icon: '💬' });
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      userEmail,
      businessName,
      login,
      logout,
      currentTab,
      setCurrentTab,
      contacts,
      activeContactId,
      setActiveContactId,
      updateContactStage,
      addContactTag,
      removeContactTag,
      messages,
      activeMessages,
      sendMessage,
      isTyping,
      setIsTyping,
      products,
      addProduct,
      deleteProduct,
      rules,
      toggleRule,
      addRule,
      simulateCustomerMessage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
