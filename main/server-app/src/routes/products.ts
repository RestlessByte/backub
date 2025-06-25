import { decryptedDataClient, encryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';
export default async function handler(data: any) {
  const decryptedData = await decryptedDataClient(data, DecryptedKeys)
  const { shop } = decryptedData
  const { type, categories } = shop
  const db = await database('web', 'SELECT * FROM products WHERE type = $1 AND categories = $2', [type, categories])
  const encryptData = await encryptedDataClient(db.rows, DecryptedKeys)
  return { data: { shop: encryptData } }
}