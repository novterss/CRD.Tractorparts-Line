import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION =
  'คุณเป็นผู้เชี่ยวชาญด้านรถไถและอะไหล่รถไถประจำร้าน CRD Tractor Parts ' +
  'ตอบเป็นภาษาไทย กระชับ ชัดเจน และเป็นมิตร ' +
  'ให้คำแนะนำเกี่ยวกับการซ่อมบำรุงรถไถ และแนะนำสินค้าของร้าน (เช่น แก้มบุ้งกี๋, ฟันรถขุด, อะไหล่แทรคเตอร์, อะไหล่ช่วงล่าง) หากเกี่ยวข้อง ' +
  'ข้อมูลร้าน: หน้าร้านอยู่เซียงกงรังสิต(ศูนย์เก่า) เปิด 08.00-17.30 น. ปิดวันอาทิตย์ เบอร์โทร: 097-474-9944, 086-334-9491 LINE: 0974749944 facebook: crdtractor';

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
