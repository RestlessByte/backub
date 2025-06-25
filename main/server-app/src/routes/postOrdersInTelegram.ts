import { decryptedDataClient } from "@crypto/*";
import { DecryptedKeys } from "@decrypted/*";
import { configDotenv } from "dotenv";
configDotenv()
export default async function handler(data: any) {
	const decryptedData = await decryptedDataClient(data, DecryptedKeys)
	const form = decryptedData.form
}