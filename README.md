# 🚜 CRD Tractor Parts - Next-Gen AI LINE Official Account

ระบบ LINE Official Account สำหรับร้านขายอะไหล่รถไถ (CRD Tractor Parts) รองรับระบบปรึกษาปัญหาเครื่องจักรด้วย AI, การสั่งซื้อสินค้าผ่านแคตตาล็อก LIFF, การสร้าง PromptPay QR Code อัตโนมัติ, การตรวจสอบสลิปโอนเงินผ่านระบบ Admin Dashboard, และระบบสะสมแต้ม VIP (CRM) แบบครบวงจร

**Github :** [novterss/CRD.Tractorparts-Line](https://github.com/novterss/CRD.Tractorparts-Line)
**Readme ของโปรเจ็ค :** [CRD.Tractorparts-Line/README.md](https://github.com/novterss/CRD.Tractorparts-Line/blob/main/README.md)
**Docs ของโปรเจ็คแบบละเอียด EN/TH :** [CRD.Tractorparts-Line/docs](https://github.com/novterss/CRD.Tractorparts-Line/tree/main/docs)
**Manual การใช้งาน :** [Manual.pdf](#) *(Coming Soon)*
**Link สำหรับแอดเพื่อน Line OA :** [https://line.me/R/ti/p/@927bswpu](https://line.me/R/ti/p/@927bswpu)

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- **AI Mechanic Consultant:** ล้ำหน้าด้วยการเชื่อมต่อกับ Gemini 1.5 Flash ทำหน้าที่เป็นช่างเทคนิคที่คอยให้คำปรึกษาปัญหาเครื่องจักรเบื้องต้นได้อย่างชาญฉลาดและเป็นธรรมชาติ (Context Memory)
- **Customer Catalog (LIFF):** ลูกค้าสามารถเปิดหน้าแคตตาล็อกผ่าน LIFF Web App เลือกสินค้าลงตะกร้า และส่งรายการสรุปออเดอร์ (Checkout) เข้าไปในแชท LINE ได้ทันที
- **Dynamic PromptPay QR Code:** เมื่อลูกค้ากดสั่งซื้อหรือขอชำระเงิน บอทจะคำนวณยอดรวมและสร้างรูปภาพ QR Code พร้อมเพย์ที่ฝังยอดเงินเป๊ะๆ ส่งกลับให้ลูกค้าสแกนจ่ายได้ทันที (ลดความผิดพลาดในการโอนเงิน)
- **Omnichannel Admin Dashboard (Web + LINE):** ระบบจัดการร้านค้า 2 ช่องทาง! แอดมินสามารถกดยืนยันสลิปผ่านทาง LINE แชทได้ทันทีเมื่ออยู่ข้างนอก (God Mode: `/admin fatmonkey`) หรือล็อกอินผ่านเว็บไซต์หลังบ้าน (PIN Protection: `fatmonkey`) เพื่อตรวจสอบสลิปและกรอกเลขพัสดุได้อย่างเป็นระบบ
- **Automated CRM & VIP System:** เมื่อแอดมินกด "อนุมัติสลิป" ลูกค้าจะได้รับแต้มสะสมโดยอัตโนมัติ (100 บาท = 1 แต้ม) และสามารถเช็คสถานะ VIP (BRONZE, SILVER, GOLD) ผ่านรูปแบบการ์ดสะสมแต้ม (Flex Message) สุดพรีเมียม
- **Smart Logistics Tracking:** แอดมินสามารถส่งเลขพัสดุให้ลูกค้าผ่านระบบหลังบ้าน ลูกค้าจะได้รับการ์ดสถานะจัดส่ง พร้อมปุ่มกดลิงก์เช็คสถานะกับ KEX (Kerry Express) แบบเรียลไทม์
- **Store Location & Contact:** พิมพ์ "ติดต่อ" เพื่อรับที่อยู่ พิกัด Google Maps และเบอร์โทรศัพท์ของหน้าร้านทันที

---

## 🛠 Tech Stack & Infrastructure

| Layer | Technology | หน้าที่ |
| --- | --- | --- |
| **Frontend** | Vanilla HTML, CSS, JavaScript | หน้าต่างแคตตาล็อก LIFF, ระบบตะกร้าสินค้า และหน้า Admin Dashboard |
| **Backend** | Node.js + Express.js | REST API + ระบบรับและจัดการ LINE Webhook |
| **Database** | In-Memory (ES6 Map) | จัดการ State ของตะกร้าสินค้า แต้มสะสม และออเดอร์เพื่อความรวดเร็วสูงสุด |
| **File Storage** | Local File System (Render) | เก็บไฟล์รูป QR Code และสลิปโอนเงินชั่วคราว |
| **AI Processing** | Google Gemini 1.5 Flash | ประมวลผลภาษา (Natural Language Processing) ตอบคำถามทางเทคนิค |
| **LINE Integration** | @line/bot-sdk v9 | ส่ง Flex Message, รับ Webhook, ส่ง Push Notification, ดึงข้อมูลรูปภาพสลิป |
| **QR Generation** | promptpay-qr + qrcode | สร้างรูป PromptPay QR Code แบบ Dynamic ฝังยอดเงิน |
| **Deployment** | Render.com | Cloud Hosting สำหรับรันเซิร์ฟเวอร์แบบ 24/7 (Auto Deploy) |

---

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

---

## 👨‍💻 ผู้จัดทำ (Authors)

- **ณพัชรกัณฑ์ พัชญ์ชัยพงศา (6800401)**
- **ธนากร ยั่งยืน (6803317)**
