import { Markup, Telegraf } from "telegraf";
import { database } from "../../../db/connect";
import { mainMenu, TelegramCheckUser } from "../..";

export const TelegramGameMod = async (bot: Telegraf) => {

  bot.action('fun_🎮', async (ctx) => {
    const db = await database('games', 'SELECT * from users WHERE user_id = $1', [ctx.from.id])
    const user = await database('telegram', 'SELECT * FROM users WHERE user_id = $1', [ctx.from.id])
    if (!db.rows[0]) {
      return ctx.reply(user ? `[🎮]${ctx.from.first_name}, видим у вас есть аккаунт на нашем сервере, но для того, чтобы взаимодействовать с игровым режимом нужно зарегистрироваться на нашем игровом режими - просто жми "🎮 Зарегистрироваться"` : `[🎮] ${ctx.from.first_name}, у вас нету игрового аккаунта на нашем сервере.\n[✔️] Чтобы взаимодействовать с игровым режимом просто нажми "🎮 Зарегистрироваться"`, Markup.inlineKeyboard([Markup.button.callback('🎮 Зарегистрироваться', 'game_mode_registration')]))
    }
    return ctx.reply(`${(await TelegramCheckUser(ctx)).username ? (await TelegramCheckUser(ctx)).username : ctx.from.first_name}, ваш игровой профиль:
  💯 Уровень игрока: `)
  })
  bot.action('game_mode_registration', async (ctx) => {
    await database('games', 'INSERT INTO users (user_id) VALUES ($1)', [ctx.from.id])
    return ctx.reply(`${ctx.from.first_name}, вы успешно зарегистрированы в игровом режиме.
    [💠] Вы можете играть во всех наших сервисах, где используется игровой режим - [РАЗРАБОТКА СИСТЕМЫ]`, Markup.inlineKeyboard([[Markup.button.callback('🎮 Игровой профиль', '')], mainMenu]))
  })
}