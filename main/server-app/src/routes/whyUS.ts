import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    const decrypted = await decryptedDataClient(data, DecryptedKeys);
    const result = await database('web', "SELECT * FROM why_us WHERE path = $1", [decrypted.path]);
    const encrypted = await encryptedDataClient(result.rows, DecryptedKeys);
    return { data: encrypted };
  } catch (error) {
    console.log(error)
  }
}
