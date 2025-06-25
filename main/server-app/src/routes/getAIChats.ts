import { decryptedDataClient, encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';

export default async function handler(data: any) {
  // Проверяем метод запроса
  try {
    const { getChats } = data
    // Проверяем наличие данных
    if (!getChats) {
      return { error: 'Missing required data' };
    }

    // Дешифруем данные
    const decryptedData = await decryptedDataClient(data.getChats, DecryptedKeys);
    const chatRequest = decryptedData

    // Проверяем обязательные поля
    if (!chatRequest.user_id && !chatRequest.chat_id) {
      return { error: 'Missing user_id or chat_id' };
    }

    // Определяем параметры запроса
    let whereField: string;
    let whereValue: number;

    if (chatRequest.user_id) {
      whereField = 'user_id';
      whereValue = chatRequest.user_id;
    } else {
      whereField = 'chat_id';
      whereValue = chatRequest.chat_id!;
    }

    // Безопасные запросы к базе данных с параметрами
    const contentsQuery = `SELECT * FROM chats_contents_ai WHERE ${whereField} = $1`;
    const chatsQuery = `SELECT * FROM chats_ai WHERE ${whereField} = $1`;

    const contents = await database('web', contentsQuery, [whereValue]);
    const chats = await database('web', chatsQuery, [whereValue]);

    // Формируем ответ
    const responseData = {
      chats: chats.rows,
      contents: contents.rows
    };

    // Шифруем ответ
    const encryptedResponse = await encryptedDataClient(responseData, DecryptedKeys);

    return { data: encryptedResponse };

  } catch (error) {
    console.error('Error in getChats handler:', error);
    return { error: 'Internal Server Error' };
  }
}