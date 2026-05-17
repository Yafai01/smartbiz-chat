import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Sparkles, UserCheck, Smartphone } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { businessName, userEmail, contacts, simulateCustomerMessage } = useApp();

  // Simulate an incoming WhatsApp message for hackathon demo
  const handleSimulateMessage = () => {
    // Pick a random contact
    const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
    if (!randomContact) return;

    const sampleInquiries = [
      "Hi! I saw your post on Instagram. Do you have the Wireless Pro Earbuds in stock right now?",
      "Hello, I am interested in ordering 5 units of the Smart Home Hub Max. Can you send an invoice?",
      "Hey team, what is the warranty period for the UltraWide 4K Monitor?",
      "Hi there, is there any discount code available for first-time buyers?"
    ];

    const randomMsg = sampleInquiries[Math.floor(Math.random() * sampleInquiries.length)];
    simulateCustomerMessage(randomContact.id, randomMsg);
  };

  return (
    <header className="h-16 bg-wa-secondary border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left side: Business info */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-wa-text flex items-center gap-2">
            {businessName}
            <Badge variant="success" size="sm" className="hidden sm:inline-flex">
              <CheckCircle2 className="w-3 h-3 text-wa-green" /> WhatsApp Cloud API Connected
            </Badge>
          </h2>
          <p className="text-xs text-wa-subtext">{userEmail}</p>
        </div>
      </div>

      {/* Right side: Simulation tools & Status */}
      <div className="flex items-center gap-3">
        {/* Simulate Message Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSimulateMessage}
          className="hidden sm:inline-flex items-center gap-1.5"
          title="Simulate an incoming WhatsApp customer message"
        >
          <Smartphone className="w-4 h-4" />
          <span>Simulate Incoming Chat</span>
        </Button>

        {/* AI Active Indicator */}
        <div className="flex items-center gap-2 bg-wa-accent px-3 py-1.5 rounded-xl border border-white/5">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-wa-text hidden md:inline">Gemini AI Active</span>
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-wa-green/20 border border-wa-green/30 flex items-center justify-center text-wa-green font-bold text-xs">
          <UserCheck className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
