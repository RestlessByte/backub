import { encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';

export default async function handler(data: any) {
  const db = await database('web', 'SELECT * FROM info_auth')
  return { data: await encryptedDataClient(db.rows, DecryptedKeys) }
}