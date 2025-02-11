// https://logammulia.com

import axios from 'axios';
import { load } from 'cheerio';
import puppeteer from "puppeteer-core";
import dayjs from 'dayjs';

const URL = "https://www.logammulia.com/id/harga-emas-hari-ini";

export const fetchLogamMulia = async (telegramToken, telegramChannelId, isProductionEnvironment) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--headless"
      ]
    });
    const page = await browser.newPage();

    // Scrap website using puppeteer
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");

    await page.goto(URL, {
        waitUntil: "networkidle2"
    });

    const pageContent = await page.content();
    await browser.close();

    const goldPrices = [];
    let currentCategory = ""

    // parsing base on pageContent
    const $ = load(pageContent);
    $(".table.table-bordered tbody tr").each((_, row) => {
      const columns = $(row).find("td")
      if (columns.length === 1) {
        currentCategory = columns.text().trim();
        goldPrices.push({ title: currentCategory });
      } else {
        const weight = $(row).find("td:nth-child(1)").text().trim();
        const price = $(row).find("td:nth-child(2)").text().trim();

        if (weight && price) {
          goldPrices.push({ weight, price, category: currentCategory });
        }
      }
    });

    // build message to send to telegram
    const title = `${isProductionEnvironment ? '' : '<b>UJI COBA - HARAP ABAIKAN</b>&#10;&#10;'}Harga Emas Logam Mulia Hari Ini. Hasil scraping dari https://logammulia.com pada ${dayjs().format('DD MMMM YYYY HH:mm:ss')}`;
    // const message = goldPrices.map((item) => `<b>${item.weight}</b> : Rp ${item.price}`).join("&#10;&#10;");
    // const messageToSend = `${title}&#10;&#10;${message}`;
    let message = "";
    let lastCategory = "";

    goldPrices.forEach((item) => {
      if (item.title) {
        message += `&#10;<b>${item.title}</b>&#10;`;
        lastCategory = item.title;
      } else {
        message += `<b>${item.weight}</b> : Rp ${item.price}&#10;`;
      }
    });
    
    const messageToSend = `${title}&#10;&#10;${message}`;


    await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      chat_id: `${telegramChannelId}`,
      text: `${messageToSend}`,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('An error occurred', error);
  }
};