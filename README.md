# Indonesia Gold Price List Scraper and Telegram Announcer

I know its a bad name, just doing this for side hobby and personal use to monitoring Indonesia's gold price in my personal telegram channel. Is a simple Node.js application that scrapes the latest gold prices and announces it daily via the Telegram API. It runs on a cron job to fetch the gold prices and sends the update to a specified Telegram channel or group.

## Features
- Scrapes the latest gold price from a website.
- Sends daily announcements to a Telegram channel/group using the Telegram API.
- Built with Node.js, Axios, Cheerio, and Puppeteer for web scraping.
- Scheduled to run daily using `node-cron`.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/indonesia-gold-telegram-announcement.git
   cd indonesia-gold-telegram-announcement
   npm install
  ```

2. Create a new Telegram bot and get the API token:

   - Open the Telegram app and search for the `BotFather` user.
   - Type `/newbot` and follow the instructions to create a new bot.
   - Copy the API token provided by the `BotFather`.

3. Create a new Telegram channel or group and add the bot as an administrator:

   - Create a new channel or group in the Telegram app.
   - Add the bot as an administrator with permission to post messages.

4. Create a `.env` file in the root directory and add the following environment variables:

  ```env
    TELEGRAM_API_TOKEN=your_telegram_api_token
    TELEGRAM_CHANNEL_ID=your_telegram_channel_id
    PORT=THE_PORT_YOU_WANT_TO_USE
    NODE_ENV=development || production
  ```

5. Run the application:

   ```bash
   npm start
   ```

## Usage

The application will run on the specified port and send daily gold price announcements to the Telegram channel/group. You can also run the application in the background using a process manager like `pm2`. Basically if app run on development mode its will send the message to the channel every 1 minute, but if its run on production mode its will send the message on 09:00 AM and 10:30 AM.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Node.js](https://nodejs.org/)
- [Axios](https://axios-http.com/)
- [Cheerio](https://cheerio.js.org/)
- [Puppeteer](https://pptr.dev/)
- [Telegram API](https://core.telegram.org/bots/api)
- [node-cron](https://www.npmjs.com/package/node-cron)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [pm2](https://pm2.keymetrics.io/)
- [express](https://expressjs.com/)
- [dayjs](https://day.js.org/)
- [nodemon](https://nodemon.io/)