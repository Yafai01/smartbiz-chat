import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateAIReply, summarizeVoiceNote } from '../../lib/gemini';
import { Contact, Product } from '../../lib/supabase';
import { 
  Search, 
  Send, 
  Mic, 
  Paperclip, 
  Smile, 
  Check, 
  CheckCheck, 
  Sparkles, 
  ShoppingBag, 
  Volume2, 
  Filter, 
  ChevronRight,
  Bot,
  RefreshCw,
  Globe,
  Tag as TagIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export const ChatView: React.FC = () => {
  const { 
    contacts, 
    activeContactId, 
    setActiveContactId, 
    activeMessages, 
    sendMessage, 
    products, 
    updateContactStage,
    isTyping
  } = useApp();

  // Local Component States
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [messageInput, setMessageInput] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'persuasive'>('professional');
  const [selectedLang, setSelectedLang] = useState<string>('English');
  const [showCatalogMenu, setShowCatalogMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find(c => c.id === activeContactId);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecordingVoice) {
      interval = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Filter contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.phone_number.includes(searchTerm);
    const matchesStage = stageFilter === 'all' || c.kanban_stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  // Handle Send Text Message
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const contentToSend = messageInput;
    setMessageInput('');
    await sendMessage(contentToSend, 'text');
  };

  // Handle Send Product from Catalog
  const handleSendCatalogItem = async (product: Product) => {
    setShowCatalogMenu(false);
    await sendMessage(
      `Check out our ${product.name} for $${product.price}! ${product.description}`,
      'interactive',
      product.sku,
      product.id
    );
    toast.success(`Catalog item "${product.name}" sent`);
  };

  // Handle AI Suggested Reply Generation
  const handleGenerateAISuggestion = async () => {
    if (!activeContact) return;

    // Get last customer message
    const customerMsgs = activeMessages.filter(m => m.sender_type === 'customer');
    const lastCustomerMsg = customerMsgs[customerMsgs.length - 1];

    if (!lastCustomerMsg) {
      toast.error('No customer messages available to generate a reply');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const reply = await generateAIReply({
        customerMessage: lastCustomerMsg.content,
        chatHistory: activeMessages.slice(-5).map(m => `${m.sender_type}: ${m.content}`).join('\n'),
        tone: selectedTone,
        language: selectedLang
      });
      setMessageInput(reply);
      toast.success('AI reply generated successfully!');
    } catch (err) {
      toast.error('Failed to generate AI reply');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Simulate Voice Note Recording & Transcription
  const handleToggleVoiceRecording = async () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      toast('Recording voice note...', { icon: '🎙️' });
    } else {
      setIsRecordingVoice(false);
      const simulatedAudioText = "Hi, I am looking for a bulk order of 20 wireless pro earbuds for our corporate team. Can you give me your best quote?";
      toast.success('Voice note transcribed!');
      
      // Perform AI summary
      const summaryRes = await summarizeVoiceNote(simulatedAudioText);
      setMessageInput(summaryRes.suggestedReply);
      toast('AI generated suggested reply from voice note', { icon: '✨' });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-wa-dark-bg">
      {/* Left Pane: Contacts / Chats List */}
      <div className="w-full md:w-80 border-r border-white/5 flex flex-col bg-wa-secondary flex-shrink-0">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-wa-subtext absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search chats or numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-sm rounded-xl pl-9 pr-4 py-2 border border-white/5 focus:outline-none focus:border-wa-green transition-colors"
            />
          </div>

          {/* Kanban Stage Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-wa-subtext flex-shrink-0" />
            {['all', 'New Lead', 'Interested', 'Negotiation', 'Won', 'Lost'].map((stage) => (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  stageFilter === stage 
                    ? 'bg-wa-green text-black font-semibold' 
                    : 'bg-wa-dark-bg text-wa-subtext hover:text-wa-text'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-wa-subtext text-sm">
              No conversations found.
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isActive = contact.id === activeContactId;
              const unread = contact.unread_count;

              return (
                <div
                  key={contact.id}
                  onClick={() => setActiveContactId(contact.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors relative ${
                    isActive ? 'bg-wa-accent' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={contact.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(contact.name)}`} 
                      alt={contact.name} 
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-wa-green text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                        {unread}
                      </span>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-wa-text text-sm truncate">{contact.name}</h4>
                      <span className="text-[10px] text-wa-subtext">
                        {new Date(contact.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-wa-subtext truncate">
                        {contact.ai_summary || contact.phone_number}
                      </p>
                      {/* Stage Badge */}
                      <Badge 
                        variant={
                          contact.kanban_stage === 'Won' ? 'success' :
                          contact.kanban_stage === 'Negotiation' ? 'warning' :
                          contact.kanban_stage === 'Lost' ? 'danger' : 'neutral'
                        }
                        size="sm"
                      >
                        {contact.kanban_stage}
                      </Badge>
                    </div>
                  </div>

                  {isActive && (
                    <motion.div 
                      layoutId="activeChatBar"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-wa-green" 
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Active Conversation & AI Panel */}
      {activeContact ? (
        <div className="flex-1 flex flex-col h-full bg-wa-dark-bg relative">
          {/* Chat Header */}
          <div className="h-16 bg-wa-secondary border-b border-white/5 px-6 flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <img 
                src={activeContact.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activeContact.name)}`} 
                alt={activeContact.name} 
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div>
                <h3 className="font-semibold text-wa-text text-sm flex items-center gap-2">
                  {activeContact.name}
                  <span className="text-[10px] font-normal text-wa-subtext">({activeContact.phone_number})</span>
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-wa-green animate-pulse"></span>
                  <p className="text-xs text-wa-subtext">Online • WhatsApp Cloud API</p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Stage Modifier */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-wa-dark-bg px-3 py-1.5 rounded-xl border border-white/5">
                <TagIcon className="w-3.5 h-3.5 text-wa-subtext" />
                <select
                  value={activeContact.kanban_stage}
                  onChange={(e) => updateContactStage(activeContact.id, e.target.value as any)}
                  className="bg-transparent text-xs text-wa-text font-medium focus:outline-none cursor-pointer"
                >
                  <option value="New Lead" className="bg-wa-secondary">New Lead</option>
                  <option value="Interested" className="bg-wa-secondary">Interested</option>
                  <option value="Negotiation" className="bg-wa-secondary">Negotiation</option>
                  <option value="Won" className="bg-wa-secondary">Won</option>
                  <option value="Lost" className="bg-wa-secondary">Lost</option>
                </select>
              </div>

              {/* Lead Score Badge */}
              <div className="flex items-center gap-1 bg-wa-green/10 border border-wa-green/20 px-3 py-1.5 rounded-xl text-wa-green">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Score: {activeContact.lead_score}</span>
              </div>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0B141A] bg-[radial-gradient(#111B21_1px,transparent_1px)] [background-size:16px_16px]">
            {activeMessages.length === 0 ? (
              <div className="text-center my-12 text-wa-subtext text-sm glass-card max-w-md mx-auto p-6 rounded-2xl border border-white/5">
                <Bot className="w-12 h-12 text-wa-green mx-auto mb-3 opacity-80" />
                <h4 className="font-semibold text-wa-text mb-1">Start the WhatsApp Sales Conversation</h4>
                <p className="text-xs">Send a message or use the Gemini AI Assistant below to generate a smart, high-converting greeting.</p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isBusiness = msg.sender_type === 'business';

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isBusiness ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md md:max-w-lg rounded-2xl px-4 py-3 shadow-md relative ${
                      isBusiness 
                        ? 'bg-[#005C4B] text-wa-text rounded-tr-none' 
                        : 'bg-wa-secondary text-wa-text rounded-tl-none border border-white/5'
                    }`}>
                      {/* AI Generated Badge */}
                      {msg.ai_generated && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-300 mb-1 font-medium border-b border-white/10 pb-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Gemini AI Generated</span>
                        </div>
                      )}

                      {/* Interactive Product Catalog Message */}
                      {msg.media_type === 'catalog' && (
                        <div className="mb-2 bg-black/20 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                          <ShoppingBag className="w-8 h-8 text-wa-green flex-shrink-0" />
                          <div>
                            <h5 className="font-semibold text-xs text-white">WhatsApp Product Catalog</h5>
                            <p className="text-[10px] text-wa-subtext">SKU: {msg.media_url}</p>
                          </div>
                        </div>
                      )}

                      {/* Message Content */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>

                      {/* Footer: Timestamp & Checkmarks */}
                      <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[10px] text-wa-subtext font-medium">
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isBusiness && (
                          msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-sky-400" /> :
                          msg.status === 'delivered' ? <CheckCheck className="w-3.5 h-3.5 text-wa-subtext" /> :
                          <Check className="w-3.5 h-3.5 text-wa-subtext" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-wa-secondary text-wa-text rounded-2xl rounded-tl-none border border-white/5 px-4 py-3 shadow-md flex items-center gap-2">
                  <Bot className="w-4 h-4 text-wa-green animate-bounce" />
                  <span className="text-xs font-semibold text-wa-green">Gemini AI is analyzing and typing...</span>
                  <div className="flex gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-wa-green animate-pulse"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-wa-green animate-pulse delay-150"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-wa-green animate-pulse delay-300"></span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Gemini AI Reply Assistant Toolbar */}
          <div className="bg-wa-secondary border-t border-b border-white/5 p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg z-20">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI Reply Assist</span>
              </div>

              {/* Tone Selector */}
              <div className="flex items-center gap-1 bg-wa-dark-bg p-1 rounded-xl border border-white/5">
                {(['professional', 'casual', 'persuasive'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                      selectedTone === tone ? 'bg-wa-secondary text-wa-green font-semibold shadow-sm' : 'text-wa-subtext hover:text-wa-text'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 bg-wa-dark-bg px-3 py-1.5 rounded-xl border border-white/5">
                <Globe className="w-3.5 h-3.5 text-wa-subtext" />
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-transparent text-xs text-wa-text focus:outline-none cursor-pointer"
                >
                  <option value="English" className="bg-wa-secondary">English</option>
                  <option value="Spanish" className="bg-wa-secondary">Spanish</option>
                  <option value="French" className="bg-wa-secondary">French</option>
                  <option value="German" className="bg-wa-secondary">German</option>
                  <option value="Portuguese" className="bg-wa-secondary">Portuguese</option>
                </select>
              </div>
            </div>

            {/* Generate Action Button */}
            <Button
              variant="primary"
              size="sm"
              isLoading={isGeneratingAI}
              onClick={handleGenerateAISuggestion}
              className="flex items-center gap-1.5 shadow-md shadow-wa-green/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>Generate AI Reply</span>
            </Button>
          </div>

          {/* Product Catalog Quick Send Menu */}
          <AnimatePresence>
            {showCatalogMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-20 left-6 right-6 bg-wa-secondary border border-white/10 rounded-2xl p-4 shadow-2xl z-30 max-h-64 overflow-y-auto glass-panel"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                  <h4 className="font-semibold text-xs text-wa-text flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-wa-green" /> Send Product from Catalog
                  </h4>
                  <button onClick={() => setShowCatalogMenu(false)} className="text-xs text-wa-subtext hover:text-wa-text">Close</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((prod) => (
                    <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl bg-wa-dark-bg border border-white/5 hover:border-wa-green/30 transition-all">
                      <div className="flex items-center gap-3">
                        <img src={prod.image_url} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <h5 className="font-semibold text-xs text-wa-text">{prod.name}</h5>
                          <p className="text-[10px] text-wa-green font-bold">${prod.price}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleSendCatalogItem(prod)}>
                        Send
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Input Bar */}
          <form onSubmit={handleSend} className="p-4 bg-wa-secondary border-t border-white/5 flex items-center gap-3 z-20 shadow-lg">
            {/* Attachment & Catalog Toggle */}
            <button
              type="button"
              onClick={() => setShowCatalogMenu(!showCatalogMenu)}
              className={`p-2.5 rounded-xl transition-colors border ${
                showCatalogMenu 
                  ? 'bg-wa-green/20 text-wa-green border-wa-green/30' 
                  : 'bg-wa-dark-bg text-wa-subtext hover:text-wa-text border-white/5'
              }`}
              title="Insert Product from Catalog"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>

            {/* Emoji simulation */}
            <button
              type="button"
              onClick={() => setMessageInput(prev => prev + ' 😊')}
              className="p-2.5 rounded-xl bg-wa-dark-bg text-wa-subtext hover:text-wa-text border border-white/5 transition-colors hidden sm:block"
              title="Insert Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={isRecordingVoice ? `Recording voice note... (${recordingSeconds}s)` : "Type a WhatsApp message or generate AI reply..."}
                disabled={isRecordingVoice}
                className="w-full bg-wa-dark-bg text-wa-text placeholder-wa-subtext text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-wa-green transition-all shadow-inner disabled:opacity-50"
              />
            </div>

            {/* Voice Note Simulation / Send Button */}
            {messageInput.trim() ? (
              <Button type="submit" variant="primary" size="md" className="p-3 shadow-lg shadow-wa-green/20">
                <Send className="w-5 h-5 text-black" />
              </Button>
            ) : (
              <Button
                type="button"
                variant={isRecordingVoice ? "danger" : "secondary"}
                size="md"
                onClick={handleToggleVoiceRecording}
                className="p-3"
                title="Simulate Voice Note Recording"
              >
                {isRecordingVoice ? <Volume2 className="w-5 h-5 animate-bounce text-red-400" /> : <Mic className="w-5 h-5 text-wa-subtext" />}
              </Button>
            )}
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-wa-dark-bg p-8 text-center">
          <div className="max-w-md space-y-4">
            <Bot className="w-16 h-16 text-wa-green mx-auto opacity-80 animate-pulse" />
            <h3 className="text-xl font-bold text-wa-text">Select a WhatsApp Conversation</h3>
            <p className="text-sm text-wa-subtext">Choose a lead from the sidebar to view chat history, manage Kanban stages, and activate the Gemini AI Reply Assistant.</p>
          </div>
        </div>
      )}
    </div>
  );
};
