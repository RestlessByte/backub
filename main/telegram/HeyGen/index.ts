import { config } from 'dotenv';
import { Telegraf, Markup } from 'telegraf';
// Используем самописный API HEYGEN, реализованный через fetch
import database from './db/connection';

config();

// Самописный API HEYGEN, использующий fetch для взаимодействия с API
class HEYGEN {
  token: string;
  baseUrl: string;

  constructor(token: string) {
    this.token = token;
    // Базовый URL для запросов к API HEYGEN – при необходимости заменить на актуальный
    this.baseUrl = "https://api.heygen.com";
  }

  // Метод для работы с аватарами
  avatars = {
    list: async (): Promise<any[]> => {
      const response = await fetch(`${this.baseUrl}/avatars`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Ошибка при получении аватаров: ${response.statusText}`);
      }
      const data = await response.json();
      return data as any[];
    }
  };
}

const TELEGRAM_TOKEN = process.env.BOT_TOKEN;
if (!TELEGRAM_TOKEN) {
  throw new Error('"BOT_TOKEN" env var is required!');
}

// Функция для получения пользователя из БД
const getUser = async (userId: number) => {
  const res = await database('hey_gen', "SELECT * FROM users WHERE user_id = $1", [userId]);
  return res.rows[0];
};

// Функция для обновления данных пользователя в БД
const updateUser = async (userId: number, fields: object) => {
  const entries = Object.entries(fields);
  const setClause = entries
    .map(([key, _], index) => `${key} = $${index + 2}`)
    .join(', ');
  await database('hey_gen', `UPDATE users SET ${setClause} WHERE user_id = $1`, [
    userId,
    ...entries.map(([, value]) => value),
  ]);
};

// Обновленная функция buildMainMenu для использования токена из БД
const buildMainMenu = (user: any) => {
  if (!user.token) {
    // Если API токен не настроен, предлагаем его настроить
    return Markup.inlineKeyboard([
      [Markup.button.callback('🔑 Настроить токен', 'set_token')],
    ]);
  } else {
    // Если токен настроен, показываем полноценное меню с несколькими опциями
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('⚙️ Настройки', 'settings'),
        Markup.button.callback('🎬 Сгенерировать Reels', 'create_reels')
      ],
      [
        Markup.button.callback('🧑‍🦰 Создать аватар', 'choose_avatar'),
        Markup.button.callback('🎖️ Управление PREMIUM', 'manage_premium')
      ]
    ]);
  }
};

// Инициализация бота с использованием токена из .env
const bot = new Telegraf(TELEGRAM_TOKEN);

// Обработка команды /start
bot.start(async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  let user = await getUser(userId);
  if (!user) {
    // Новый пользователь: добавляем его в БД
    await database('hey_gen', "INSERT INTO users (user_id) VALUES ($1)", [userId]);
    user = await getUser(userId);
  }

  const welcomeMsg = user.token
    ? `С возвращением, ${ctx.from.first_name}!\nВыберите нужное действие:`
    : `Добро пожаловать, ${ctx.from.first_name}!\nПожалуйста, зарегистрируйтесь на сайте https://app.heygen.com/ и настройте ваш API токен.`;
  await ctx.reply(welcomeMsg, buildMainMenu(user));
});

// Обработка нажатия кнопки "Настроить токен"
bot.action('set_token', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  await updateUser(userId, { trigger_set_token: true });
  await ctx.reply('Пожалуйста, отправьте ваш API токен.');
});

// Обработка текстовых сообщений от пользователя
bot.on('text', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;
  let user = await getUser(userId);

  if (user.trigger_set_token) {
    // Сохраняем API токен в БД
    await updateUser(userId, { token: ctx.message.text, trigger_set_token: false });
    user = await getUser(userId);
    await ctx.reply('Токен сохранен! Выберите дальнейшее действие:', buildMainMenu(user));
  } else if (user.trigger_set_reels_text) {
    // Сохраняем текст для Reels
    await updateUser(userId, { reels_text: ctx.message.text, trigger_set_reels_text: false });
    await ctx.reply('Текст для Reels сохранен! Теперь выберите аватар для продолжения.', Markup.inlineKeyboard([
      [Markup.button.callback('🧑‍🦰 Выбрать аватар', 'choose_avatar')]
    ]));
  }
});

// Обработка нажатия кнопки "Сгенерировать Reels"
bot.action('create_reels', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  await updateUser(userId, { trigger_set_reels_text: true });
  await ctx.reply('Введите текст для вашего Reels:');
});

// Обработка нажатия кнопки "Создать аватар"
bot.action('choose_avatar', async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const user = await getUser(userId);
  if (!user.token) {
    await ctx.reply('Пожалуйста, сначала настройте ваш API токен.', Markup.inlineKeyboard([
      [Markup.button.callback('🔑 Настроить токен', 'set_token')]
    ]));
    return;
  }

  const heygenInstance = new HEYGEN(user.token);
  const avatars = await heygenInstance.avatars.list();
  // Гарантируем, что avatars представлено массивом
  const avatarArray = Array.isArray(avatars) ? avatars : [avatars];

  const avatarButtons = avatarArray.map((avatar: any) =>
    Markup.button.callback(avatar.avatar_name, `select_avatar_${avatar.avatar_id}`)
  );

  await ctx.reply('Выберите аватар:', Markup.inlineKeyboard(avatarButtons, { columns: 2 }));
});
