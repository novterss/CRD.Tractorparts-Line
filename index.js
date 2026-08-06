import 'dotenv/config';
import express from 'express';
import * as line from '@line/bot-sdk';
import { handleEvent } from './handlers/messageHandler.js';

const config = { channelSecret: process.env.CHANNEL_SECRET };
const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const app = express();

app.use('/public', express.static('public'));

app.get('/', (_req, res) => {
  res.send('CRD Tractor Parts Bot is running.');
});

app.post('/callback', line.middleware(config), async (req, res) => {
  try {
    const baseUrl = `https://${req.get('host')}`;
    const events = req.body.events;
    await Promise.all(events.map((event) => handleEvent(client, event, baseUrl)));
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
