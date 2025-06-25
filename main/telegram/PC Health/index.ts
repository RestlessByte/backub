import { Telegraf } from 'telegraf'
import { configDotenv } from "dotenv";
import { usingMistral } from '../hub/usingAI/mistral/index'
import { SystemPrompt } from './system_prompts';
configDotenv()
const bot = new Telegraf(process.env.TOKEN as string)
bot.on('message', async (ctx) => {
  const res = await usingMistral(SystemPrompt(), ctx.message.text)?.choices?.[0]?.message?.content
  return ctx.reply(`${res}`)
})
bot.launch(() => {
  console.log('Bot started')
})