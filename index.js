import 'dotenv/config';
import express from 'express';
import * as line from '@line/bot-sdk';
import { handleEvent } from './handlers/messageHandler.js';
import { userCarts, userPoints, userOrders, pendingSlips, adminId } from './store.js';

const config = { channelSecret: process.env.CHANNEL_SECRET };
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});
const blobClient = new line.messagingApi.MessagingApiBlobClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const app = express();

// Middleware
app.use(express.static('public'));

// --- Admin APIs ---
app.get('/api/admin/pending', (req, res) => {
  const slips = [];
  pendingSlips.forEach((data, userId) => {
    slips.push({ userId, ...data });
  });
  res.json(slips);
});

app.post('/api/admin/approve', express.json(), async (req, res) => {
  const { userId } = req.body;
  if (!pendingSlips.has(userId)) return res.status(404).json({ error: 'Not found' });
  
  const cart = userCarts.get(userId);
  if (cart) {
    const currentData = userPoints.get(userId) || { points: 0, tier: 'BRONZE' };
    currentData.points += Math.floor(cart.total / 100);
    if (currentData.points >= 50) currentData.tier = 'GOLD';
    else if (currentData.points >= 20) currentData.tier = 'SILVER';
    userPoints.set(userId, currentData);
  }
  
  userCarts.delete(userId);
  pendingSlips.delete(userId);

  try {
    await client.pushMessage(userId, {
      messages: [{
        type: 'text',
        text: '✅ [การแจ้งเตือนจากระบบ]\nแอดมินตรวจสอบและยืนยันสลิปของคุณผ่านระบบ Web Admin เรียบร้อยแล้ว!\nคุณได้รับแต้มสะสมเพิ่ม พิมพ์ "เช็คแต้ม" เพื่อดูสถานะ VIP ของคุณได้เลย\n\nออเดอร์ของคุณกำลังถูกจัดเตรียม ขอบคุณที่ใช้บริการครับ 🚜'
      }]
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/ship', express.json(), async (req, res) => {
  const { userId, trackingNo } = req.body;
  userOrders.set(userId, { trackingNo });
  
  // Need to import createTrackingFlex, but we can just send text for simplicity in index.js
  try {
    await client.pushMessage(userId, {
      messages: [{ type: 'text', text: `📦 ออเดอร์ของคุณได้รับการจัดส่งเรียบร้อยแล้ว!\nบริษัทขนส่ง: Kerry Express\nเลขพัสดุ: ${trackingNo}\n\nคุณสามารถพิมพ์ "ติดตามพัสดุ" เพื่อดูสถานะได้ตลอดเวลาครับ` }]
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------

app.get('/', (_req, res) => {
  res.send('CRD Tractor Parts Bot is running.');
});

app.post('/callback', line.middleware(config), async (req, res) => {
  try {
    const baseUrl = `https://${req.get('host')}`;
    const events = req.body.events;
    await Promise.all(events.map((event) => handleEvent(client, blobClient, event, baseUrl)));
    res.status(200).end();
  } catch (err) {
    console.error('Error processing event:', err);
    res.status(500).end();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CRD Tractor Parts Bot listening on http://localhost:${port}`);
});
