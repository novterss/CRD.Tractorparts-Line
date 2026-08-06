# 🚜 CRD Tractor Parts - Next-Gen AI LINE Official Account

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![LINE Messaging API](https://img.shields.io/badge/LINE_Messaging_API-00C300?style=for-the-badge&logo=LINE&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=Google&logoColor=white)

This repository contains the source code for the **CRD Tractor Parts** LINE Official Account bot. Built for the modern e-commerce era, this project takes a **"Zero-Admin"** approach. It replaces traditional manual admin dashboards with cutting-edge **Multimodal AI (Gemini 1.5 Flash)** to fully automate customer service, technical support, and payment verification.

> 📚 **Detailed Documentation**
> - 🇹🇭 [สถาปัตยกรรมระบบ (System Architecture - TH) ](./docs/THAI/SYSTEM_ARCHITECTURE.md)
> - 🇹🇭 [กระบวนการใช้งาน (User Flow - TH)](./docs/THAI/USER_FLOW.md)
> - 🇬🇧 [System Architecture (EN)](./docs/ENG/SYSTEM_ARCHITECTURE.md)
> - 🇬🇧 [User Flow (EN)](./docs/ENG/USER_FLOW.md)

## 🌟 Key Features (ฟีเจอร์หลัก)

- **Customer Catalog (LIFF):** ลูกค้าสามารถเปิดหน้าแคตตาล็อกผ่าน LIFF Web App (Premium Dark Theme) เลือกสินค้าลงตะกร้า และส่งรายการสรุปออเดอร์ (Checkout) เข้าไปในแชท LINE ได้ทันที 
- **AI Slip Verification (Vision OCR):** ล้ำหน้ากว่าระบบ E-commerce ทั่วไป! เมื่อลูกค้าส่งรูปสลิปโอนเงิน ระบบจะดึงภาพส่งให้ AI อ่านตัวเลขและตรวจสอบยอดเงินอัตโนมัติ หากยอดตรง ระบบจะปิดการขายทันทีโดยไม่ต้องพึ่งพาแอดมินมนุษย์ (Zero-Admin Validation)
- **Admin Push Notification:** เมื่อ AI อนุมัติสลิปโอนเงินเสร็จสิ้น ระบบจะยิง Push Message ไปยังแชทของแอดมินแบบเรียลไทม์ พร้อมแจ้งยอดและ ID ลูกค้า
- **Context-Aware AI Mechanic:** บอทเชื่อมต่อกับ Gemini 1.5 Flash ทำหน้าที่เป็นช่างเทคนิคที่จำบริบทการสนทนาได้ (Context Memory) สามารถตอบปัญหาเครื่องจักรได้อย่างเป็นธรรมชาติ
- **Hybrid Human-Bot Handoff:** ระบบมีฟังก์ชัน "Stand Down" หากลูกค้าไม่ได้พิมพ์คีย์เวิร์ดสั่งซื้อหรือตั้งคำถาม บอทจะเงียบเพื่อให้แอดมินตัวจริงสามารถเข้ามาคุยต่อได้โดยไม่เกิดการชนกัน (Collision)

## 🛠 Tech Stack & Infrastructure

| Layer | Technology | หน้าที่ |
| --- | --- | --- |
| **Frontend** | Vanilla HTML, CSS, JS | หน้าต่างแคตตาล็อก LIFF และระบบตะกร้าสินค้า (Floating Cart) |
| **Backend** | Node.js + Express.js | REST API + ระบบรับ LINE Webhook |
| **AI Processing** | Google Gemini 1.5 Flash | ประมวลผลภาษา (Chat) และประมวลผลภาพ (OCR อ่านสลิป) |
| **LINE Integration** | @line/bot-sdk v9 | ส่ง Flex Message, รับ Webhook, ส่ง Push Notification |
| **Deployment** | Render.com | Cloud Hosting สำหรับรันเซิร์ฟเวอร์แบบ 24/7 |

## 🚀 Setup Instructions

1. Clone this repository: `git clone https://github.com/novterss/CRD.Tractorparts-Line.git`
2. Run `npm install` to install dependencies.
3. Create a `.env` file in the root directory based on `.env.example`.
4. Configure your `.env` variables:
   ```env
   CHANNEL_SECRET=your_line_channel_secret
   CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
   GEMINI_API_KEY=your_gemini_api_key
   ```
5. Run `npm run dev` to start the local development server.

## 👨‍💻 Authors

- **ณพัชรกัณฑ์ พัชญ์ชัยพงศา (6800401)**
- **ธนากร ยั่งยืน (6803317)**

*Link สำหรับแอดเพื่อน Line OA : [https://line.me/R/ti/p/@927bswpu](https://line.me/R/ti/p/@927bswpu)*
