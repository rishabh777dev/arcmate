# ActionMate 🚀
> **The Autonomous AI Teammate for Indian Merchants**  
> *SaaS Business Intelligence, Automation, & Revenue Growth*

---

## 🌟 Overview
**ActionMate** is a multi-tenant SaaS platform engineered for Indian merchants and micro-enterprises. It combines real-time transaction tracking, autonomous customer retention campaigns, IoT Soundbox hardware sync, and natural-language workflow automations.

### Key Capabilities:
- 📊 **Real-time Merchant Dashboard**: Track today's collections, invoices completed, payments received, and scheduled bank settlements.
- 🤖 **Autonomous AI Teammate**: Continuously analyzes transaction history and customer retention cohorts to propose revenue-driving actions with human-in-the-loop guardrails.
- ⚡ **Store Automation Studio**: Converts simple merchant descriptions into automated workflows (patron re-engagement, high-value alerts, and nightly settlement digests).
- 🔊 **Paytm Soundbox 3.0 Sync**: Direct audio verification and hardware status sync for contactless QR and card POS transactions.
- 🛡️ **Multi-Tenant Security**: Full Row-Level Security (RLS) powered by Supabase PostgreSQL and JWT authentication.

---

## 🏛️ Monorepo Structure

```
ActionMate/
├── apps/
│   └── web/                     # React 18 + Vite + Tailwind CSS + React Flow + Recharts
├── services/
│   ├── api-gateway/             # Express API Gateway + WebSocket Streaming
│   ├── agent-orchestrator/      # Autonomous Agent Brain (Gemini Flash-Lite)
│   ├── knowledge-service/       # Knowledge Graph & Store Policy Engine
│   ├── workflow-engine/         # Automation Engine & Workflow Dispatcher
│   ├── voice-service/           # Voice Engine (Sarvam AI + Paytm Soundbox Chimes)
│   └── data-service/            # Supabase Cloud Database & Sales Analytics
└── packages/
    ├── shared-schema/           # Shared Zod validation schemas
    └── mcp-core/                # Model Context Protocol (MCP) declarations
```

---

## ⚡ Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### 3. Run Development Servers
```bash
# Start backend API Gateway (Port 4000)
npm run dev --workspace=services/api-gateway

# Start frontend Vite app (Port 5173)
npm run dev --workspace=apps/web
```
Open `http://localhost:5173` in your browser.

---

## 🚀 Deployment

- **Backend (API Gateway)**: Deploy to [Render](https://render.com) as a Web Service.
  - Build Command: `npm install`
  - Start Command: `node services/api-gateway/src/server.js`
- **Frontend (Web App)**: Deploy to [Vercel](https://vercel.com).
  - Root Directory: `apps/web`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- **Database**: [Supabase](https://supabase.com) PostgreSQL with Row-Level Security (RLS).
