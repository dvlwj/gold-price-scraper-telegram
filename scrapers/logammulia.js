// https://logammulia.com

import axios from 'axios';
import { load } from 'cheerio';
import puppeteer from "puppeteer-core";
import dayjs from 'dayjs';

const URL = "https://www.logammulia.com/id/harga-emas-hari-ini";

export const fetchLogamMulia = async (telegramToken, telegramChannelId, isProductionEnvironment) => {
  try {
    await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      chat_id: `${telegramChannelId}`,
      text: `Running task to scraping gold price list from logammulia.com at ${dayjs().format('DD MMMM YYYY HH:mm:ss')}`
    });
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

    try {
      await page.goto(URL, {
          waitUntil: "networkidle2",
          timeout: 60000
      });
      await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        chat_id: `${telegramChannelId}`,
        text: `Successfully fetched data from ${URL}. Parsing data now.`
      });
    } catch (error) {
      console.error('An error occurred', error);
      await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        chat_id: `${telegramChannelId}`,
        text: `An error occurred while fetching data from ${URL}. Please check the logs for more information. &#10;<code>Error: ${error}</code>`,
        parse_mode: 'HTML'
      });
    }

    const pageContent = await page.content();
    await browser.close();

    const goldPrices = [];
    let currentCategory = ""

    // parsing base on pageContent
    const $ = load(pageContent);
    $(".table.table-bordered tbody tr").each((_, row) => {
      const thElement = $(row).find("th[colspan]");
      if (thElement.length > 0) {
        currentCategory = thElement.text().trim();
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
    let message = "";
    let lastCategory = "";

    goldPrices.forEach((item) => {
      if (item.title) {
        message += `&#10;<b>${item.title}</b>&#10;`;
        lastCategory = item.title;
      } else {
        if (lastCategory !== item.category) {
          message += `&#10;`;
          lastCategory = item.category;
        }
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
    await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      chat_id: `${telegramChannelId}`,
      text: `An error occurred while fetching data from ${URL}. Please check the logs for more information. &#10;<code>Error: ${error}</code>`,
      parse_mode: 'HTML'
    });
  }
};
