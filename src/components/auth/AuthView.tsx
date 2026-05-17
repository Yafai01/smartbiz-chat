import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Sparkles, CheckCircle2, Lock, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const AuthView: React.FC = () => {
  const { login } = useApp();

  // Local State
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [password, setPassword] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    if (isSignUp && !businessName.trim()) {
      toast.error('Please provide your Business Name');
      return;
    }

    // Perform Login / Onboarding
    login(email, isSignUp ? businessName : 'SmartBiz Commerce');
  };

  const handleDemoQuickLogin = () => {
    login('admin@smartbiz.ai', 'SmartBiz Premium Tech');
  };

  return (
    <div className="min-h-screen bg-wa-dark-bg flex items-center justify-center p-4 md:p-8 select-none overflow-y-auto">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side: Brand Story & Feature Highlights */}
        <div className="space-y-8 lg:pr-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-wa-green flex items-center justify-center shadow-xl shadow-wa-green/20">
              <MessageSquare className="w-7 h-7 text-black fill-black" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-wa-text tracking-tight">SmartBiz Chat</h1>
              <p className="text-sm text-wa-green font-semibold">AI WhatsApp Sales Assistant</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-wa-text leading-tight tracking-tight">
              Transform Your WhatsApp into an <span className="text-wa-green underline decoration-wa-green/40 underline-offset-4">AI Sales Powerhouse</span>.
            </h2>
            <p className="text-sm md:text-base text-wa-subtext leading-relaxed font-normal">
              Built for growing small businesses. Automate lead qualification, generate high-converting AI replies, send interactive product catalogs, and close deals directly inside WhatsApp.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-wa-secondary/60 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-wa-green/10 flex items-center justify-center text-wa-green">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-wa-text text-sm">Gemini AI Reply Assist</h4>
              <p className="text-xs text-wa-subtext">Instant intent detection, multilingual rewrite, and smart sales suggestions.</p>
            </div>

            <div className="bg-wa-secondary/60 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-wa-text text-sm">Kanban Lead CRM</h4>
              <p className="text-xs text-wa-subtext">Visual deal pipeline with AI lead scoring and smart sales insights.</p>
            </div>

            <div className="bg-wa-secondary/60 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-wa-text text-sm">Follow-up Automation</h4>
              <p className="text-xs text-wa-subtext">Auto-engage inactive leads and recover abandoned WhatsApp carts.</p>
            </div>

            <div className="bg-wa-secondary/60 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-wa-text text-sm">WhatsApp Cloud API</h4>
              <p className="text-xs text-wa-subtext">Official Meta Cloud API integration with fully secure webhook verification.</p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-2 text-xs text-wa-subtext font-medium pt-2">
            <CheckCircle2 className="w-4 h-4 text-wa-green" /> 
            <span>Demo-ready for Hackathons & Investor Showcases • No credit card required</span>
          </div>
        </div>

        {/* Right Side: Auth Form / Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-wa-secondary border border-white/10 p-8 rounded-3xl shadow-2xl glass-panel relative"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold text-wa-text mb-1">
              {isSignUp ? 'Create Business Account' : 'Sign In to SmartBiz'}
            </h3>
            <p className="text-xs text-wa-subtext">
              {isSignUp ? 'Connect your WhatsApp Business and activate AI' : 'Welcome back! Enter your business credentials'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-wa-text">Business Name *</label>
                <input 
                  type="text" 
                  required={isSignUp}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Acme Premium Electronics"
                  className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wa-text">Work Email *</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartbiz.ai"
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-wa-text">Password *</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
              />
            </div>

            {isSignUp && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-wa-text">WhatsApp Phone Number ID (Optional)</label>
                <input 
                  type="text" 
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="e.g. 102938475610293"
                  className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner font-mono"
                />
                <p className="text-[10px] text-wa-subtext">Used for official Meta Cloud API Webhook routing.</p>
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              className="w-full justify-center shadow-lg shadow-wa-green/20 mt-2"
            >
              <span>{isSignUp ? 'Start 14-Day Free Trial' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Login Divider */}
          <div className="my-6 flex items-center justify-between gap-4">
            <span className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] uppercase font-bold text-wa-subtext tracking-wider">or bypass for hackathon demo</span>
            <span className="h-px bg-white/5 flex-1" />
          </div>

          <Button 
            variant="secondary" 
            size="md" 
            onClick={handleDemoQuickLogin}
            className="w-full justify-center bg-wa-dark-bg border border-white/10 hover:border-wa-green/30"
          >
            <Sparkles className="w-4 h-4 text-amber-400 mr-2" />
            <span>Instant Demo Login (Admin Mode)</span>
          </Button>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-wa-subtext hover:text-wa-text transition-colors font-medium focus:outline-none"
            >
              {isSignUp ? (
                <>Already have an account? <span className="text-wa-green font-bold">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="text-wa-green font-bold">Create Account</span></>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
