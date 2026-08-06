# CRD Tractor Parts - LINE Official Account Bot

This repository contains the source code for the **CRD Tractor Parts** LINE Official Account bot. The bot is developed as a comprehensive solution for tractor parts businesses, featuring an intelligent assistant and interactive menus to enhance customer experience and streamline operations.

## Features

- **Automated Welcome & Quick Replies:** Instantly greets new followers with a professional message and provides quick action buttons to navigate the bot's features easily.
- **Interactive Flex Message Catalog:** Displays a beautifully structured carousel of tractor parts and products, complete with images, pricing, and descriptions. Users can click "View Details" to receive more information via Postback actions.
- **Context-Aware AI Assistant (Gemini):** Integrated with Google's Gemini Flash model to serve as a virtual mechanic and sales representative. The AI is specifically prompted with the store's information (hours, location, contact) and can answer technical queries, maintaining conversation history (Context Memory) for a natural chat flow.
- **Spectacular E-Commerce UI (LIFF):** Integrated with LINE Front-end Framework (LIFF) to provide a stunning, dark-themed, glassmorphism product catalog. Users can browse products in a premium full-screen web app.
- **Floating Cart & Chat Checkout:** Users can add products to their cart either via Flex Messages or the LIFF App. When checking out, the bot automatically tallies the total price and generates a summary invoice directly in the chat.
- **AI Slip Verification (Gemini Vision):** Revolutionary checkout process! Instead of manual verification, users upload a picture of their bank transfer slip. The bot utilizes Gemini's multimodal capabilities (Gemini 1.5 Flash) to "read" the numbers on the slip and instantly verify if the transferred amount matches the cart total.
- **Admin Push Notifications:** The moment an order is placed and the slip is verified by the AI, the bot uses the Push Message API to instantly alert the store owner/admin with the order details and user ID.
- **Hybrid Human-Bot Handoff:** Engineered with a seamless fallback mechanism. If a user types a standard conversational message, the bot remains silent, allowing human administrators to jump in and reply via the LINE Official Account Manager without any disruptive auto-replies.

## Tech Stack

- **Node.js & Express:** Core server framework.
- **@line/bot-sdk:** Official LINE Messaging API SDK for handling events and sending replies.
- **@google/generative-ai:** Google Gemini API for intelligent, natural language processing.
- **dotenv:** Environment variable management.

## Setup Instructions

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory based on `.env.example`.
4. Configure your `.env` variables:
   ```env
   CHANNEL_SECRET=your_line_channel_secret
   CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. Run `npm run dev` to start the local development server (uses nodemon).
6. Run `npm start` to start the production server.

## Deployment

This bot is fully configured to be deployed on cloud platforms like **Render.com**. 
Simply link this repository to a new Web Service on Render, configure the Environment Variables in the Render dashboard, and use `npm start` as the start command.

---
*Developed as a Final Project for the LINE Official Account Design & Development course.*
