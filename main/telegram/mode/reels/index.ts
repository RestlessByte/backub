import { Context, Telegraf, Markup } from "telegraf";
import axios from "axios";
import { database } from "../../../db/connect";
import { generateTextDeepSeek } from "../../../ai/deepSeekConnector";
import type { InlineKeyboardMarkup } from "typegram";
import { MyContext } from "../../types/context";

// Интерфейс для хранения данных сессии
interface SessionData {
  token?: string;
  avatarId?: string;
  text?: string;
  isPremium?: boolean;
  awaitingToken?: boolean;
  awaitingWriteText?: boolean;
  awaitingNewToken?: boolean;
  awaitingPhotoForAvatar?: boolean;
}

// Типы для API ответов
interface HeyGenAvatar {
  id: string;
  name: string;
}

interface HeyGenApiResponse {
  success: boolean;
  data: unknown;
  error?: string;
}

// Инициализация таблицы пользователей (если таблица ещё не создана)
const initUsersTable = async () => {
  try {
    await database(
      "hey_gen",
      `
      CREATE TABLE IF NOT EXISTS users (
        user_id BIGINT PRIMARY KEY,
        token TEXT,
        is_premium BOOLEAN DEFAULT false
      );
      `,
      []
    );
    console.log("Таблица users успешно инициализирована");
  } catch (error) {
    console.error("Ошибка инициализации таблицы users:", error);
  }
};

// Проверка наличия пользователя в БД
const checkUserInDB = async (ctx: MyContext): Promise<any> => {
  if (!ctx.from) {
    throw new Error("Пользователь не найден");
  }
  const dbResult = await database(
    "hey_gen",
    "SELECT * FROM users WHERE user_id = $1",
    [ctx.from.id]
  );
  return dbResult.rows[0];
};

// Сохранение или обновление токена пользователя
const saveUserToDB = async (ctx: MyContext, token: string) => {
  if (!ctx.from) {
    throw new Error("Пользователь не найден");
  }
  await database(
    "hey_gen",
    `INSERT INTO users (user_id, token) VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET token = $2`,
    [ctx.from.id, token]
  );
};

// Валидация ответа API HeyGen
const validateHeyGenResponse = (response: unknown): response is HeyGenApiResponse => {
  if (response === null || typeof response !== 'object') return false;
  return 'success' in response;
};

// Функция генерации текста с помощью нейросети DeepSeek R1
const generateTextWithAI = async (prompt: string): Promise<string> => {
  try {
    const text = await generateTextDeepSeek(prompt);
    return text;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Ошибка генерации текста с помощью AI:", errorMsg);
    return "Произошла ошибка при генерации текста. Попробуйте позже.";
  }
};

export const TelegramFunReels = (bot: Telegraf<MyContext>) => {
  // Инициализация таблицы при запуске режима
  initUsersTable();

  // Обработчик команды /start для вывода главного меню
  bot.start(async (ctx) => {
    try {
      const sentMessage = await ctx.reply(
        "Добро пожаловать в Reels меню!",
        Markup.inlineKeyboard([
          [Markup.button.callback("Сгенерировать Reels", "generateReels")],
          [Markup.button.callback("Настройки токена", "tokenSettings")],
          [Markup.button.callback("Купить подписку", "buyPremium")]
        ])
      );
      console.log("Отправлено стартовое сообщение:", sentMessage);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Ошибка обработки команды /start:", errorMsg);
    }
  });

  // Обработчик нажатия кнопки "ReelsMenu"
  bot.action("ReelsMenu", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const sentMessage = await ctx.reply(
        "Добро пожаловать в Reels меню!",
        Markup.inlineKeyboard([
          [Markup.button.callback("Сгенерировать Reels", "generateReels")],
          [Markup.button.callback("Настройки токена", "tokenSettings")],
          [Markup.button.callback("Купить подписку", "buyPremium")]
        ])
      );
      console.log("Отправлено сообщение с клавиатурой:", sentMessage);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Ошибка обработки ReelsMenu:", errorMsg);
    }
  });

  // Обработчик нажатия кнопки "generateReels"
  bot.action("generateReels", async (ctx) => {
    try {
      await ctx.reply("Функционал Reels пока не реализован.");
    } catch (error) {
      console.error("Ошибка в generateReels:", error);
    }
  });

  // Обработчик нажатия кнопки "buyPremium" для покупки подписки
  bot.action("buyPremium", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const paymentLink = `https://payment.example.com/pay?user=${ctx.from?.id}`;
      await ctx.reply(`Для приобретения подписки перейдите по ссылке:\n${paymentLink}\nПосле успешной оплаты подписка будет активирована.`);
    } catch (error) {
      console.error("Ошибка при попытке купить подписку:", error);
      await ctx.reply("Произошла ошибка. Попробуйте позже или обратитесь в поддержку.");
    }
  });

  // Обработчик нажатия кнопки "tokenSettings" для настройки токена
  bot.action("tokenSettings", async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.reply("Открытие настроек токена...");
    } catch (error) {
      console.error("Ошибка в обработчике tokenSettings:", error);
    }
  });

  // Глобальная обработка ошибок
  bot.catch(async (err, ctx) => {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Ошибка бота:", errorMsg);
    await ctx.reply("Произошла ошибка. Пожалуйста, попробуйте позже или обратитесь в поддержку.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Вернуться в главное меню", callback_data: "ReelsMenu" }]
        ]
      }
    });
  });
};