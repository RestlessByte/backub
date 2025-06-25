import { encryptedDataClient } from "@crypto/*";
import { DecryptedKeys } from "@decrypted/*";
import { database } from "@db/connects";

export default async function handler(data: any) {
	const db = await database('web', 'SELECT * FROM education')
	return {
		data: await encryptedDataClient(db.rows, DecryptedKeys)
	}
}