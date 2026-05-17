import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize Supabase Client if keys exist
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Initialize Gemini AI
const geminiApiKey = process.env.VITE_GEMINI_API_KEY || '';
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

// WhatsApp Cloud API Config
const WHATSAPP_TOKEN = process.env.VITE_WHATSAPP_ACCESS_TOKEN || '';
const PHONE_NUMBER_ID = process.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '';
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'smartbiz_hackathon_2026';

// ==========================================
// WHATSAPP CLOUD API WEBHOOKS
// ==========================================

// Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  return res.status(400).send('Missing parameters');
});

// Incoming WhatsApp Messages (POST)
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from; // Sender phone number
      const msgBody = message.text ? message.text.body : 'Media/Audio Attachment';

      console.log(`Incoming message from ${from}: ${msgBody}`);

      // Perform AI Intent & Sentiment classification
      let sentiment = 'neutral';
      let intent = 'inquiry';

      if (genAI) {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
          const prompt = `Analyze this incoming customer message: "${msgBody}". Return a JSON object with exactly two keys: "sentiment" (positive, neutral, negative) and "intent" (purchase, support, question, complaint).`;
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const cleanJson = responseText.replace(/```json|```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          sentiment = parsed.sentiment || 'neutral';
          intent = parsed.intent || 'question';
        } catch (err) {
          console.error('Gemini classification error:', err);
        }
      }

      // Store in Supabase if connected
      if (supabase) {
        try {
          // Find or create contact
          let { data: contact } = await supabase.from('contacts').select('id').eq('phone_number', from).single();
          if (!contact) {
            const { data: newContact } = await supabase.from('contacts').insert({
              name: `Customer (${from.slice(-4)})`,
              phone_number: from,
              kanban_stage: 'New Lead'
            }).select().single();
            contact = newContact;
          }

          if (contact) {
            await supabase.from('messages').insert({
              contact_id: contact.id,
              whatsapp_message_id: message.id,
              sender_type: 'customer',
              content: msgBody,
              sentiment: sentiment
            });
          }
        } catch (dbErr) {
          console.error('Database storage error:', dbErr);
        }
      }

      return res.status(200).send('EVENT_RECEIVED');
    }
    return res.status(200).send('EVENT_RECEIVED');
  } else {
    return res.sendStatus(404);
  }
});

// Outgoing Message Sender API
app.post('/api/messages/send', async (req, res) => {
  const { to, type, content, mediaUrl, catalogId } = req.body;

  if (!to || (!content && !mediaUrl && !catalogId)) {
    return res.status(400).json({ error: 'Missing destination or message content' });
  }

  // If live WhatsApp Token is provided, send via official Graph API
  if (WHATSAPP_TOKEN && PHONE_NUMBER_ID) {
    try {
      let payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: type || "text"
      };

      if (type === 'text' || !type) {
        payload.text = { preview_url: true, body: content };
      } else if (type === 'image') {
        payload.image = { link: mediaUrl, caption: content || '' };
      } else if (type === 'audio') {
        payload.audio = { link: mediaUrl };
      } else if (type === 'interactive') {
        // Product Catalog message
        payload.type = "interactive";
        payload.interactive = {
          type: "product",
          body: { text: content || "Check out this product!" },
          action: {
            catalog_id: catalogId,
            product_retailer_id: mediaUrl // Using SKU/ID
          }
        };
      }

      const response = await axios.post(
        `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
        payload,
        { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
      );

      return res.status(200).json({ success: true, data: response.data });
    } catch (apiErr) {
      console.error('WhatsApp API Error:', apiErr.response ? apiErr.response.data : apiErr.message);
      return res.status(500).json({ error: 'WhatsApp API failure', details: apiErr.message });
    }
  } else {
    // Simulated Success Mode for Hackathon Demo
    console.log(`[SIMULATED WHATSAPP SEND] To: ${to} | Content: ${content}`);
    return res.status(200).json({
      success: true,
      simulated: true,
      message_id: `wamid.SIMULATED_${Date.now()}`,
      status: 'delivered'
    });
  }
});

// ==========================================
// GEMINI AI HELPER ENDPOINTS
// ==========================================

app.post('/api/ai/reply', async (req, res) => {
  const { customerMessage, chatHistory, tone, language } = req.body;

  if (!genAI) {
    return res.status(200).json({
      reply: `[Simulated AI (${tone || 'professional'})]: Thank you for reaching out! We have received your inquiry regarding our products and will assist you right away. Let me know if you need our latest catalog.`
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
    const prompt = `You are SmartBiz Chat AI, a premium WhatsApp sales assistant. 
Customer Message: "${customerMessage}"
Recent Context: "${chatHistory || 'None'}"
Tone: ${tone || 'professional'}
Target Language: ${language || 'English'}

Generate a concise, high-converting, friendly WhatsApp reply. Keep it under 3 sentences, use appropriate emojis, and focus on helping the customer make a purchase decision.`;

    const result = await model.generateContent(prompt);
    return res.status(200).json({ reply: result.response.text().trim() });
  } catch (err) {
    console.error('AI Reply Error:', err);
    return res.status(500).json({ error: 'AI generation failed', details: err.message });
  }
});

app.post('/api/ai/summary', async (req, res) => {
  const { voiceTranscription } = req.body;

  if (!genAI) {
    return res.status(200).json({
      summary: "Customer is asking about bulk pricing and delivery times for the premium wireless headphones.",
      intent: "purchase_inquiry",
      suggestedReply: "We offer a 15% discount on bulk orders of 10+ units with 2-day express shipping. Would you like me to generate an invoice?"
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });
    const prompt = `Analyze this transcribed customer voice note: "${voiceTranscription}". Return a JSON object with: "summary" (1 sentence summary), "intent" (urgency/category), and "suggestedReply" (a high-converting WhatsApp reply).`;
    const result = await model.generateContent(prompt);
    const clean = result.response.text().replace(/```json|```/g, '').trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    return res.status(500).json({ error: 'Summary failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SmartBiz Chat Backend Server running on port ${PORT}`);
});
