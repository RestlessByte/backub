import { encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';

export default async function handler(data: any) {
  const db = await database('web', 'SELECT * FROM offline_shop')
  const encryptData = await encryptedDataClient(db.rows, DecryptedKeys)
  return {
    data: encryptData
  }
}