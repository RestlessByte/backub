import { decryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";


export default async function handler(data: any) {
  try {
    if (!data) {
      return { message: "Missing data in request body.", status: "error" };
    }

    // Decrypt incoming data
    const decryptedData = await decryptedDataClient(data, DecryptedKeys);

    const { auth_token_0, auth_token_1, time } = decryptedData;

    if (!auth_token_0 || !auth_token_1 || !time) {
      return { message: "Invalid or missing parameters.", status: "error" };
    }

    // Decrypt the provided auth_token_1
    const decryptedAuthToken1 = await decryptedDataClient(auth_token_1, DecryptedKeys);

    // Query the database for the security key
    const dbResult = await database(
      "web",
      "SELECT * FROM security_key_user WHERE auth_token_0 = $1 AND time = $2",
      [auth_token_0, time]
    );

    if (dbResult.rows.length === 0) {
      console.error("No matching security key found for the given tokens.");
      return { message: "Security key not found.", status: "error" };
    }

    const dbRow = dbResult.rows[0];

    // Decrypt the stored auth_token_1 from the database
    const decryptedStoredAuthToken1 = await decryptedDataClient(dbRow.auth_token_1, DecryptedKeys);

    // Validate the tokens
    if (decryptedAuthToken1 !== decryptedStoredAuthToken1) {
      console.error("Token validation failed.");
      return { message: "Invalid token.", status: "error" };
    }

    // Delete the security key from the database
    await database("web", "DELETE FROM security_key_user WHERE time = $1", [time]);

    console.log("Security key deleted successfully.");

    return {
      type: true,
      message: "Logout successful.",
      status: "success",
    };
  } catch (error) {
    console.error("Error in logout handler:", error);
    return { message: "Internal server error.", status: "error" };
  }
}