# User Flow - CRD Tractor Parts

This document outlines the user journey from initial contact to a fully automated checkout process utilizing AI.

## 1. Welcome Flow
- A user adds the bot as a friend or initiates a chat.
- The bot sends a greeting along with 4 **Quick Reply** buttons:
  1. View Products (Triggers Flex Message)
  2. Order via Web (Opens LIFF App)
  3. Consult Mechanic (AI Text Mode)
  4. Contact Admin (Store Information)

## 2. LIFF E-Commerce Flow
- The user taps **"🌐 Order via Web"**.
- A full-screen LIFF App opens, featuring a Premium Dark Theme UI.
- The user taps **"Add to Cart"**. The system instantly calculates the total and displays it on the Floating Cart.
- The user taps **"Checkout"**.
- The LIFF SDK triggers `liff.sendMessages` to automatically inject the order summary (Items + Total Amount + Bank Details) directly into the LINE chat window.

## 3. Automated AI Slip Verification Flow (The Highlight)
- The user transfers the money and **uploads a picture of the bank slip** into the chat.
- The bot detects `event.message.type === 'image'`.
- The bot retrieves the user's cart session from memory (`userCarts`) to check the expected total.
- The bot downloads the image stream from the LINE servers and converts it to a buffer.
- The image is sent to **Gemini 1.5 Flash (Vision Mode)** with a prompt instructing it to extract the transferred amount using OCR.
- **Scenario A (Success):** AI confirms the amount matches -> Cart is cleared -> Admin receives an instant Push Notification containing the order details.
- **Scenario B (Failure):** AI detects a mismatch or an invalid image -> Bot requests the user to check and re-upload.

## 4. AI Mechanic Consultation Flow
- The user asks a question prefixed with **"Ask"** (ถาม).
- The bot retrieves the user's Chat History.
- The prompt is sent to Gemini 1.5 Flash to analyze the tractor issue.
- The bot responds with professional mechanic advice.

## 5. Hybrid Human-Bot Handoff Flow
- If the user sends a standard message (e.g., "Can I get a discount?") that doesn't trigger a keyword or start with "Ask".
- The bot executes a **Stand Down protocol**, meaning it purposefully ignores the message.
- A human admin can see the message on the LINE OA Manager screen and reply manually without the bot interfering.
