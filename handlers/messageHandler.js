import { createProductCatalog } from '../messages/flexMenu.js';
import { createQuotationFlex } from '../messages/quotationFlex.js';
import { createVipCardFlex } from '../messages/vipFlex.js';
import { createTrackingFlex } from '../messages/trackingFlex.js';
import { askGemini, processAudio } from '../services/geminiService.js';
import { userCarts, userPoints, userOrders, pendingSlips, adminId, setAdminId } from '../store.js';
import fs from 'fs';
import path from 'path';

// Helper สำหรับแปลงข้อมูลจาก LINE เป็น Buffer (รองรับทั้ง Blob และ Stream)
async function toBuffer(data) {
  if (Buffer.isBuffer(data)) return data;
  if (data.arrayBuffer) {
    const arrayBuf = await data.arrayBuffer();
    return Buffer.from(arrayBuf);
  }
  const chunks = [];
  for await (const chunk of data) {
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

export async function handleEvent(client, blobClient, event, baseUrl) {
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

    if (action === 'approve_slip') {
      const customerId = data.get('userId');
      if (userId !== adminId) return Promise.resolve(null);
      
      const cart = userCarts.get(customerId);
      if (cart) {
      const currentData = userPoints.get(customerId) || { points: 0, tier: 'BRONZE' };
        currentData.points += Math.floor(cart.total / 100);
        if (currentData.points >= 50) currentData.tier = 'GOLD';
        else if (currentData.points >= 20) currentData.tier = 'SILVER';
        userPoints.set(customerId, currentData);
      }
      
      userCarts.delete(customerId); // Clear cart

      // แจ้งลูกค้า
      await client.pushMessage(customerId, {
        messages: [{
          type: 'text',
          text: '✅ [การแจ้งเตือนจากระบบ]\nแอดมินตรวจสอบและยืนยันสลิปของคุณเรียบร้อยแล้ว!\nคุณได้รับแต้มสะสมเพิ่ม พิมพ์ "เช็คแต้ม" เพื่อดูสถานะ VIP ของคุณได้เลย\n\nออเดอร์ของคุณกำลังถูกจัดเตรียม ขอบคุณที่ใช้บริการครับ 🚜'
        }]
      });

      // ตอบกลับแอดมิน
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: `✅ อนุมัติสลิปของลูกค้าสำเร็จแล้ว` }]
      });
    }

    if (action === 'reject_slip') {
      const customerId = data.get('userId');
      if (userId !== adminId) return Promise.resolve(null);
      
      // แจ้งลูกค้า
      await client.pushMessage(customerId, {
        type: 'text',
        text: '❌ [การแจ้งเตือนจากระบบ]\nสลิปของคุณไม่ถูกต้อง หรือยอดเงินไม่ตรงตามที่กำหนด\n\nกรุณาตรวจสอบและส่งรูปสลิปเข้ามาใหม่อีกครั้งนะครับ'
      });

      // ตอบกลับแอดมิน
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: `❌ ปฏิเสธสลิปของลูกค้าแล้ว` }]
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

    // เมื่อลูกค้ากดชำระเงินจาก LIFF ระบบจะส่งข้อความเข้าแชท เราจะจับข้อความนี้เพื่อสร้างตะกร้ารอตรวจสลิป
    if (text.startsWith('🛒 บันทึกคำสั่งซื้อจาก LIFF')) {
      const match = text.match(/ยอดรวม:\s*(\d+)/);
      if (match) {
        const total = parseInt(match[1], 10);
        userCarts.set(userId, { total, items: [] });
      }
      return Promise.resolve(null); // ไม่ต้องตอบกลับ ให้ลูกค้าแนบสลิปต่อเลย
    }

    if (text === 'ขอใบเสนอราคา') {
      const cart = userCarts.get(userId);
      if (!cart || cart.total === 0) {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: 'คุณยังไม่ได้เลือกสินค้าครับ กรุณาหยิบสินค้าลงตะกร้าก่อนขอใบเสนอราคาครับ 🚜' }]
        });
      }
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [createQuotationFlex(cart)]
      });
    }

    if (text === 'เช็คแต้ม') {
      const data = userPoints.get(userId) || { points: 0, tier: 'BRONZE' };
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [createVipCardFlex(data.points, data.tier)]
      });
    }

    if (text === 'ติดตามพัสดุ') {
      const order = userOrders.get(userId);
      if (!order || !order.trackingNo) {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: 'คุณยังไม่มีพัสดุที่กำลังจัดส่งในขณะนี้ครับ 🚜' }]
        });
      }
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [createTrackingFlex(order.trackingNo)]
      });
    }

    // Admin God Mode Commands
    if (text === '/admin') {
      setAdminId(userId);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: `👑 [SYSTEM] ตั้งค่าบัญชีของคุณเป็น ADMIN เรียบร้อยแล้ว! (ID: ${userId})\n\nคุณจะได้รับการแจ้งเตือนสลิปโอนเงินทั้งหมดนับจากนี้ครับ` }]
      });
    }

    if (userId === adminId && text.startsWith('/')) {
      if (text === '/status') {
        const activeUsers = userCarts.size;
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: `🛠️ [ADMIN GOD MODE]\n\n🟢 System: ONLINE\n🛒 Active Carts: ${activeUsers}\n🧠 AI Engine: Gemini 1.5 Flash` }]
        });
      }
      if (text.startsWith('/broadcast ')) {
        const msg = text.substring(11);
        try {
          await client.broadcast({
            messages: [{ type: 'text', text: `📢 ประกาศจากร้านค้า:\n\n${msg}` }]
          });
          return client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `📢 [BROADCAST SUCCESS]\nส่งข้อความ:\n"${msg}"\nไปยังผู้ใช้งานทุกคนจริงๆ เรียบร้อยแล้ว!` }]
          });
        } catch (err) {
          return client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `❌ Broadcast Failed: ${err.message}` }]
          });
        }
      }
      
      if (text.startsWith('/ship ')) {
        // format: /ship <userId> <trackingNo>
        const parts = text.split(' ');
        if (parts.length >= 3) {
          const targetId = parts[1];
          const trackingNo = parts.slice(2).join(' ');
          userOrders.set(targetId, { trackingNo });
          
          try {
            await client.pushMessage(targetId, {
              messages: [createTrackingFlex(trackingNo)]
            });
            return client.replyMessage({
              replyToken: event.replyToken,
              messages: [{ type: 'text', text: `✅ อัปเดตสถานะจัดส่งให้ลูกค้าเรียบร้อยแล้ว!` }]
            });
          } catch (err) {
            return client.replyMessage({
              replyToken: event.replyToken,
              messages: [{ type: 'text', text: `❌ ส่งแจ้งเตือนล้มเหลว: ${err.message}` }]
            });
          }
        }
      }
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

  // Handle Image messages (Manual Slip Verification)
  if (event.type === 'message' && event.message.type === 'image') {
    const cart = userCarts.get(userId);
    
    // ถ้าไม่มีตะกร้า ก็ไม่ต้องตรวจ ปล่อยผ่านให้คนตอบ
    if (!cart || cart.total === 0) {
      return Promise.resolve(null);
    }

    try {
      // Save image to disk for LIFF Admin Panel
      const slipFilename = `slip_${userId}_${Date.now()}.jpg`;
      const slipPath = path.join(process.cwd(), 'public', 'uploads', slipFilename);
      fs.writeFileSync(slipPath, imageBuffer);
      
      // Add to pending slips
      pendingSlips.set(userId, {
        total: cart.total,
        imageUrl: `/uploads/${slipFilename}`,
        timestamp: Date.now()
      });

      // 1. ตอบกลับลูกค้า
      await client.replyMessage({
        replyToken: event.replyToken,
        messages: [
          { type: 'text', text: '⏳ ได้รับหลักฐานการโอนเงินแล้ว กรุณารอแอดมินตรวจสอบสักครู่นะครับ' },
          { type: 'text', text: 'ℹ️ แอดมินสามารถตรวจสอบสลิปและจัดการออเดอร์ได้ที่ระบบหลังบ้าน (Admin Dashboard) ผ่านเว็บ LIFF ครับ' }
        ]
      });

      // 2. ส่ง Push Notification แจ้งเตือนแอดมิน (God Mode / เผื่อขี้เกียจเปิดเว็บ)
      await client.pushMessage(adminId, {
        type: 'flex',
        altText: '🔔 มีลูกค้าแจ้งโอนเงิน (รอตรวจสอบ)',
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            spacing: 'md',
            contents: [
              { type: 'text', text: '🔔 รอตรวจสอบสลิป', weight: 'bold', size: 'xl', color: '#1DB446' },
              { type: 'text', text: `ยอดรวมที่ต้องชำระ: ${cart.total} บาท\nรหัสลูกค้า: ${userId}`, wrap: true },
              { type: 'text', text: 'รบกวนแอดมินดูรูปสลิปที่ลูกค้าส่งมา แล้วกดยืนยันด้านล่างนี้ครับ', size: 'sm', color: '#888888', wrap: true }
            ]
          },
          footer: {
            type: 'box',
            layout: 'horizontal',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#1DB446',
                action: { type: 'postback', label: '✅ อนุมัติ', data: `action=approve_slip&userId=${userId}` }
              },
              {
                type: 'button',
                style: 'primary',
                color: '#d32f2f',
                action: { type: 'postback', label: '❌ ปฏิเสธ', data: `action=reject_slip&userId=${userId}` }
              }
            ]
          }
        }
      });
      return Promise.resolve(null);
    } catch (err) {
      console.error('Slip Notify Error', err);
    }
  }

  // Handle Audio messages (AI Voice Order/Consultation)
  if (event.type === 'message' && event.message.type === 'audio') {
    await showAiLoading(client, userId);
    try {
      const blob = await blobClient.getMessageContent(event.message.id);
      const audioBuffer = await toBuffer(blob);
      const aiResponse = await processAudio(userId, audioBuffer);
      
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: aiResponse }]
      });
    } catch (err) {
      console.error('Audio Process Error', err);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: 'ขออภัยครับ ระบบประมวลผลเสียงขัดข้อง กรุณาพิมพ์ข้อความแทนนะครับ' }]
      });
    }
  }

  return null;
}
