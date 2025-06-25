import { encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';

export default async function handler(data: any) {
  const db = await database('web', 'SELECT * from online_shop')
  const encrypt = await encryptedDataClient(db.rows, DecryptedKeys)
  return { data: encrypt }
}
