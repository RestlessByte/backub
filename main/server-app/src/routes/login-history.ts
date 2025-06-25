import { decryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    const decryptedData = await decryptedDataClient(data, DecryptedKeys)
    const { auth_token_1, uuid } = decryptedData;
    if (!auth_token_1 || !uuid) {
      return { message: "Недостаточно данных для проверки.", status: "error" };
    }

    // Получаем email пользователя по uuid
    const userResult = await database(
      "web",
      "SELECT email FROM users WHERE uuid = $1",
      [uuid]
    );
    if (userResult.rows.length === 0) {
      return { message: "Пользователь не найден.", status: "error" };
    }
    const { email } = userResult.rows[0];

    // Получаем историю входов по email
    const historyResult = await database(
      "security",
      "SELECT id, session_token, created_at FROM security WHERE email = $1 ORDER BY created_at DESC",
      [email]
    );

    return {
      data: historyResult.rows,
      message: "История входов получена успешно.",
      status: "success"
    };
  } catch (error) {
    console.error("Error in login-history handler:", error);
    return { message: "Внутренняя ошибка сервера.", status: "error" };
  }
} 