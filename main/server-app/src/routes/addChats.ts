import { decryptedDataClient, encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';
export default async function handler(data: any) {
  const decryptedData = await decryptedDataClient(data, DecryptedKeys)
  const { user } = decryptedData
  const chats = await database('web', 'INSERT INTO chats_ai (user_id, "Чат без названия") VALUES ($1) user_id = $1', [user.id])?.then(i => i.rows)
  const payload = { user: { chats: chats } }
  return {
    data: await encryptedDataClient(payload, DecryptedKeys)
  }
}