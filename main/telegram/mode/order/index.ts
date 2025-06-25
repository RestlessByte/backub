import { Telegraf } from "telegraf";

export const TelegramFunOrder = (bot: Telegraf) => {
  bot.action('order', async (ctx) => {
    // Логика для заказа услуг
  });
} 