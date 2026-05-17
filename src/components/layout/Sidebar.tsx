import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Users, ShoppingBag, Zap, BarChart3, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  id: 'chat' | 'crm' | 'catalog' | 'automation' | 'analytics';
  label: string;
  icon: any;
  badge?: number | null;
}

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, contacts, logout } = useApp();

  // Total unread count
  const totalUnread = contacts.reduce((sum, c) => sum + c.unread_count, 0);

  const navItems: NavItem[] = [
    { id: 'chat', label: 'WhatsApp Chat', icon: MessageSquare, badge: totalUnread > 0 ? totalUnread : null },
    { id: 'crm', label: 'Lead CRM', icon: Users },
    { id: 'catalog', label: 'Product Catalog', icon: ShoppingBag },
    { id: 'automation', label: 'Automation Rules', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-wa-secondary border-r border-white/5 p-4 justify-between h-screen sticky top-0 select-none">
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-wa-green flex items-center justify-center shadow-lg shadow-wa-green/20">
              <MessageSquare className="w-6 h-6 text-black fill-black" />
            </div>
            <div>
              <h1 className="font-bold text-wa-text tracking-wide text-base">SmartBiz Chat</h1>
              <p className="text-xs text-wa-green font-medium">AI Sales Assistant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all relative ${
                    isActive 
                      ? 'text-white bg-wa-accent shadow-md' 
                      : 'text-wa-subtext hover:text-wa-text hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-wa-green' : 'text-wa-subtext'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-wa-green text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-sm"
                    >
                      {item.badge}
                    </motion.div>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-wa-green rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-wa-secondary border-t border-white/10 px-4 py-2 flex items-center justify-around z-40 backdrop-blur-lg bg-opacity-95">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 relative transition-colors ${
                isActive ? 'text-wa-green' : 'text-wa-subtext'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-wa-green text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
