import { decryptedDataClient, encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';

export default async function handler(data: any) {
  try {
    // Проверка метода запроса
    // Проверка наличия данных
    if (!data) {
      return { error: 'Missing data in request' };
    }

    const decryptedData = await decryptedDataClient(data, DecryptedKeys);
    const { createNewChat } = decryptedData;

    // Проверка структуры данных
    if (!createNewChat || !createNewChat.user_id || !createNewChat.title) {
      return { error: 'Invalid chat data structure' };
    }

    const chatData = createNewChat;

    // Генерация уникального chat_id
    const chatIdResult = await database(
      'web',
      'SELECT COALESCE(MAX(chat_id), 0) + 1 AS new_chat_id FROM chats_ai WHERE user_id = $1',
      [chatData.user_id]
    );


    // Использование транзакции для согласованности данных
    await database('web', 'BEGIN', []);

    try {
      // Создание нового чата
      await database(
        'web',
        'INSERT INTO chats_ai (title, user_id) VALUES ($1, $2)',
        [chatData.title, chatData.user_id]
      );

      // Создание содержимого чата
      await database(
        'web',
        'INSERT INTO chats_contents_ai (user_id) VALUES ($1)',
        [chatData.user_id]
      );

      await database('web', 'COMMIT', []);
    } catch (dbError) {
      await database('web', 'ROLLBACK', []);
      throw dbError;
    }


    // Получение созданных данных
    const createdChat = await database(
      'web',
      'SELECT * FROM chats_ai WHERE user_id = $1',
      [chatData.user_id]
    );

    // Формирование и шифрование ответа
    const responseData = {
      notificationMessage: `Чат "${chatData.title}" успешно создан`,
      notificationType: 'success',
      chats: {
        ...createdChat.rows[0],
      }
    };

    const encryptedResponse = await encryptedDataClient(responseData, DecryptedKeys);

    return { data: encryptedResponse };

  } catch (error) {
    console.error('Error creating chat:', error);
    return {
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}