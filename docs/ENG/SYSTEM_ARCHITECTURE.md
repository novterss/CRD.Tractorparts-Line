# System Architecture - CRD Tractor Parts AI Bot

This project is architected as a **"Zero-Admin Operation"** system, utilizing advanced Generative AI for both text and vision processing to completely replace traditional manual dashboard approval workflows.

## System Overview

```mermaid
graph TD
    A[Customer] -->|Chat / Send Image| B(LINE Messaging API)
    A -->|Open LIFF App| C(LIFF E-Commerce)
    C -->|Send Order (liff.sendMessages)| B
    B -->|Webhook| D{Node.js + Express Backend}
    D -->|Ask Technical Question| E(Gemini 1.5 Flash - Text)
    D -->|Send Payment Slip| F(Gemini 1.5 Flash - Vision)
    E -->|Expert Response| D
    F -->|Verify Amount (OCR)| D
    D -->|Push Notification| G[Admin]
    D -->|Order Summary| B
    B -->|Confirmation Msg| A
```

## Tech Stack

| Layer | Technology | Function |
| --- | --- | --- |
| **Frontend** | Vanilla HTML, CSS, JS | LIFF Catalog Interface and Real-time Floating Cart System |
| **Backend** | Node.js + Express.js | Webhook handler and message routing logic |
| **AI Processing** | Google Gemini 1.5 Flash | Natural Language Processing (Virtual Mechanic) and Vision Processing (Slip Scanner) |
| **State Management**| In-Memory Map | Maintains Context Memory for chats and temporary user cart sessions |
| **LINE Integration**| @line/bot-sdk | Manages Flex Messages, Quick Replies, Webhook processing, and Push Messages |
| **Deployment** | Render.com | Cloud Hosting for 24/7 continuous operation |

## Key Technical Leaps
1. **Multimodal AI Verification:** Unlike traditional E-Commerce bots that require a human admin to log into a dashboard to verify payment slips, this system intercepts the image stream directly from the LINE Server and feeds it into the AI's Vision model. It instantly reads the digits and verifies the payment, cutting verification time from minutes to milliseconds.
2. **Context-Aware Memory:** This is not a basic rule-based bot. It stores conversation histories, allowing the AI to understand subsequent questions naturally.
3. **Hybrid Handoff Protocol:** Built with collision avoidance. If a user sends a normal message that does not trigger specific keywords, the bot remains silent (stands down), allowing a human admin to take over the conversation seamlessly without bot interference.
