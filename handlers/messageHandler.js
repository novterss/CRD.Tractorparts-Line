import { createProductCatalog } from '../messages/flexMenu.js';
import { askGemini, verifySlip } from '../services/geminiService.js';

// เก็บข้อมูลตะกร้าสินค้าของลูกค้าแต่ละคน (ใน Memory ชั่วคราวสำหรับโปรเจกต์)
const userCarts = new Map();

// Helper สำหรับแปลง Stream รูปภาพจาก LINE เป็น Buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function showAiLoading(client, userId) {
  if (!userId || userId === 'anonymous') return;
  try {
    await client.showLoadingAnimation({
      chatId: userId,
      loadingSeconds: 5,
    });
  } catch (err) {
    console.error('Failed to show loading animation', err);
  }
}

export async function handleEvent(client, event, baseUrl) {
  const userId = event.source.userId;

  // Handle follow event
  if (event.type === 'follow') {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: 'text',
          text: 'สวัสดีครับ! ยินดีต้อนรับสู่ CRD Tractor Parts 🚜\nเราจำหน่ายอะไหล่รถไถคุณภาพสูง\n\nพิมพ์ "เมนู" เพื่อดูสินค้า\nหรือสอบถามปัญหาการใช้งานรถไถกับผมได้เลยครับ!',
          quickReply: {
            items: [
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: '🛒 ดูเมนูสินค้า',
                  text: 'เมนู'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: '📞 ติดต่อร้าน',
                  text: 'ติดต่อ'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'uri',
                  label: '🌐 สั่งซื้อผ่านเว็บ',
                  uri: 'https://liff.line.me/2011006005-b85CrMdl'
                }
              },
              {
                type: 'action',
                action: {
                  type: 'message',
                  label: '❓ วิธีใช้งาน',
                  text: 'ช่วยเหลือ'
                }
              }
            ]
          }
        }
      ]
    });
  }

  // Handle postback events
  if (event.type === 'postback') {
    const data = new URLSearchParams(event.postback.data);
    const action = data.get('action');
    const item = data.get('item');

    if (action === 'detail') {
      let detailText = '';
      if (item === 'oil') {
        detailText = 'น้ำมันเครื่องเกรดพรีเมียม (รหัส: O-100)\nขนาด 5 ลิตร เหมาะสำหรับเครื่องยนต์ดีเซลงานหนัก ช่วยระบายความร้อนได้ดีเยี่ยม ราคา 1,200 บาท';
      } else if (item === 'filter') {
        detailText = 'กรองอากาศแท้ (รหัส: F-200)\nช่วยดักจับฝุ่นละอองขนาดเล็ก ยืดอายุเครื่องยนต์ ควรเปลี่ยนทุกๆ 500 ชั่วโมงการทำงาน ราคา 850 บาท';
      } else {
        detailText = 'รายละเอียดสินค้านี้ยังไม่พร้อมใช้งานครับ';
      }

      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: detailText }]
      });
    }

    if (action === 'buy') {
      const price = parseInt(data.get('price'), 10);
      const itemName = item === 'oil' ? 'น้ำมันเครื่องเกรดพรีเมียม' : 'ชุดลูกกลิ้งและแทร็ก';
      
      const cart = userCarts.get(userId) || { total: 0, items: [] };
      cart.items.push(itemName);
      cart.total += price;
      userCarts.set(userId, cart);

      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          { 
            type: 'text', 
            text: `🛒 เพิ่ม "${itemName}" ลงตะกร้าแล้ว!\nยอดรวมตอนนี้: ${cart.total} บาท\n\nพิมพ์ "ชำระเงิน" เพื่อดูสรุปยอดและโอนเงินครับ` 
          }
        ]
      });
    }
  }

  // Handle text messages
  if (event.type === 'message' && event.message.type === 'text') {
    const text = event.message.text.trim();

    if (text === 'เมนู' || text === 'สินค้า') {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [createProductCatalog(baseUrl)]
      });
    }

    if (text === 'ชำระเงิน' || text === 'ตะกร้า') {
      const cart = userCarts.get(userId);
      if (!cart || cart.total === 0) {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: 'ตะกร้าสินค้าของคุณยังว่างเปล่าครับ พิมพ์ "เมนู" เพื่อเลือกซื้อสินค้าได้เลยครับ 🚜' }]
        });
      }

      const summary = cart.items.map((it, idx) => `${idx + 1}. ${it}`).join('\n');
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: `📝 สรุปรายการสั่งซื้อ:\n${summary}\n\n💰 ยอดชำระทั้งหมด: ${cart.total} บาท\n\n🏦 ธนาคารกสิกรไทย\nเลขที่บัญชี: 123-4-56789-0\nชื่อบัญชี: บจก. CRD Tractor Parts\n\n📸 **เมื่อโอนเงินแล้ว กรุณาส่งรูปสลิปเข้ามาในแชทนี้ได้เลยครับ ระบบ AI ของเราจะทำการตรวจสอบทันที!**`
          }
        ]
      });
    }

    if (text === 'ช่วยเหลือ') {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: 'ต้องการความช่วยเหลือด้านไหนครับ? 🚜\n\n1. ดูสินค้า (Flex): พิมพ์ "เมนู"\n2. สั่งซื้อผ่านเว็บ (LIFF): กดปุ่ม 🌐 สั่งซื้อผ่านเว็บ\n3. ปรึกษาช่าง: พิมพ์คำว่า "ถาม" นำหน้าคำถาม\n4. ติดต่อแอดมิน: พิมพ์ "ติดต่อ"',
            quickReply: {
              items: [
                {
                  type: 'action',
                  action: {
                    type: 'uri',
                    label: '🌐 สั่งซื้อผ่านเว็บ',
                    uri: 'https://liff.line.me/2011006005-b85CrMdl'
                  }
                }
              ]
            }
          }
        ]
      });
    }

    if (text === 'ติดต่อ' || text === 'ติดต่อพนักงาน' || text === 'ติดต่อร้าน') {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: 'สอบถามอะไหล่ รายละเอียดด้านล่าง 👇\n☎️ 097-474-9944\nLINE id : 0974749944\nหน้าร้านอยู่เซียงกงรังสิต(ศูนย์เก่า)\nเปิด 08.00-17.30 น. ปิดวันอาทิตย์ โทร. 097-474-9944/086-334-9491\n\nGoogle Maps : https://maps.app.goo.gl/hBXy2tYEZymnv8AJ9?g_st=ipc\nfacebook : https://www.facebook.com/crdtractor/'
          }
        ]
      });
    }

    // Use Gemini if text starts with "ถาม"
    if (text.startsWith('ถาม') && process.env.GEMINI_API_KEY) {
      const question = text.substring(3).trim(); // Remove "ถาม" from the beginning
      if (question.length === 0) {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: 'พิมพ์คำถามต่อท้ายคำว่า "ถาม" ได้เลยครับ เช่น "ถาม มีอะไหล่ช่วงล่างไหม"' }]
        });
      }
      
      await showAiLoading(client, userId);
      const answer = await askGemini(userId, question);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: answer }]
      });
    }
    
    // If it doesn't match any command and doesn't start with "ถาม", do nothing.
    // This allows the human admin to jump in and chat with the customer seamlessly.
    return Promise.resolve(null);
  }

  // Handle Image messages (Slip Verification)
  if (event.type === 'message' && event.message.type === 'image') {
    const cart = userCarts.get(userId);
    
    // ถ้าไม่มีตะกร้า ก็ไม่ต้องตรวจ ปล่อยผ่านให้คนตอบ
    if (!cart || cart.total === 0) {
      return Promise.resolve(null);
    }

    await showAiLoading(client, userId);
    
    try {
      // 1. ดึงภาพจาก LINE
      const stream = await client.getMessageContent(event.message.id);
      const imageBuffer = await streamToBuffer(stream);

      // 2. ส่งให้ Gemini Vision ตรวจ
      const aiResponse = await verifySlip(imageBuffer, cart.total);

      // 3. เคลียร์ตะกร้าถ้าสำเร็จ (เช็คคำว่า ยืนยัน)
      if (aiResponse.includes('✅')) {
        userCarts.delete(userId);
        
        // ส่ง Push Notification แจ้งเตือนแอดมินทันทีที่มีออเดอร์ใหม่และโอนเงินแล้ว
        try {
          await client.pushMessage('U9113d402b5b45ffb3f45ec48ad14440a', {
            type: 'text',
            text: `🔔 มีออเดอร์ใหม่และชำระเงินเรียบร้อยแล้ว!\nยอดรวม: ${cart.total} บาท\nจากลูกค้า ID: ${userId}`
          });
        } catch (pushErr) {
          console.error('Failed to notify admin', pushErr);
        }

        // แจ้งเตือนลูกค้า
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [
            { type: 'text', text: aiResponse },
            { type: 'text', text: '🔔 แอดมินได้รับแจ้งเตือนออเดอร์ของคุณเรียบร้อยแล้ว เราจะรีบจัดส่งให้เร็วที่สุดครับ ขอบคุณที่ใช้บริการ CRD Tractor Parts 🚜' }
          ]
        });
      } else {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: aiResponse }]
        });
      }

    } catch (err) {
      console.error('Slip Verify Error', err);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: 'เกิดข้อผิดพลาดในการโหลดรูปภาพ กรุณารอแอดมินมาตรวจสอบสักครู่นะครับ' }]
      });
    }
  }

  return null;
}
