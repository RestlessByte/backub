import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  const decryptedData = await decryptedDataClient(data, DecryptedKeys)
  const { type } = decryptedData
  const db = await database('main', 'SELECT * FROM services WHERE category = $1', [type])
  return {
    data: await encryptedDataClient(db.rows, DecryptedKeys)
  }
}