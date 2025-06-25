import { config } from 'dotenv';
import { INSERT } from 'sequelize/lib/query-types';
import { text } from 'stream/consumers';
import { Markup, Telegraf, Context } from 'telegraf';
import { configDotenv } from 'dotenv';
import database from './db/postgresql/connection';

configDotenv();
const bot = new Telegraf(process.env.TOKEN as string);
const ADMIN_ID = parseInt(process.env.ID!); // Конвертируем в число

// Типы сообщений для базы данных
type MessageType = 'text' | 'photo' | 'document' | 'video' | 'audio' | 'voice' | 'sticker' | 'animation' | 'video_note' | 'location' | 'contact' | 'poll' | 'dice' | 'game' | 'invoice' | 'successful_payment' | 'passport_data' | 'web_app_data' | 'unknown';

// Функция определения типа сообщения
function getMessageType(message: any): { type: MessageType, file_id?: string, content?: string } {
  if (message.text) return { type: 'text', content: message.text };
  if (message.photo) return { type: 'photo', file_id: message.photo[message.photo.length - 1].file_id };
  if (message.document) return { type: 'document', file_id: message.document.file_id, content: message.caption };
  if (message.video) return { type: 'video', file_id: message.video.file_id, content: message.caption };
  if (message.audio) return { type: 'audio', file_id: message.audio.file_id, content: message.caption };
  if (message.voice) return { type: 'voice', file_id: message.voice.file_id };
  if (message.sticker) return { type: 'sticker', file_id: message.sticker.file_id };
  if (message.animation) return { type: 'animation', file_id: message.animation.file_id, content: message.caption };
  if (message.video_note) return { type: 'video_note', file_id: message.video_note.file_id };
  if (message.location) return { type: 'location', content: `Широта: ${message.location.latitude}, Долгота: ${message.location.longitude}` };
  if (message.contact) return { type: 'contact', content: `Имя: ${message.contact.first_name} ${message.contact.last_name || ''}, Телефон: ${message.contact.phone_number}` };
  if (message.poll) return { type: 'poll', content: `Вопрос: ${message.poll.question}, Варианты: ${message.poll.options.map((o: any) => o.text).join(', ')}` };
  if (message.dice) return { type: 'dice', content: `Тип кубика: ${message.dice.emoji}, Значение: ${message.dice.value}` };
  if (message.game) return { type: 'game', content: `Название игры: ${message.game.title}` };
  if (message.invoice) return { type: 'invoice', content: `Название товара: ${message.invoice.title}, Описание: ${message.invoice.description}` };
  if (message.successful_payment) return { type: 'successful_payment', content: `Сумма: ${message.successful_payment.total_amount / 100} ${message.successful_payment.currency}` };
  if (message.passport_data) return { type: 'passport_data', content: 'Получены данные паспорта' };
  if (message.web_app_data) return { type: 'web_app_data', content: `Данные из веб-приложения: ${message.web_app_data.data}` };
  return { type: 'unknown' };
}

// Обработка сообщений от пользователей


// Обработка нажатий на кнопку "Ответить"
bot.action(/^answer:(\d+)$/, async (ctx) => {
  try {
    const userId = ctx.match[1];
    const cobfig = await database('telegram_my_security', `SELECT * FROM config`)
    const config = cobfig.rows[0]
    if (!config) {
      await database('telegram_my_security', `INSERT INTO config (answer_id) VALUES (${userId})`)

    } else if (config) {
      await database('telegram_my_security', `DELETE FROM config`)
      await database('telegram_my_security', `INSERT INTO config (answer_id) VALUES (${userId})`)
    }
    // Проверяем, что действие инициировал администратор
    if (ctx.from?.id !== ADMIN_ID) {
      return ctx.answerCbQuery('❌ Только администратор может отвечать');
    } ''
    // Отправляем подтверждение администратору
    await ctx.editMessageText(
      ctx.callbackQuery.message?.text + '\n\n🟢 Ожидаю ваше сообщение для пользователя...',
      { reply_markup: null }
    );

    ctx.answerCbQuery('Теперь отправьте сообщение для пользователя');

  } catch (error) {
    console.error('Ошибка при подготовке ответа:', error);
    ctx.answerCbQuery('❌ Ошибка при подготовке ответа');
  }
});

// Обработка сообщений от администратора (ответы пользователям)
bot.on('message', async (ctx: Context) => {

  // Проверяем активный запрос на ответ
  const config = await database('telegram_my_security', `SELECT * FROM config `)
  const userId = config.rows[0].answer_id
  console.log(userId)
  const messageInfo = getMessageType(ctx.message);
  if (userId && ctx?.from.id === ADMIN_ID) {
    if (messageInfo.type === 'text' && messageInfo.content) {
      await ctx.telegram.sendMessage(userId, `📨 Сообщение от администратора:\n\n${messageInfo.content}`);
    }
    else if (messageInfo.file_id) {
      const caption = `📨 От администратора:\n${messageInfo.content || ''}`;

      switch (messageInfo.type) {
        case 'photo':
          await ctx.telegram.sendPhoto(userId, messageInfo.file_id, { caption });
          break;
        case 'document':
          await ctx.telegram.sendDocument(userId, messageInfo.file_id, { caption });
          break;
        case 'video':
          await ctx.telegram.sendVideo(userId, messageInfo.file_id, { caption });
          break;
        case 'audio':
          await ctx.telegram.sendAudio(userId, messageInfo.file_id, { caption });
          break;
        case 'voice':
          await ctx.telegram.sendVoice(userId, messageInfo.file_id, { caption });
          break;
        case 'animation':
          await ctx.telegram.sendAnimation(userId, messageInfo.file_id, { caption });
          break;
      }
    }

    // Удаляем запрос после успешной отправки
    await database('telegram_my_security', `DELETE FROM config`)

    return ctx.reply('✅ Сообщение успешно отправлено пользователю!');
  } else if (!ADMIN_ID) {
    // Пропускаем сообщения от администратора

    try {
      if (ctx.message?.text == '/start') {
        return ctx.replyWithHTML(`${ctx.from.first_name} ${ctx.from.last_name || ''}, вы тут сможете задать вопрос <b>@RestlessByte</b>!
    <i>Просто напишите в этом чате и ожидайте ответа!
    ❗<b>Строго общаюсь только так, никакого личного чата. Личный чат только для своих</b></i>`)
      }
      const messageInfo = getMessageType(ctx.message);

      // Формируем сообщение для администратора
      let adminMessage = `👤 Пользователь: ${ctx.from?.username ? `@${ctx.from.username}` : 'Без имени'}\n`;
      adminMessage += `🆔 ID: ${ctx.from?.id}\n`;
      adminMessage += `👤 Имя: ${ctx.from?.first_name} ${ctx.from?.last_name || ''}\n`;
      adminMessage += `🌐 Язык: ${ctx.from?.language_code || 'не указан'}\n`;
      adminMessage += `🌀 PREMIUM: ${ctx.from?.is_premium ? '✔️' : `❌`}\n`
      adminMessage += `🤖 BOT: ${ctx.from?.is_bot ? '✔️' : `❌`}\n`
      adminMessage += `📨 Тип сообщения: ${messageInfo.type}\n`;

      if (messageInfo.content) {
        adminMessage += `📝 Содержание: ${messageInfo.content.substring(0, 200)}${messageInfo.content.length > 200 ? '...' : ''}`;
      }

      // Отправка информации администратору
      await ctx.telegram.sendMessage(
        ADMIN_ID,
        adminMessage,
        Markup.inlineKeyboard([
          Markup.button.callback(
            `✉️ Ответить ${ctx.from?.username ? `@${ctx.from.username}` : ''}`,
            `answer:${ctx.from?.id}`
          )
        ])
      );

      // Отправка вложений администратору
      const sendOptions = {
        caption: `От: ${ctx.from?.username ? `@${ctx.from.username}` : 'пользователя'}\n${messageInfo.content || ''}`
      };

      if (messageInfo.type === 'photo' && messageInfo.file_id) {
        await ctx.telegram.sendPhoto(ADMIN_ID, messageInfo.file_id, sendOptions);
      } else if (messageInfo.type === 'document' && messageInfo.file_id) {
        await ctx.telegram.sendDocument(ADMIN_ID, messageInfo.file_id, sendOptions);
      } else if (messageInfo.type === 'video' && messageInfo.file_id) {
        await ctx.telegram.sendVideo(ADMIN_ID, messageInfo.file_id, sendOptions);
      } else if (messageInfo.type === 'audio' && messageInfo.file_id) {
        await ctx.telegram.sendAudio(ADMIN_ID, messageInfo.file_id, sendOptions);
      } else if (messageInfo.type === 'voice' && messageInfo.file_id) {
        await ctx.telegram.sendVoice(ADMIN_ID, messageInfo.file_id, sendOptions);
      } else if (messageInfo.type === 'sticker' && messageInfo.file_id) {
        await ctx.telegram.sendSticker(ADMIN_ID, messageInfo.file_id);
      } else if (messageInfo.type === 'animation' && messageInfo.file_id) {
        await ctx.telegram.sendAnimation(ADMIN_ID, messageInfo.file_id, sendOptions);
      }

      // Сохранение в базу данных
      await database('telegram_my_security', `
      INSERT INTO chat (user_id, text, type, file_id, first_name, last_name, language_code) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
        ctx.from?.id,
        messageInfo.content || null,
        messageInfo.type,
        messageInfo.file_id || null,
        ctx.from?.first_name,
        ctx.from?.last_name || null,
        ctx.from?.language_code || null
      ]);

      // Ответ пользователю
      ctx.reply('✅ Ваше сообщение было отправлено администратору. Пожалуйста, ожидайте ответа.');

    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
      ctx.reply('❌ Произошла ошибка при обработке вашего сообщения. Пожалуйста, попробуйте позже.');
    }
  }
});
// Запуск бота
bot.launch(() => {
  console.log('🚀 Бот запущен');
  bot.telegram.sendMessage(ADMIN_ID, '🤖 Бот успешно запущен и готов к работе!');
});

// Обработка ошибок
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));