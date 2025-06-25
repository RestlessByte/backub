import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { usingOpenAI } from './ai/core/ai';
import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { EnumNamesProducts } from './telegram/game/namesProducts';
import { HTMLTagsTelegram } from './telegram/hub/usingAI/systemContext';

config(); // Инициализация переменных окружения

const bot = new Telegraf(process.env.TOKEN!);

interface ReportBugProps {
  message: string | unknown;
  product: EnumNamesProducts;
}

export const ReportBug = async (props: ReportBugProps): Promise<void> => {
  try {
    // Генерация сообщения об ошибке через AI
    const aiResponse = await usingOpenAI({
      user_prompt: `
        Сообщение: ${props.message}
        Код: Сам выяви`,
      system_prompt: `
        Твоя задача - кратко и точно описать обнаруженную ошибку для команды разработки.
        Укажи: 
        1. Суть проблемы
        2. Возможную причину
        3. Контекст (страница/компонент)
        4. Предполагаемое решение
        Будь лаконичен!
        ГЛАВНОЕ ПРАВИЛО: не используй ** и остальные теги, кроме оформленгия текста строго по этим тегам - ${HTMLTagsTelegram}`,
      provider: 'MistralAI',
      model: 'mistral-large-latest'
    });

    const content = aiResponse.choices[0].message.content;
    const reportMessage = `🚨 Продукт: ${props.product}\n\n${content}`;

    // Отправка отчета в Telegram
    await bot.telegram.sendMessage(process.env.CHATID!, reportMessage, { parse_mode: 'HTML' });

  } catch (error: any) {
    console.error('Ошибка в ReportBug:', error);

    // Форматирование сообщения об ошибке
    const errorMessage = `
      ⚠️ Продукт: ${props.product}
      
      ОШИБКА В СИСТЕМЕ ОТЧЕТНОСТИ:
      ${error.code ? `Код: ${error.code}` : ''}
      Сообщение: ${error.message || 'Неизвестная ошибка'}
    `;

    // Попытка отправить информацию об ошибке
    try {
      await bot.telegram.sendMessage(process.env.CHATID!, errorMessage);
    } catch (telegramError) {
      console.error('Не удалось отправить в Telegram:', telegramError);
    }
  }
};

// Пример использования
ReportBug({
  message: 'Проверка работы системы отчетов: все функции работают штатно. Придумай какую нибудь ошибку..',
  product: EnumNamesProducts.telegramAIHubBot
});