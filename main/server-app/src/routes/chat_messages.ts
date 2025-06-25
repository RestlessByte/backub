import { decryptedDataClient, encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';

export default async function handler(data: any) {
  const decryptedData = await decryptedDataClient(data, DecryptedKeys)
  const { chat } = decryptedData
  const messages = await database('web', 'SELECT * FROM chats_ai_messages WHERE chat_id = $1', [chat.chat_id])?.then(i => i.rows)
  const payload = { user: { messages: messages } }
  return {
    data: await encryptedDataClient(payload, DecryptedKeys)
  }
}