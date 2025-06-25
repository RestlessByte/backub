import { decryptedDataClient, encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';
export default async function handler(data: any) {
  const decryptedData = await decryptedDataClient(data, DecryptedKeys)
  const { user } = decryptedData
  const { user_id } = user
  const db = await database('web', 'SELECT email FROM users WHERE user_id = $1', [user_id])
  const security = await database('security', 'SELECT * FROM web WHERE email = $1', [db.rows[0].email])
  const encryptData = await encryptedDataClient(security.rows, DecryptedKeys)
  return { data: encryptData }
}