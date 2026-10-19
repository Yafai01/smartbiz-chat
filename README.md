# SmartBiz Chat

SmartBiz Chat is an AI-assisted WhatsApp sales and CRM dashboard for small businesses. The React front end provides a WhatsApp-style inbox, a Kanban lead pipeline, a product catalog, automation rules, and analytics, with Google Gemini generating reply suggestions, lead scores, and voice-note summaries. An optional Express backend handles WhatsApp Cloud API webhooks, sends outgoing messages through the Graph API, and can store incoming messages in Supabase.

## Features

- **Chat inbox** – WhatsApp-style conversation view with Gemini-generated reply suggestions (configurable tone, language, urgency) and voice-note summarisation.
- **Lead CRM** – drag-and-drop Kanban pipeline (New Lead to Closed Won) with Gemini-based lead scoring and buying-intent insights.
- **Product catalog** – add products, generate descriptions with Gemini, and send products into a chat.
- **Automation** – create, toggle, and simulate follow-up rules with a Gemini action prompt.
- **Analytics** – lead count, conversion rate, and pipeline stats derived from the current contact data (some figures, such as average order value, are simulated).
- **Backend (optional)** – WhatsApp webhook verification and message intake with Gemini sentiment/intent classification, outgoing message API, and AI reply/summary endpoints.
- **Works without keys** – front-end data is stored in `localStorage` with seeded demo data; Gemini and WhatsApp features fall back gracefully when not configured.

## Tech stack

- **Front end:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, react-hot-toast, lucide-react
- **AI:** Google Gemini (`@google/generative-ai`)
- **Backend:** Node.js, Express, Axios, WhatsApp Cloud API
- **Database (optional):** Supabase (schema in `supabase/schema.sql`)

## Getting started

### Prerequisites

- Node.js (a recent LTS release) and npm
- Optional: a Gemini API key, a Supabase project, and WhatsApp Cloud API credentials

### Environment variables

Copy the example file and fill in the values you have:

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase project (optional) |
| `VITE_WHATSAPP_ACCESS_TOKEN` / `VITE_WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Cloud API credentials (used by the backend) |
| `VITE_BACKEND_URL` | Backend URL used by the front end (defaults to `http://localhost:3001`) |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verify token for the backend |
| `PORT` | Backend port (defaults to `3001`) |

> Variables prefixed with `VITE_` are bundled into the browser build. Do not put production secrets in them for a publicly deployed front end.

### Run the front end

```bash
npm install
npm run dev
```

### Run the backend (optional)

The server reads the `.env` file from the project root, so start it from the `server/` directory:

```bash
cd server
npm install
npm start
```

To use Supabase, run `supabase/schema.sql` in your Supabase SQL editor first.

### Scripts (front end)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
server/index.js          # Express backend: WhatsApp webhook, send API, AI endpoints
supabase/schema.sql      # Database schema
src/
  context/AppContext.tsx # App state (auth, contacts, messages, products, rules)
  lib/                   # Gemini, Supabase/local storage, WhatsApp client helpers
  components/
    chat/  crm/  catalog/  automation/  analytics/  auth/  layout/  ui/
```
