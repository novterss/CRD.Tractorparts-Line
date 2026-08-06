# สถาปัตยกรรมระบบ (System Architecture) - CRD Tractor Parts AI Bot

โปรเจกต์นี้ออกแบบมาให้เป็น **"ระบบไร้แอดมิน (Zero-Admin Operation)"** โดยใช้เทคโนโลยี Generative AI ขั้นสูงในการวิเคราะห์ภาพและข้อความ แทนที่การทำงานแบบดั้งเดิมที่ต้องใช้คนมานั่งกดอนุมัติในระบบ Dashboard

## ภาพรวมของระบบ (System Overview)

```mermaid
graph TD
    A[ลูกค้า (Customer)] -->|แชท / ส่งรูป| B(LINE Messaging API)
    A -->|เปิด LIFF App| C(LIFF E-Commerce)
    C -->|ส่งออเดอร์ (liff.sendMessages)| B
    B -->|Webhook| D{Node.js + Express Backend}
    D -->|ถามปัญหาเครื่องจักร| E(Gemini 1.5 Flash - Text)
    D -->|ส่งรูปสลิปโอนเงิน| F(Gemini 1.5 Flash - Vision)
    E -->|คำตอบผู้เชี่ยวชาญ| D
    F -->|วิเคราะห์ยอดเงิน (OCR)| D
    D -->|แจ้งเตือน (Push API)| G[แอดมิน (Admin)]
    D -->|สรุปผล| B
    B -->|ข้อความยืนยัน| A
```

## ส่วนประกอบทางเทคนิค (Tech Stack)

| เลเยอร์ (Layer) | เทคโนโลยี (Technology) | หน้าที่การทำงาน |
| --- | --- | --- |
| **Frontend** | Vanilla HTML, CSS, JS | หน้าต่างแคตตาล็อก LIFF และระบบตะกร้าสินค้า (Floating Cart) แบบเรียลไทม์ |
| **Backend** | Node.js + Express.js | ระบบจัดการ Webhook จาก LINE และ Routing การตอบกลับ |
| **AI Processing** | Google Gemini 1.5 Flash | ประมวลผลภาษาธรรมชาติ (NLP) เพื่อเป็นช่างเทคนิค และประมวลผลภาพ (Vision) เพื่ออ่านสลิปโอนเงิน |
| **State Management**| In-Memory Map | จดจำบริบทการสนทนา (Context Memory) และข้อมูลตะกร้าสินค้า |
| **LINE Integration**| @line/bot-sdk | ควบคุม Flex Message, Quick Reply, รับ Webhook และ Push Message |
| **Deployment** | Render.com | Cloud Hosting สำหรับรันเซิร์ฟเวอร์แบบ 24/7 |

## จุดเด่นทางเทคนิคที่ก้าวกระโดด (Key Technical Leaps)
1. **Multimodal AI Verification:** แตกต่างจากระบบ E-Commerce ทั่วไปที่แอดมินต้องเปิดรูปสลิปเพื่อตรวจสอบยอดเงิน ระบบนี้ดึง Stream รูปภาพจาก LINE Server แปลงเป็น Buffer และส่งให้ AI ประมวลผล OCR ทันที ลดระยะเวลาตรวจสอบจากนาทีเหลือเพียงเสี้ยววินาที
2. **Context-Aware Memory:** บอทไม่ได้ทำงานแบบ Rule-based เบื้องต้น แต่มีระบบจำบริบท (Chat Histories) ทำให้สามารถโต้ตอบปัญหารถไถได้อย่างเป็นธรรมชาติ
3. **Hybrid Handoff Protocol:** ระบบจะ "เงียบ" อัตโนมัติเมื่อไม่พบคำสั่งที่ระบุไว้ เปิดทางให้พนักงานที่เป็นมนุษย์สามารถเสียบเข้าพูดคุยได้โดยไม่เกิดการกวนจากบอท (Collision Avoidance)
