import { VK, Keyboard, KeyboardBuilder } from 'vk-io'
import { Telegraf } from 'telegraf'
import database from '../../../db/connection'
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram'
export const VkGame = new VK({
  token: process.env.VK_TOKEN as string,
  apiVersion: '5.131'
})
const TelegramGame = new Telegraf(process.env.TELEGRAM_GAME_BOT_TOKEN as string)

export const handler = async (command_handler?: number, keyboard?: InlineKeyboardMarkup | KeyboardBuilder, functions: () => void, SQL_QUERY: string, SQL_PARAMS: any[]) => {
  const fun = await database('telegram_game', SQL_QUERY, SQL_PARAMS)
  VkGame.updates.on('message_new', async (ctx) => {
    if (ctx?.message?.peer_id === command_handler) {
      functions(), keyboard
    }
  })
  TelegramGame.on('message', async (ctx) => {
    if (ctx?.message?.chat?.id === command_handler) {
      functions(), keyboard
    }
  })

  return {
    fun: fun,
    id: command_handler,
    functions: functions,
    keyboard: keyboard
  }
}
