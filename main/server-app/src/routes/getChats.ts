import { decryptedDataClient, encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';

export default async function handler(data: any) {
  const decryptedData = await decryptedDataClient(data, DecryptedKeys)
  const { user } = decryptedData
  const u = user
  const chats = await database('web', 'SELECT * FROM chats_ai WHERE user_id = $1', [u.user_id])
  const contents = await database('web', 'SELECT * FROM chats_contents_ai WHERE user_id = $1', [u.user_id])
  return {
    data: await encryptedDataClient({ notificationMessage: `Чаты успешно загружены`, notificationType: 'success', chats: chats.rows }, DecryptedKeys)
  }
}
