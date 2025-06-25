import { decryptedDataClient } from '@crypto/*';
import { database } from '@db/connects';
import { DecryptedKeys } from '@decrypted/*';
export default async function handler(data: any) {
	const decryptedData = await decryptedDataClient(data, DecryptedKeys)
	await database('web', 'INSERT INTO bug_tracker (message) VALUES ($1)', [decryptedData.message])
}