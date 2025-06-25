import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    const decrypted = await decryptedDataClient(data, DecryptedKeys);
    const { path } = decrypted
    const result = await database('web', "SELECT * FROM tariffies WHERE path=$1", [path]);
    const encrypted = await encryptedDataClient(result.rows, DecryptedKeys);
    return { data: encrypted };
  } catch (error) {
    console.error(error);
  }
}
