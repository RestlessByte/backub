import { encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
	const d = await database('web', 'SELECT * FROM shop')
	const encryptedData = await encryptedDataClient(d, DecryptedKeys)
	return {
		data: encryptedData
	}
}