# System Architecture - CRD Tractor Parts

This document outlines the software structure and architecture of the CRD Tractor Parts LINE Official Account system.

## 1. High-Level Architecture

The system consists of 4 main components:
1. **LINE Client (Users):** Customers interact with the bot via LINE Chat and LIFF App.
2. **Node.js Webhook Server (Core Backend):** The main server (Express.js) that receives LINE Webhooks, parses data, and processes business logic.
3. **AI Engine (Gemini 1.5 Flash):** Google's AI model used for technical consultations regarding tractor issues.
4. **Omnichannel Admin Dashboard:** A web interface (HTML/JS) for administrators to manage orders, connected to the backend via REST APIs.

## 2. Data Flow

- **Incoming Events:** LINE Platform sends HTTP POST requests to `/callback`.
- **Signature Validation:** Secures the endpoint using `CHANNEL_SECRET`.
- **Event Dispatching:** Routes events (Text, Image) to `messageHandler.js`.
- **State Management:** User states (Shopping Cart, VIP Points, Orders) are stored in an In-Memory `Map` inside `store.js` for ultra-fast read/write operations.

## 3. API Integrations

- **LINE Messaging API (v9):** Utilized for `replyMessage` (answering chats), `pushMessage` (admin alerts/VIP upgrades), and fetching uploaded slip images.
- **Google Generative AI:** Uses `generateContent` to analyze user inquiries and provide expert mechanical advice.
- **QR Code Generation:** Generates Dynamic PromptPay QR codes locally using the `qrcode` library and serves them via the `public/uploads` static directory.

## 4. Security Measures

- **Webhook Validation:** Prevents unauthorized HTTP requests.
- **Admin Authentication:** Two-layer security for admin access (Chat Command password `/admin fatmonkey` and Web Dashboard PIN protection).
- **Data Privacy:** Slip images are stored temporarily in an ephemeral storage environment and automatically purged on server restarts.
