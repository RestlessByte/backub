import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
    try {
        const decryptData = await decryptedDataClient(data, DecryptedKeys)
        const { auth_token_0 } = decryptData
        const db = await database('web', 'SELECT id, email, first_name, last_name,uuid FROM users WHERE auth_token_0 = $1', [auth_token_0])
        const addCrypto = await encryptedDataClient(Array(3).push(await encryptedDataClient(db.rows[0], DecryptedKeys)), DecryptedKeys)
        await database('web', 'INSERT INTO (keys, auth_token_0) VALUES ($1, $2)', [addCrypto, db.rows[0].auth_token_0])
        return {
            status: 'success',
            text: 'Сервер дал положительный ответ. Ваши данные теперь максимально защищены!'
        }
    } catch (err) {
        console.log(err)
    }
}