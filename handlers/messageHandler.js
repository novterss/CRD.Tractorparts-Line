import { createProductCatalog } from '../messages/flexMenu.js';
import { askGemini } from '../services/geminiService.js';

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

    if (text === 'ช่วยเหลือ') {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: 'ต้องการความช่วยเหลือด้านไหนครับ? 🚜\n\n1. ดูสินค้า: พิมพ์ "เมนู"\n2. ปรึกษาปัญหาเครื่องจักร: พิมพ์คำว่า "ถาม" นำหน้าคำถาม (เช่น "ถาม รถขุดตีนตะขาบหลุด ทำไงดี?")\n3. ติดต่อพนักงาน: พิมพ์ "ติดต่อ"'
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

  return null;
}
