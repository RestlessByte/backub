import { database } from "@db/connects";
import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { DecryptedKeys } from "@decrypted/*";
import { v4 as uuidv4 } from "uuid";

interface RegistrationRequestBody {
  data: string;
}

export default async function handler(data: any) {
  try {
    if (!data) {
      return { message: "Missing data in request body.", status: "error" };
    }
    const decrypted = await decryptedDataClient(data, DecryptedKeys);
    const { auth } = decrypted;
    const { firstName, lastName, email, password, link, device, ip } = auth;

    if (!firstName || !lastName || !email || !password) {
      return { message: "Недостаточно данных для регистрации.", status: "error" };
    }

    const today = Date.now();
    const encryptedPassword = await encryptedDataClient(password, DecryptedKeys);
    const encryptedToken1 = await encryptedDataClient({ data: today }, DecryptedKeys);
    await database(
      "web",
      `
        INSERT INTO users (
          first_name, last_name, email, password,auth_token_0, link
        ) VALUES ($1, $2, $3, $4, $5,$6)
      `,
      [
        firstName, lastName, email, encryptedPassword, encryptedToken1, link
      ]
    );
    await database('security', `INSERT INTO web (email, auth_token_0, device,ip) VALUES ($1,$2,$3,$4)`, [email, encryptedToken1, device, await encryptedDataClient(ip, DecryptedKeys)]);

    const encryptedResponseData = await encryptedDataClient(
      { auth_token_0: encryptedToken1 },
      DecryptedKeys
    );

    return {
      message: "Регистрация успешна.",
      data: encryptedResponseData,
      status: "success",
    };
  } catch (error) {
    console.error("Error in registration handler:", error);
    return {
      message: "Внутренняя ошибка сервера",
      status: "error",
    };
  }
}
