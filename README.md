# 🚜 CRD Tractor Parts - Next-Gen AI LINE Official Account

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![LINE Messaging API](https://img.shields.io/badge/LINE_Messaging_API-00C300?style=for-the-badge&logo=LINE&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=Google&logoColor=white)

This repository contains the source code for the **CRD Tractor Parts** LINE Official Account bot. Built for the modern e-commerce era, this project combines **AI-powered customer service** with a robust **Omnichannel Admin Dashboard** to create a seamless end-to-end shopping experience—from product inquiry to checkout, payment verification, and logistics tracking.

> 📚 **Detailed Documentation**
> - 🇹🇭 [สถาปัตยกรรมระบบ (System Architecture - TH) ](./docs/THAI/SYSTEM_ARCHITECTURE.md)
> - 🇹🇭 [กระบวนการใช้งาน (User Flow - TH)](./docs/THAI/USER_FLOW.md)
> - 🇬🇧 [System Architecture (EN)](./docs/ENG/SYSTEM_ARCHITECTURE.md)
> - 🇬🇧 [User Flow (EN)](./docs/ENG/USER_FLOW.md)

## 🌟 Key Features (ฟีเจอร์หลัก)

- **Customer Catalog (LIFF):** ลูกค้าสามารถเปิดหน้าแคตตาล็อกผ่าน LIFF Web App เลือกสินค้าลงตะกร้า และส่งรายการสรุปออเดอร์เข้าแชท LINE ได้ทันที
- **Dynamic PromptPay QR Code:** เมื่อลูกค้ากดสั่งซื้อหรือขอชำระเงิน บอทจะคำนวณยอดรวมและสร้างรูปภาพ QR Code พร้อมเพย์ที่ฝังยอดเงินเป๊ะๆ ส่งกลับให้ลูกค้าสแกนจ่ายได้ทันที (ลดความผิดพลาดในการโอนเงิน)
- **Omnichannel Admin Dashboard (Web + LINE):** ระบบจัดการร้านค้า 2 ช่องทาง! แอดมินสามารถกดยืนยันสลิปผ่านทาง LINE แชทได้ทันทีเมื่ออยู่ข้างนอก (God Mode) หรือล็อกอินผ่านเว็บไซต์หลังบ้าน (PIN Protection) เพื่อตรวจสอบสลิปและกรอกเลขพัสดุได้อย่างเป็นระบบ
- **Automated CRM & VIP System:** เมื่อแอดมินกด "อนุมัติสลิป" ลูกค้าจะได้รับแต้มสะสมโดยอัตโนมัติ (100 บาท = 1 แต้ม) และสามารถเช็คสถานะ VIP (BRONZE, SILVER, GOLD) ผ่านรูปแบบการ์ดสะสมแต้ม (Flex Message) สุดพรีเมียม
- **Smart Logistics Tracking:** แอดมินสามารถส่งเลขพัสดุให้ลูกค้าผ่านระบบหลังบ้าน ลูกค้าจะได้รับการ์ดสถานะจัดส่ง พร้อมปุ่มกดลิงก์เช็คสถานะกับ KEX (Kerry Express) แบบเรียลไทม์
- **AI Mechanic Consultant:** บอทเชื่อมต่อกับ Gemini 1.5 Flash ทำหน้าที่เป็นช่างเทคนิคที่คอยให้คำปรึกษาปัญหาเครื่องจักรเบื้องต้นได้อย่างชาญฉลาด

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
