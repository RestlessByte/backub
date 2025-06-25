import { Telegraf } from "telegraf";

export const TelegramFunBots = (bot: Telegraf) => {
  bot.action('bots', async (ctx) => {
    // Логика для списка ботов
  });
} 