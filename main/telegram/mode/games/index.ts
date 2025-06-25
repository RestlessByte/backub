import { Telegraf } from "telegraf";

export const TelegramFunGames = (bot: Telegraf) => {
  bot.action('games', async (ctx) => {
    // Логика для игр
  });
} 