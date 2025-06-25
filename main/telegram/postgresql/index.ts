import { Markup, Telegraf } from "telegraf";
import { Pool } from "pg";
const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.on("message", async (ctx) => {
  const db = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT as string),
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  }).query(ctx.message.text).then((res) => {
    return res.rows
  })
  return ctx.reply(`Done! ${db}`)
});

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
