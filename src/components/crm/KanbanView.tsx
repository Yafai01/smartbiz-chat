import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Contact } from '../../lib/supabase';
import { calculateLeadScore } from '../../lib/gemini';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  MessageSquare, 
  Tag as TagIcon, 
  Plus, 
  RefreshCw,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STAGES: Contact['kanban_stage'][] = ['New Lead', 'Interested', 'Negotiation', 'Won', 'Lost'];

export const KanbanView: React.FC = () => {
  const { contacts, updateContactStage, setActiveContactId, setCurrentTab, messages } = useApp();
  
  // Local States
  const [draggedContactId, setDraggedContactId] = useState<string | null>(null);
  const [selectedContactForAI, setSelectedContactForAI] = useState<Contact | null>(null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [aiInsightResult, setAiInsightResult] = useState<{ score: number; reasons: string[]; recommendation: string } | null>(null);

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, contactId: string) => {
    e.dataTransfer.setData('text/plain', contactId);
    setDraggedContactId(contactId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: Contact['kanban_stage']) => {
    e.preventDefault();
    const contactId = e.dataTransfer.getData('text/plain');
    if (contactId) {
      updateContactStage(contactId, stage);
    }
    setDraggedContactId(null);
  };

  // Trigger Gemini AI Lead Analysis
  const handleAnalyzeLead = async (contact: Contact) => {
    setSelectedContactForAI(contact);
    setAiInsightLoading(true);
    setAiInsightResult(null);

    // Get contact messages
    const contactMsgs = messages.filter(m => m.contact_id === contact.id).map(m => `${m.sender_type}: ${m.content}`).join('\n');

    try {
      const insight = await calculateLeadScore(contact.name, contactMsgs);
      setAiInsightResult(insight);
      toast.success('Gemini AI Lead Analysis complete!');
    } catch (err) {
      toast.error('AI Lead Analysis failed');
    } finally {
      setAiInsightLoading(false);
    }
  };

  // Quick Chat Navigation
  const handleOpenChat = (contactId: string) => {
    setActiveContactId(contactId);
    setCurrentTab('chat');
  };

  // Calculate Pipeline Metrics
  const totalLeads = contacts.length;
  const wonLeads = contacts.filter(c => c.kanban_stage === 'Won').length;
  const negotiationLeads = contacts.filter(c => c.kanban_stage === 'Negotiation').length;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-wa-dark-bg p-6 overflow-hidden select-none">
      {/* Top Bar / Metrics Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-wa-text flex items-center gap-2">
            <Users className="w-6 h-6 text-wa-green" /> Lead Pipeline & CRM
          </h2>
          <p className="text-xs text-wa-subtext mt-1">Manage WhatsApp inquiries across Kanban stages. Drag cards to update deal status.</p>
        </div>

        {/* Pipeline Summary Cards */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-wa-secondary border border-white/5 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-wa-green/10 flex items-center justify-center text-wa-green">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-wa-subtext uppercase font-bold tracking-wider">Total Leads</p>
              <h4 className="text-base font-bold text-wa-text">{totalLeads}</h4>
            </div>
          </div>

          <div className="bg-wa-secondary border border-white/5 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-wa-subtext uppercase font-bold tracking-wider">In Negotiation</p>
              <h4 className="text-base font-bold text-wa-text">{negotiationLeads}</h4>
            </div>
          </div>

          <div className="bg-wa-secondary border border-white/5 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-wa-green flex items-center justify-center text-black">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-wa-subtext uppercase font-bold tracking-wider">Closed Won</p>
              <h4 className="text-base font-bold text-wa-text">{wonLeads}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Kanban Columns & AI Insights Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Kanban Board (3 Columns / Span 3 on large screens) */}
        <div className="lg:col-span-3 flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {STAGES.map((stage) => {
            const columnContacts = contacts.filter(c => c.kanban_stage === stage);

            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className="w-72 flex-shrink-0 flex flex-col bg-wa-secondary/50 rounded-2xl border border-white/5 p-4 overflow-hidden"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <h3 className="font-bold text-sm text-wa-text flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      stage === 'Won' ? 'bg-wa-green' :
                      stage === 'Negotiation' ? 'bg-amber-400' :
                      stage === 'Lost' ? 'bg-red-400' :
                      stage === 'Interested' ? 'bg-blue-400' : 'bg-wa-subtext'
                    }`} />
                    {stage}
                  </h3>
                  <Badge variant="neutral" size="sm">{columnContacts.length}</Badge>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {columnContacts.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-xl text-wa-subtext text-xs italic">
                      Drop leads here
                    </div>
                  ) : (
                    columnContacts.map((contact) => (
                      <motion.div
                        key={contact.id}
                        layout
                        draggable
                        onDragStart={(e) => handleDragStart(e as any, contact.id)}
                        className="bg-wa-dark-bg border border-white/5 hover:border-wa-green/30 rounded-2xl p-4 shadow-md transition-all cursor-grab active:cursor-grabbing group relative"
                      >
                        {/* Header: Avatar & Score */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img 
                              src={contact.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(contact.name)}`} 
                              alt={contact.name} 
                              className="w-8 h-8 rounded-full object-cover border border-white/10"
                            />
                            <h4 className="font-semibold text-wa-text text-xs truncate">{contact.name}</h4>
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-wa-green/10 text-wa-green border border-wa-green/20 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {contact.lead_score}
                          </span>
                        </div>

                        {/* Phone & Summary Snippet */}
                        <p className="text-[11px] text-wa-subtext line-clamp-2 mb-3">
                          {contact.ai_summary || contact.phone_number}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {contact.tags.map(tag => (
                            <span key={tag} className="text-[9px] bg-wa-secondary text-wa-text px-2 py-0.5 rounded-md border border-white/5">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions: AI Analyze & WhatsApp Chat */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAnalyzeLead(contact)}
                            className="text-[10px] py-1 px-2.5 flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" /> AI Insight
                          </Button>

                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleOpenChat(contact.id)}
                            className="text-[10px] py-1 px-2.5 flex items-center gap-1 shadow-sm"
                          >
                            <MessageSquare className="w-3 h-3 text-black" /> Chat
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Pane: Gemini AI Insights & Lead Analysis */}
        <div className="bg-wa-secondary border border-white/5 rounded-2xl p-6 flex flex-col h-full overflow-hidden shadow-lg">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-bold text-base text-wa-text">Gemini AI Lead Insights</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-6">
            {selectedContactForAI ? (
              <div className="space-y-6">
                {/* Lead Header */}
                <div className="flex items-center gap-3 bg-wa-dark-bg p-4 rounded-xl border border-white/5">
                  <img 
                    src={selectedContactForAI.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedContactForAI.name)}`} 
                    alt={selectedContactForAI.name} 
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-wa-text text-sm">{selectedContactForAI.name}</h4>
                    <p className="text-xs text-wa-subtext">{selectedContactForAI.phone_number}</p>
                    <Badge variant="accent" size="sm" className="mt-1.5">{selectedContactForAI.kanban_stage}</Badge>
                  </div>
                </div>

                {/* Analysis Loading / Results */}
                {aiInsightLoading ? (
                  <div className="text-center py-12 space-y-3">
                    <RefreshCw className="w-8 h-8 text-wa-green animate-spin mx-auto" />
                    <p className="text-xs text-wa-subtext">Gemini AI is analyzing WhatsApp interaction history & buyer signals...</p>
                  </div>
                ) : aiInsightResult ? (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Score Card */}
                    <div className="bg-wa-green/10 border border-wa-green/20 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs text-wa-green font-bold uppercase tracking-wider">Calculated Lead Score</p>
                        <h3 className="text-2xl font-extrabold text-wa-text mt-1">{aiInsightResult.score} / 100</h3>
                      </div>
                      <Sparkles className="w-8 h-8 text-wa-green" />
                    </div>

                    {/* Reasons */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-wa-subtext uppercase tracking-wider">Buying Intent Signals</h5>
                      <ul className="space-y-2">
                        {aiInsightResult.reasons.map((reason, idx) => (
                          <li key={idx} className="text-xs bg-wa-dark-bg p-3 rounded-xl border border-white/5 text-wa-text flex items-start gap-2.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-wa-green mt-1.5 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-2">
                      <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" /> Recommended Sales Action
                      </h5>
                      <p className="text-xs text-wa-text leading-relaxed font-medium">
                        {aiInsightResult.recommendation}
                      </p>
                    </div>

                    <Button 
                      variant="primary" 
                      className="w-full justify-center" 
                      onClick={() => handleOpenChat(selectedContactForAI.id)}
                    >
                      <MessageSquare className="w-4 h-4 text-black mr-2" /> Open WhatsApp Chat
                    </Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4 glass-card p-6 rounded-2xl border border-white/5">
                <Sparkles className="w-12 h-12 text-wa-green mx-auto opacity-80 animate-pulse" />
                <h4 className="font-semibold text-wa-text text-sm">No Lead Selected</h4>
                <p className="text-xs text-wa-subtext leading-relaxed">
                  Click the <span className="text-wa-green font-semibold">"AI Insight"</span> button on any Kanban card to generate a deep-dive buying intent analysis and recommended next steps using Gemini AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
