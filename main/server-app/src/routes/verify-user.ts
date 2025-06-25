import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    if (!data) {
      return { message: "Missing data in request body.", status: "error" };
    }

    const decrypted = await decryptedDataClient(data, DecryptedKeys);
    const { auth_token_0 } = decrypted;
    const t = auth_token_0 as string
    const security = await database('security', `SELECT * FROM web WHERE auth_token_0 = $1`, [t])
    const db = await database('web', `SELECT * FROM users WHERE email = $1`, [security.rows[0].email])
    const user = db.rows[0]
    const encryptedData = await encryptedDataClient({ user: user }, DecryptedKeys);

    return {
      data: encryptedData,
      status: "success"
    };

  } catch (err) {
    console.error("Error in handler:", err);
    return { message: "Internal server error.", status: "error" };
  }
}
