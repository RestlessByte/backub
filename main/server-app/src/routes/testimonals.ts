import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
    const decryptedData = await decryptedDataClient(data, DecryptedKeys)
    const { id } = decryptedData
    const db = await database('web', 'SELECT * from testimonals WHERE executor = $1', [id])
    return {
        data: await encryptedDataClient(db.rows, DecryptedKeys)
    }
}