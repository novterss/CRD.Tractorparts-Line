import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION =
  'คุณเป็นผู้เชี่ยวชาญด้านรถไถและอะไหล่รถไถประจำร้าน CRD Tractor Parts ' +
  'ตอบเป็นภาษาไทย กระชับ ชัดเจน และเป็นมิตร ' +
  'ให้คำแนะนำเกี่ยวกับการซ่อมบำรุงรถไถ และแนะนำสินค้าของร้าน (เช่น แก้มบุ้งกี๋, ฟันรถขุด, อะไหล่แทรคเตอร์, อะไหล่ช่วงล่าง) หากเกี่ยวข้อง ' +
  'ข้อมูลร้าน: หน้าร้านอยู่เซียงกงรังสิต(ศูนย์เก่า) เปิด 08.00-17.30 น. ปิดวันอาทิตย์ เบอร์โทร: 097-474-9944, 086-334-9491 LINE: 0974749944 facebook: crdtractor ' +
  '[CRITICAL RULE: If the user communicates in English, Burmese (Myanmar), Cambodian, or any other language, you MUST respond in that EXACT language to facilitate international construction workers. Translate all technical terms appropriately.]';

const chatHistories = new Map();

export async function askGemini(userId, userMessage) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const history = chatHistories.get(userId) ?? [];
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const answer = result.response.text();

    chatHistories.set(userId, [
      ...history,
      { role: 'user', parts: [{ text: userMessage }] },
      { role: 'model', parts: [{ text: answer }] },
    ]);

    return answer;
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'ขออภัยครับ ตอนนี้ระบบ AI ของเรามีปัญหาเล็กน้อย กรุณาลองใหม่อีกครั้งหรือติดต่อพนักงานได้เลยครับ';
  }
}

export async function verifySlip(imageBuffer, expectedAmount) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use the latest flash model which supports multimodality (vision)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `คุณคือ AI ตรวจสอบสลิปโอนเงินของร้าน CRD Tractor Parts
ลูกค้าต้องโอนเงินจำนวน ${expectedAmount} บาท
กรุณาดูรูปนี้และบอกว่า:
1. เป็นสลิปโอนเงินธนาคารของไทยใช่หรือไม่?
2. ยอดเงินโอนตรงกับ ${expectedAmount} บาท หรือไม่?
ถ้าตรง ให้ตอบว่า "✅ ยืนยันการชำระเงินเรียบร้อย! (ระบบ AI ตรวจสอบยอด ${expectedAmount} บาทถูกต้อง)"
ถ้าไม่ตรง ให้ตอบว่า "❌ ยอดเงินไม่ถูกต้อง หรือไม่ใช่สลิปโอนเงิน กรุณาตรวจสอบอีกครั้ง"`;

    const imageParts = [
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg',
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    return result.response.text();
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    return 'ขออภัยครับ ระบบ AI ตรวจสลิปขัดข้อง กรุณารอแอดมินมาตรวจสอบให้นะครับ';
  }
}

export async function processAudio(userId, audioBuffer) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const audioParts = [
      {
        inlineData: {
          data: audioBuffer.toString('base64'),
          mimeType: 'audio/mp4', // LINE sends audio usually in m4a/mp4 format
        },
      },
    ];

    const history = chatHistories.get(userId) ?? [];
    const chat = model.startChat({ history });
    
    // Using generateContent format for multimodal in chat
    const result = await chat.sendMessage([{ text: 'ผู้ใช้ส่งไฟล์เสียงมา กรุณาฟังและตอบกลับอย่างเหมาะสมตามข้อมูลร้าน' }, ...audioParts]);
    const answer = result.response.text();

    chatHistories.set(userId, [
      ...history,
      { role: 'user', parts: [{ text: '🎙️ [ส่งไฟล์เสียง]' }] },
      { role: 'model', parts: [{ text: answer }] },
    ]);

    return answer;
  } catch (error) {
    console.error('Gemini Audio Error:', error);
    return 'ขออภัยครับ ระบบประมวลผลเสียงขัดข้อง กรุณาพิมพ์ข้อความแทนนะครับ';
  }
}

