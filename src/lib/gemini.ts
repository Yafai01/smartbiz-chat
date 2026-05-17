import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
export const isGeminiConfigured = Boolean(apiKey);
const genAI = isGeminiConfigured ? new GoogleGenerativeAI(apiKey) : null;

// ==========================================
// GEMINI AI SERVICE FUNCTIONS
// ==========================================

export interface SuggestedReplyParams {
  customerMessage: string;
  chatHistory?: string;
  tone?: 'professional' | 'casual' | 'persuasive' | 'empathetic';
  language?: string;
  urgency?: 'high' | 'normal' | 'low';
}

export const generateAIReply = async ({
  customerMessage,
  chatHistory = '',
  tone = 'professional',
  language = 'English',
  urgency = 'normal'
}: SuggestedReplyParams): Promise<string> => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
      const prompt = `You are SmartBiz Chat AI, an expert WhatsApp sales assistant for a premium business.
Customer Message: "${customerMessage}"
Recent Chat Context: "${chatHistory}"
Requested Tone: ${tone}
Target Language: ${language}
Urgency Level: ${urgency}

Task: Generate a concise, high-converting, professional WhatsApp reply. Keep it under 3 sentences, use appropriate formatting (bolding, emojis), and focus on guiding the customer toward a purchase or resolving their inquiry smoothly.`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.error('Gemini API Error:', err);
      // Fallback to simulated reply if API fails
    }
  }

  // Intelligent Simulated Fallback for Hackathon Demo
  await new Promise(r => setTimeout(r, 800)); // Simulate network latency

  if (customerMessage.toLowerCase().includes('discount') || customerMessage.toLowerCase().includes('price')) {
    if (tone === 'persuasive') {
      return `👋 Hello! We'd love to help you get the best value. We can offer an exclusive *10% hackathon discount* on your order today! Shall I generate the secure checkout link for you? 🚀`;
    }
    return `Hello! We offer competitive pricing and special bundle discounts for business customers. Let me know which items from our catalog you'd like to include in your quote! 📦`;
  }

  if (customerMessage.toLowerCase().includes('shipping') || customerMessage.toLowerCase().includes('delivery')) {
    return `🚚 We provide fast express shipping worldwide! Orders placed before 2 PM are dispatched the same day with full tracking. Let us know your delivery location! 📍`;
  }

  return `👋 Hi there! Thank you for contacting SmartBiz. How can I assist you with our product lineup or business solutions today? Let me know if you'd like to see our latest catalog! ✨`;
};

export interface VoiceSummaryResult {
  summary: string;
  intent: string;
  suggestedReply: string;
}

export const summarizeVoiceNote = async (transcription: string): Promise<VoiceSummaryResult> => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
      const prompt = `Analyze this transcribed customer voice note: "${transcription}". Return a JSON object with exactly three keys: "summary" (1 concise sentence), "intent" (e.g., purchase_inquiry, support_request, urgent_question), and "suggestedReply" (a high-converting, polite WhatsApp reply).`;
      const result = await model.generateContent(prompt);
      const clean = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (err) {
      console.error('Gemini Voice Summary Error:', err);
    }
  }

  await new Promise(r => setTimeout(r, 1000));
  return {
    summary: "Customer is asking about bulk pricing and delivery times for the premium wireless headphones.",
    intent: "purchase_inquiry",
    suggestedReply: "🎧 We offer a 15% discount on bulk orders of 10+ units with 2-day express shipping! Would you like me to generate an invoice for your approval?"
  };
};

export interface LeadScoreResult {
  score: number;
  reasons: string[];
  recommendation: string;
}

export const calculateLeadScore = async (contactName: string, messagesContent: string): Promise<LeadScoreResult> => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
      const prompt = `Analyze the interaction history for lead "${contactName}": "${messagesContent}". Calculate a lead score from 1 to 100 based on buying intent, engagement, and budget signals. Return a JSON object with: "score" (number), "reasons" (array of 3 strings explaining the score), and "recommendation" (1 sentence next action for the sales rep).`;
      const result = await model.generateContent(prompt);
      const clean = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (err) {
      console.error('Gemini Lead Score Error:', err);
    }
  }

  await new Promise(r => setTimeout(r, 600));
  return {
    score: 88,
    reasons: [
      "Customer explicitly asked for contract terms and annual pricing.",
      "High responsiveness and positive sentiment in recent messages.",
      "Requested the updated product catalog to add more items."
    ],
    recommendation: "Send the updated invoice immediately with the 10% prepayment discount to close the deal today."
  };
};
