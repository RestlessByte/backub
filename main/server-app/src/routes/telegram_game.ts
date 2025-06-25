import { decryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
	const decryptedData = await decryptedDataClient(data, DecryptedKeys)
	const { user_id } = await decryptedData
	const db = await database('telegram_game', 'SELECT * from users WHERE user_id = $1', [user_id])
}