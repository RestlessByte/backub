import { Telegraf } from 'telegraf'

import { config, configDotenv } from 'dotenv'

import { usingMistral } from '../hub/usingAI/mistral/index'
import { tokens } from './tokens'
import database from './db/postgresql/connection'
import { HTMLTagsTelegram } from '../hub/usingAI/systemContext/index'
configDotenv()
const token = tokens.map((item: string, idx: number) => item) as any
const bot = new Telegraf(token as string)
const services = await database('main', `SELECT * FROM services`)
import { encryptedDataClient, decryptedDataClient } from '../../crypto/client'

bot.on('message', async (ctx) => {
    let off = false
    off ? null : ctx.sendChatAction('typing')
    const user = await database('aiwars', `SELECT id FROM users WHERE user_id = ${ctx.from.id}`)
    if (!user.rows[0]) {
        await database('aiwars', `INSERT INTO users (user_id) VALUES (${ctx.from.id})`)
    }
    const messages = await database('aiwars', `SELECT * FROM messages WHERE user_id = ${ctx.from.id}`)
    const API = async () => {
        const res = await usingMistral(`
           Клиент задал вопрос к тебе, текст: ${ctx.message.text}`, ` 
            Ты мой личный бизнес ассистент - мой ник @RestlessByte (не нужно всем говорить, что "я ваш личный помощник" - просто говори "Мы закрытая команда разработчиков под названием ByteMind. Чем мы занимаемся? - Автоматизируем проекты, бизнес задачи с помощью исскуственного интеллекста и нейросетей! А также мы активно развиваем свои пет проекты") и помогаешь мне во всем - общаешься сам с клиентом и закрываешь сделки! [Telegram]
            Наш уникальный чат бот на основе AI - @ByteMindAiHub_bot
            Наш игровой чат бот для развлечений и фарма игровых денег - @ByteMindGame_bot
            Обратная связь с нашим разработчиком: @reportRestlessByte_bot - общение строго через этого чат бота и не больше.
            Владелец [Главный разработчик] - @RestlessByte [Связь строго через чат бота @reportRestlessByte_bot]
            Данный чат бот может вам помочь с работой, учёбой и программированием! 
            Ещё наш чат бот для развлечения: Встречайте игровой чат бот с кнопками!
            Все сообщения с твоим клиентом [Умно адаптируйся к контексту самого клиента, чтобы ему комфортно было общаться с тобой]: ${messages.rows.map((m, i) => `
            Клиент написал тебе: ${m.res}
            Ты ответила ${m.req}
            Дата сообщения: ${m.timestamp}`)} 
            -
            ${HTMLTagsTelegram} - СТРОГО ВЕСЬ ТЕКСТ ФОРМАТИРУЙ КРОМЕ ССЫЛОК -- ССЫЛКИ ФОРМАТУ НЕ ПОДЛЕЖАТ, НЕ ФОРМАТИРУЙ ИХ ВООБЩЕ! - если ответ от клиента пришёл с форматированием = разформатируй его
            -
            ${services.rows.map((item: any, idx: number) => `
            Наш услуги: 
                Категория: ${item.category}
                Название: ${item.name}
                Описание: ${item.description} - онлайн или оффлайн переведи
                Цена за услугу: ${item.price} ₽ 
                `)} - Если у пользователя есть чаты, то АДАПТИРУЙСЯ
                Только весь текст не кидай клиенту - ты сначала опроси его и так далее = короче ты бизнес ассистент, пока разработчик занимается своими делами = ты закрываеш сделку
Все пиши без ### и *** и без каких либо форматирования!. Короче ты перефразируешь весь текст и пиаришь нашу продукцию в чате! Короче адаптируешься к каждому клиенту отдельно и адаптируешься к его монере общения
ОТВЕТ ОТ ТЕБЯ ДОЛЖЕН БЫТЬ КОРОТКИЙ - МАКСИМУМ 80 СЛОВ!
Сделай всё, чтобы клиенту было комфортно в общении, на лету всё не пиши - расспрашивай и потом пуляй нашу продукцию ему постепенно - не отпугивав его! Адаптируй максимально свой ответ под его манеру и предпочтения. Пиши кратко и чётко - а главное по теме!
`)
        if (res) {
            off = true
            return res.choices[0].message.content
        }
        off = false
    }


    const content = await API()
    await database('aiwars', `INSERT INTO messages (user_id, res, req) VALUES (${ctx.from.id}, '${ctx.text}', '${content}')`)

    bot.telegram.sendMessage(ctx.chat.id as number, `
            
           ${content} `, {
        parse_mode: 'HTML'
    })
})

bot.launch(() => {
    console.log(`Bot successefuly work`)
})