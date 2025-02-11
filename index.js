import * as dotenv from 'dotenv';
import cron from 'node-cron';
import express from 'express';
import { fetchLogamMulia } from './scrapers/logammulia.js';
import dayjs from 'dayjs';
import axios from 'axios';

dotenv.config();
process.setMaxListeners(20);

// basic setup
const app = express();
const port = Number(process.env.PORT) || 5700;
const isProduction = process.env.NODE_ENV === 'production';
const cronSchedule = !isProduction ? '*/1 * * * *' : '0 9 * * *';

// telegram credentials
const token = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID;

cron.schedule(cronSchedule, async () => {
  if(!isProduction) {
    console.log(`Running task to scraping gold price list from logammulia.com at ${dayjs().format('DD MMMM YYYY HH:mm:ss')}`);
  }
  fetchLogamMulia(token, channelId, isProduction);
});

cron.schedule('0 10 * * *', async () => {
  if(!isProduction) {
    console.log(`Running task to scraping gold price list from logammulia.com at ${dayjs().format('DD MMMM YYYY HH:mm:ss')}`);
  }
  fetchLogamMulia(token, channelId, isProduction);
});

app.listen(port, async () => {
  const message = `Service is running at ${dayjs().format('DD MMMM YYYY HH:mm:ss')}`;
  console.log(`${message} on port ${port} in ${isProduction ? 'production' : 'development'} mode`);
  await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: `${channelId}`,
    text: `${isProduction ? '' : '<b>UJI COBA - HARAP ABAIKAN</b>&#10;&#10;'}${message}`,
    parse_mode: 'HTML'
  });

});

process.removeAllListeners();