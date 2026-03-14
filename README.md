# PayIntent — Intelligent Checkout Recovery Agent

70% of online payment checkouts are abandoned before completion. PayIntent is a full-funnel, AI-powered checkout recovery system that uses Pine Labs transaction signals and conversational AI to diagnose payment dropoffs and recover them in real time.

## Getting Started

1. **Install Dependencies**  
   Run `npm install` (this should be already done).

2. **Start the Development Server**  
   Run `npm run dev` and navigate to `http://localhost:3000`.

## Features Built

1. **Demo Hub (`/`)**
   The main portal to navigate between the agent demo, the merchant dashboard, and the pine labs dashboard.

2. **Conversational Checkout Agent (`/checkout`)**
   A simulation of the embedded AI chat widget that helps users find EMI deals, apply discounts, and complete payments without dealing with static forms. It also simulates frontend behavioural events (Drop-offs).

3. **Merchant Dashboard (`/merchant`)**
   A real-time Recharts dashboard that shows a specific merchant (e.g., Croma) their funnel analytics, drop-offs by stage (like OTP Timeout, EMI Confusion), AI calls made, and full transaction-level recovery logs.

4. **Pine Labs Operations Dashboard (`/pinelabs`)**
   A global network dashboard showing the health of bank API redirects, recovery rate by regional languages, and the total value protected globally across the Pine Labs network.

5. **AI Trigger Webhooks (`/api/webhook/...` & `/api/voice/...`)**
   Endpoints set up to receive both hard failures (`pinelabs_webhook`) mapping errors like `otp_timeout`, and soft failures (`frontend_behavioural`). These automatically dispatch actions to the voice AI agent node (`/api/voice/trigger`).
