# สถาปัตยกรรมระบบ (System Architecture) - CRD Tractor Parts

เอกสารนี้อธิบายโครงสร้างและสถาปัตยกรรมซอฟต์แวร์ของระบบ CRD Tractor Parts LINE Official Account

## 1. ภาพรวมสถาปัตยกรรม (High-Level Architecture)

ระบบประกอบด้วย 4 ส่วนหลัก (Components):
1. **LINE Client (ผู้ใช้งาน):** ลูกค้าโต้ตอบกับบอทผ่าน LINE Chat และ LIFF App
2. **Node.js Webhook Server (Core Backend):** เซิร์ฟเวอร์หลัก (Express.js) รับ Webhook จาก LINE แปลงข้อมูล และประมวลผลตรรกะทางธุรกิจ
3. **AI Engine (Gemini 1.5 Flash):** โมเดล AI จาก Google ที่ใช้ในการตอบคำถามทางเทคนิคเรื่องรถไถ
4. **Omnichannel Admin Dashboard:** หน้าเว็บสำหรับผู้ดูแลระบบ (HTML/JS) ที่เชื่อมต่อกับ Backend ผ่าน REST API 

## 2. โครงสร้างข้อมูล (Data Flow)

- **Incoming Events:** LINE Platform ส่ง HTTP POST request มาที่ `/callback`
- **Signature Validation:** ตรวจสอบความถูกต้องของ Webhook ด้วย `CHANNEL_SECRET`
- **Event Dispatching:** แยกประเภทเหตุการณ์ (ข้อความ, รูปภาพ) ไปยัง `messageHandler.js`
- **State Management:** ข้อมูลสถานะของผู้ใช้ (ตะกร้า, คะแนน VIP, สถานะพัสดุ) จะถูกจัดเก็บในหน่วยความจำ (In-Memory `Map`) ในไฟล์ `store.js` เพื่อการอ่านเขียนที่รวดเร็ว

## 3. การเชื่อมต่อ API (API Integrations)

- **LINE Messaging API (v9):** ใช้สำหรับ `replyMessage` (ตอบแชท), `pushMessage` (แจ้งเตือนสลิป/เลื่อนขั้น), และดึงรูปภาพสลิปที่ลูกค้าส่งมา
- **Google Generative AI:** เรียกใช้เมธอด `generateContent` เพื่อส่งคำถามของลูกค้าและรับคำตอบที่มีความรู้ทางวิศวกรรม/ช่างซ่อม
- **QR Code Generation:** สร้าง QR โค้ด PromptPay แบบออฟไลน์ภายในเซิร์ฟเวอร์ด้วยไลบรารี `qrcode` และเก็บในโฟลเดอร์ `public/uploads`

## 4. ความปลอดภัย (Security)

- **Webhook Validation:** ป้องกัน HTTP Request ปลอมที่ไม่ได้มาจาก LINE
- **Admin Authentication:** การป้องกันการเข้าถึงสิทธิ์แอดมินด้วย Password ในแชท (`/admin fatmonkey`) และ PIN Protection ในหน้า Web Dashboard
- **Data Privacy:** รูปสลิปจะถูกเก็บชั่วคราวและลบออกอัตโนมัติเมื่อมีการ Deploy ใหม่ (Ephemeral Storage)
