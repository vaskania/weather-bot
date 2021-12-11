const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const getWeather = require('./forecast');
const logger = require('./logger');

const replyMarkup = {
  keyboard: [[{ text: 'Location', request_location: true }]],
  resize_keyboard: true,
  one_time_keyboard: true,
};

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.onText(/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Give me location', {
    reply_markup: replyMarkup,
  });
});

bot.on('location', async (msg) => {
  const { location } = msg;
  logger.info(
    `${msg.chat.first_name} share his location latitude:${location.latitude} longitude:${location.longitude}`,
  );
  try {
    const { city, temp, description } = await getWeather(location);
    bot.sendMessage(
      msg.chat.id,
      `Current weather in <code>${city}</code> is <b>${Math.floor(
        temp,
      )}</b> celsius and <pre>${description}</pre>`,
      { parse_mode: 'HTML' },
    );
  } catch (error) {
    bot.sendMessage(msg.chat.id, `${error}`, { reply_markup: replyMarkup });
  }
});
