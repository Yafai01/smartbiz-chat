import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Bot, 
  ToggleLeft, 
  ToggleRight, 
  HelpCircle,
  Play
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const AutomationView: React.FC = () => {
  const { rules, toggleRule, addRule, contacts, simulateCustomerMessage } = useApp();

  // Local Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [triggerType, setTriggerType] = useState('inactivity_24h');
  const [actionPrompt, setActionPrompt] = useState('');

  // Handle Form Submit
  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !actionPrompt.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    addRule({
      name: ruleName,
      trigger_type: triggerType,
      action_prompt: actionPrompt,
      is_active: true
    });

    setRuleName('');
    setTriggerType('inactivity_24h');
    setActionPrompt('');
    setIsModalOpen(false);
  };

  // Simulate Rule Trigger
  const handleSimulateTrigger = (ruleName: string) => {
    const firstContact = contacts[0];
    if (!firstContact) return;

    toast.success(`Triggering rule: "${ruleName}"`);
    setTimeout(() => {
      toast(`[AI Auto-Reply to ${firstContact.name}]: Automated follow-up sent based on rule criteria.`, { icon: '🤖' });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-wa-dark-bg p-6 overflow-hidden select-none">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-wa-text flex items-center gap-2">
            <Zap className="w-6 h-6 text-wa-green" /> Follow-Up Automation Engine
          </h2>
          <p className="text-xs text-wa-subtext mt-1">Configure Gemini AI triggers to automatically engage leads, recover abandoned carts, and send scheduled reminders.</p>
        </div>

        <Button 
          variant="primary" 
          size="md" 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 shadow-lg shadow-wa-green/20"
        >
          <Plus className="w-5 h-5 text-black" />
          <span>Create Automation Rule</span>
        </Button>
      </div>

      {/* Rules List Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 pr-1 pb-6">
        {rules.map((rule) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-wa-secondary border rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all ${
              rule.is_active ? 'border-wa-green/30 glass-card' : 'border-white/5 opacity-70'
            }`}
          >
            <div>
              {/* Header: Name & Status Toggle */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-wa-text text-base">{rule.name}</h3>
                    <Badge variant={rule.is_active ? 'success' : 'neutral'} size="sm">
                      {rule.is_active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-wa-subtext font-mono">
                    <Clock className="w-3.5 h-3.5 text-wa-subtext" />
                    <span>Trigger: {rule.trigger_type}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleRule(rule.id)}
                  className="text-wa-green hover:scale-105 transition-transform focus:outline-none"
                  title={rule.is_active ? "Pause Rule" : "Activate Rule"}
                >
                  {rule.is_active ? (
                    <ToggleRight className="w-10 h-10 text-wa-green" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-wa-subtext" />
                  )}
                </button>
              </div>

              {/* Action Prompt */}
              <div className="bg-wa-dark-bg p-4 rounded-xl border border-white/5 space-y-2 mb-6">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini AI Action Prompt</span>
                </div>
                <p className="text-xs text-wa-text leading-relaxed font-sans italic">
                  "{rule.action_prompt}"
                </p>
              </div>
            </div>

            {/* Footer Simulation Trigger */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
              <span className="text-[10px] text-wa-subtext flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-wa-green" /> Fully Automated via Webhook
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={!rule.is_active}
                onClick={() => handleSimulateTrigger(rule.name)}
                className="text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3 h-3" />
                <span>Simulate Rule</span>
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Rule Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create Gemini AI Automation Rule"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateRule} className="space-y-4">
          {/* Rule Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wa-text">Rule Name *</label>
            <input 
              type="text" 
              required
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="e.g. VIP Abandoned Cart Recovery"
              className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner"
            />
          </div>

          {/* Trigger Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wa-text">Webhook Trigger Event *</label>
            <select 
              value={triggerType}
              onChange={(e) => setTriggerType(e.target.value)}
              className="w-full bg-wa-dark-bg text-wa-text text-xs rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors cursor-pointer"
            >
              <option value="inactivity_24h">Auto follow-up after 24h inactivity</option>
              <option value="inactivity_48h">Auto follow-up after 48h inactivity</option>
              <option value="new_lead">Instant greeting on New Lead</option>
              <option value="abandoned_cart">Abandoned inquiry / pending invoice</option>
              <option value="schedule_reminder">Scheduled meeting / call reminder</option>
            </select>
          </div>

          {/* Action Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-wa-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Gemini AI Prompt Template *
            </label>
            <textarea 
              rows={4}
              required
              value={actionPrompt}
              onChange={(e) => setActionPrompt(e.target.value)}
              placeholder="Enter the instruction for Gemini AI. e.g. Offer a 10% discount code to complete their purchase, mention their previously viewed catalog items, and maintain a highly persuasive tone."
              className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-xs rounded-xl p-3.5 border border-white/5 focus:outline-none focus:border-wa-green transition-colors shadow-inner leading-relaxed resize-none"
            />
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="shadow-lg shadow-wa-green/20">
              Activate Rule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
