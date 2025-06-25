import { encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    const db = await database('ai', 'SELECT * from users')
    return {
      data: await encryptedDataClient(db.rows, DecryptedKeys)
    }
  } catch (err) {
    console.log(err)
  }
}