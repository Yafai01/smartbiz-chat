import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Clock, 
  ShoppingBag, 
  Sparkles,
  ArrowUpRight,
  Bot
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsView: React.FC = () => {
  const { contacts, products } = useApp();

  // Metrics Calculations
  const totalLeads = contacts.length;
  const wonLeads = contacts.filter(c => c.kanban_stage === 'Won').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0.0';
  
  // Sales estimate calculation
  const avgOrderValue = 185.00; // Simulated AOV
  const salesEstimate = (wonLeads * avgOrderValue).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  // Busiest hours simulation data
  const busiestHours = [
    { hour: '08:00', count: 12, height: 'h-16' },
    { hour: '10:00', count: 28, height: 'h-32' },
    { hour: '12:00', count: 45, height: 'h-48' },
    { hour: '14:00', count: 65, height: 'h-64' },
    { hour: '16:00', count: 52, height: 'h-52' },
    { hour: '18:00', count: 34, height: 'h-36' },
    { hour: '20:00', count: 18, height: 'h-20' },
  ];

  // Lead Funnel simulation data
  const funnelStages = [
    { stage: 'New Leads', count: contacts.filter(c => c.kanban_stage === 'New Lead').length, percentage: 100, color: 'bg-blue-400' },
    { stage: 'Interested', count: contacts.filter(c => c.kanban_stage === 'Interested').length, percentage: 75, color: 'bg-sky-400' },
    { stage: 'Negotiation', count: contacts.filter(c => c.kanban_stage === 'Negotiation').length, percentage: 45, color: 'bg-amber-400' },
    { stage: 'Closed Won', count: wonLeads, percentage: 25, color: 'bg-wa-green' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-wa-dark-bg p-6 overflow-y-auto select-none space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-xl font-bold text-wa-text flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-wa-green" /> Commerce Analytics & AI Performance
          </h2>
          <p className="text-xs text-wa-subtext mt-1">Real-time metrics, conversion funnels, and Gemini AI automation performance tracking.</p>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 bg-wa-green/10 border border-wa-green/20 px-3 py-1.5 rounded-xl text-wa-green">
          <span className="w-2 h-2 rounded-full bg-wa-green animate-pulse" />
          <span className="text-xs font-bold">Live WhatsApp Cloud Sync</span>
        </div>
      </div>

      {/* Key Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Response Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-wa-secondary border border-white/5 p-5 rounded-2xl shadow-xl flex flex-col justify-between glass-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-wa-green/10 flex items-center justify-center text-wa-green">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-wa-green flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +2.4%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-wa-text mb-1">98.5%</h3>
            <p className="text-xs text-wa-subtext font-medium">AI Response Rate</p>
          </div>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-wa-secondary border border-white/5 p-5 rounded-2xl shadow-xl flex flex-col justify-between glass-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-wa-green flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +5.1%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-wa-text mb-1">{conversionRate}%</h3>
            <p className="text-xs text-wa-subtext font-medium">Chat Conversion Rate</p>
          </div>
        </motion.div>

        {/* Total Leads */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-wa-secondary border border-white/5 p-5 rounded-2xl shadow-xl flex flex-col justify-between glass-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-wa-subtext">Active</span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-wa-text mb-1">{totalLeads}</h3>
            <p className="text-xs text-wa-subtext font-medium">Total WhatsApp Leads</p>
          </div>
        </motion.div>

        {/* Sales Estimate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-wa-secondary border border-white/5 p-5 rounded-2xl shadow-xl flex flex-col justify-between glass-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-wa-green flex items-center justify-center text-black shadow-lg shadow-wa-green/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-wa-green flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-wa-text mb-1">{salesEstimate}</h3>
            <p className="text-xs text-wa-subtext font-medium">Estimated Sales Value</p>
          </div>
        </motion.div>

        {/* AI Handled % */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-wa-secondary border border-white/5 p-5 rounded-2xl shadow-xl flex flex-col justify-between glass-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Gemini AI
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-wa-text mb-1">85.0%</h3>
            <p className="text-xs text-wa-subtext font-medium">Inquiries AI Handled</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Row: Busiest Hours & Lead Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Busiest Hours Chart */}
        <div className="bg-wa-secondary border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between glass-panel">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-wa-text flex items-center gap-2">
                <Clock className="w-5 h-5 text-wa-green" /> Busiest Customer Inquiry Hours
              </h3>
              <p className="text-xs text-wa-subtext mt-1">Peak WhatsApp messaging volume by time of day</p>
            </div>
          </div>

          {/* Animated Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-64 pt-8 pb-2 border-b border-white/5 px-2">
            {busiestHours.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: item.count * 3 }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="w-full bg-wa-green/20 group-hover:bg-wa-green border border-wa-green/30 group-hover:border-wa-green rounded-t-xl transition-colors relative flex items-center justify-center"
                >
                  <span className="absolute -top-6 text-[10px] font-bold text-wa-text opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                </motion.div>
                <span className="text-[10px] font-medium text-wa-subtext">{item.hour}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-wa-subtext">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-wa-green/20 border border-wa-green/30" /> Normal Volume</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-wa-green" /> Peak Volume</span>
          </div>
        </div>

        {/* Lead Conversion Funnel */}
        <div className="bg-wa-secondary border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between glass-panel">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-wa-text flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-wa-green" /> Lead Conversion Funnel
              </h3>
              <p className="text-xs text-wa-subtext mt-1">Pipeline progression from New Lead to Closed Won</p>
            </div>
          </div>

          {/* Funnel Bars */}
          <div className="space-y-4 my-auto py-4">
            {funnelStages.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-wa-text px-1">
                  <span>{item.stage}</span>
                  <span className="text-wa-subtext">{item.count} leads ({item.percentage}%)</span>
                </div>
                <div className="h-4 w-full bg-wa-dark-bg rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-wa-dark-bg p-4 rounded-xl border border-white/5 flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-wa-text font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Conversion Recommendation
            </div>
            <p className="text-xs text-wa-green font-medium">Send catalog bundle to Negotiation leads</p>
          </div>
        </div>
      </div>

      {/* Top Products Breakdown */}
      <div className="bg-wa-secondary border border-white/5 rounded-2xl p-6 shadow-xl glass-panel">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div>
            <h3 className="font-bold text-base text-wa-text flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-wa-green" /> Top Performing Catalog Products
            </h3>
            <p className="text-xs text-wa-subtext mt-1">Most frequently shared and purchased items via WhatsApp Cloud API</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, idx) => (
            <div key={product.id} className="bg-wa-dark-bg border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-md group hover:border-wa-green/30 transition-all">
              <div>
                <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-3 border border-white/5" />
                <h4 className="font-bold text-wa-text text-sm mb-1 line-clamp-1">{product.name}</h4>
                <p className="text-xs text-wa-green font-extrabold mb-3">${product.price}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-wa-subtext">
                <span>Rank #{idx + 1}</span>
                <span className="font-bold text-wa-text">{product.stock_count} units left</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
