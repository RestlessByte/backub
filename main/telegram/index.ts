import { configDotenv } from "dotenv";
import { Telegraf } from "telegraf";
import database from "./db/postgresql/connection";
import { usingMistral } from "./hub/usingAI/mistral";
import { callOpenAI } from "./game/api/api";
import { usingOpenAI } from "../ai/core/ai";
import { HTMLTagsTelegram } from "./hub/usingAI/systemContext";
configDotenv()
const bot = new Telegraf(process.env.TOKEN as string)

bot.start(async (ctx) => {

  const TechTheme = await database('main', `SELECT * FROM works`)
  let key = TechTheme.rows.map((item, index) => `
  ├ ${item.text}`)

  ctx.reply(`${ctx.from.first_name} ${ctx.from.last_name || ''}, вы тут можете заказать абсолютно всю работу:
    ${key}
    
    🧠 Нейросеть свяжет вас с разработчиком`)
})
bot.on("message", async (ctx) => {
  let typing = (boolean: boolean) => boolean ? ctx.sendChatAction('typing') : null
  typing(true)
  const TechTheme = await database('main', `SELECT * FROM works`)
  let key = TechTheme.rows.map((item, index) => `
  ├ ${item.text}`)
  let services = await database('main', `SELECT * FROM services`)
  let s = services.rows.map((item, index) => `
  Тип: ${item.category}
  Название товара: ${item.name}
  Цена товара: ${item.price} ₽`)
  const response = await usingOpenAI({
    user_prompt: `${ctx.message.text}`,
    system_prompt: `Привет. Ты помощник @reportRestlessByte_bot.
    Мы разбираемся исключительно по таким темам:
    ${key}
    Наши услуги: 
    ${s} - исключительно разбираемся в этих услугах и ничего более.
    ------
    Обращаться за услугой исключительно через чат бот @reportRestlessByte_bot.
    -
    Правило: Всё пиши  без каких либо тегов и **, кроме ${HTMLTagsTelegram} - все текста оформляй исключительно такими HTML тегами`,
    model: 'mistral-large-latest',
    provider: 'MistralAI',
    stream: false
  }).then(e => e)
  if (response.choices[0].message.content) { typing(false) }
  return ctx.reply(response.choices[0].message.content, { parse_mode: 'HTML' })
})
bot.launch()