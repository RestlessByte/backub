import { VK, API, Keyboard } from 'vk-io';
import { config } from 'dotenv'
config()
const vk = new VK({
  token: process.env.vk_token as string,
  pollingGroupId: Number(process.env.vk_pollingGroupId)
});

vk.updates.on('message_new', async (ctx) => {
  if (ctx.text === '/start') {
    await ctx.reply(`🔥 Привет! Ты находишься в ByteMind AI Hub - сервис, где ты можешь где угодно и когда угодно общаться с мощными нейросетям, генерируя код и тексты!
    🌀 Если ты ещё не зарегистрирован в нашем сервисе => нажми '🔑 Зарегистрироваться' , а если ты уже зарегистрирован у меня на других платформах => нажми '🧷 Ввести код'`,
      Keyboard.keyboard([
        [
          Keyboard.textButton({
            label: '🔑 Зарегистрироваться',
            color: Keyboard.POSITIVE_COLOR
          }),
          Keyboard.textButton({
            label: '🧷 Ввести код',
            color: Keyboard.POSITIVE_COLOR
          })
        ]
      ]));
  }
});

vk.updates.start().catch(console.error);
