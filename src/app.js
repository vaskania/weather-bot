const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const getWeather = require('./forecast');
const logger = require('./logger');

const reply_markup = {
  keyboard: [[{ text: 'Location', request_location: true }]],
  resize_keyboard: true,
  one_time_keyboard: true,
};

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.onText(/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Give me location', {
    reply_markup,
  });
});

bot.on('location', async (msg) => {
  logger.info(
    `${msg.chat.first_name} share his location latitude:${msg.location.latitude} longitude:${msg.location.longitude}`,
  );
  try {
    const { city, temp, description } = await getWeather(msg.location);
    bot.sendMessage(
      msg.chat.id,
      `Current weather in <code>${city}</code> is <b>${Math.floor(
        temp,
      )}</b> celsius and <pre>${description}</pre>`,
      { parse_mode: 'HTML' },
    );
  } catch (error) {
    bot.sendMessage(msg.chat.id, `${error}`, { reply_markup });
  }
});
