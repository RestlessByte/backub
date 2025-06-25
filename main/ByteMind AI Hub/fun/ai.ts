import database from '../../db/connection'
import { decryptedDataClient } from "../../crypto/client";

export const ByteMindAIHubUsingAI = async (user_id: number, prompt: string,) => {
  const userResult = await database('ai', 'SELECT * FROM users WHERE user_id = $1', [user_id]);
  const user = userResult.rows[0];
  const modelResult = await database('ai', 'SELECT * FROM models WHERE title = $1 AND premium = $2', [user.ai_model, user.premium_ai]);
  const model = modelResult.rows[0];
  const [chats, savedChats] = await Promise.all([
    database('ai', 'SELECT * FROM chats WHERE user_id = $1 AND save = false', [user.user_id]),
    database('ai', 'SELECT * FROM chats WHERE user_id = $1 AND save = true', [user.user_id])
  ]);

  // Формируем контекст
  const decryptedContext = await (async () => {
    try {
      const decrypt = await decryptedDataClient;

      return `
              Ваши чаты с данным пользователем:
              ${await Promise.all(chats.rows.map(async (row: any) => {
        const decryptedRes = await decrypt(row.res, [process.env.CRYPTO_KEY as string]);
        const decryptedReq = await decrypt(row.req, [process.env.CRYPTO_KEY as string]);
        return `на вопрос "${decryptedReq}" ты ответил: "${decryptedRes}" (${row.created_at})`;
      })).then(results => results.join('\n'))}
              
              Важные промпты пользователя:
              ${await Promise.all(savedChats.rows.map(async (row: any) => {
        return `Ты ответил ${await decrypt(row.req, [process.env.CRYPTO_KEY as string])} на ${await decrypt(row.req, [process.env.CRYPTO_KEY as string])}`
      })).then(results => results.join('\n'))}
            `;
    } catch (error) {
      console.error('Ошибка контекста:', error);
      return '';
    }
  })();
}