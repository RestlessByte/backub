import { Telegraf } from "telegraf";

export const TelegramFunSupport = (bot: Telegraf) => {
  bot.action('support', async (ctx) => {
    // Логика для поддержки
  });
} 