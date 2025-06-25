import { VK, Keyboard } from 'vk-io'
import { usingMistral } from '/home/localhost/main/telegram/hub/usingAI/mistral/index'
import { configDotenv } from 'dotenv'
configDotenv()
const vk = new VK({
  token: process.env.VK_TOKEN as string,
  pollingGroupId: process.env.VK_POLLING_GROUP_ID as number | undefined,
  apiMode: 'parallel',
})
vk.updates.on('message_new', async (context) => {
  await vk.api.messages.send(await usingMistral(context.text as string, `Ты интегрирован в группу в социальной сети ВКонтакте. Функционал для ВКонтакте разрабатывается, но пока что целый функционал находится в Telegram - https://t.me/ByteMindAiHub_bot. Пока что отвечай на все просьбы данного пользователя`))

})
vk.updates.startPolling()