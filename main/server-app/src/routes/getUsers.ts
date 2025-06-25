import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connectS	";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
	try {
		const decryptedData = await decryptedDataClient(data, DecryptedKeys)
		const { link } = decryptedData
		const db = await database('web', 'SELECT * FROM users WHERE link = $1', [link])
		const encryptedData = await encryptedDataClient(db.rows[0], DecryptedKeys)
		return {
			data: { user: encryptedData }
		}
	} catch (err) {
		console.log(err)
	}
}