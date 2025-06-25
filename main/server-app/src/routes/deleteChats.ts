import { decryptedDataClient, encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';

export default async function handler(data: any) {
  const decryptedData = await decryptedDataClient(data, DecryptedKeys)
  const { chats } = decryptedData
  await database('web', 'DELETE FROM chats_ai WHERE user_id = $1 AND chat_id = $2', [chats.user_id, chats.chat_id])
  await database('web', 'DELETE FROM chats_contents_ai WHERE user_id = $1 AND chat_id = $2', [chats.user_id, chats.chat_id])
  return {
    data: await encryptedDataClient({ notificationMessage: `Чаты успешно загружены`, notificationType: 'success' }, DecryptedKeys)
  }
}
