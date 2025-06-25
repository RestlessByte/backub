import { decryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    const decryptedData = await decryptedDataClient(data, DecryptedKeys)
    const { tokenId, auth_token_1, uuid } = decryptedData;
    if (!tokenId || !auth_token_1 || !uuid) {
      return { message: "Недостаточно данных для удаления токена.", status: "error" };
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

    // Удаляем запись о сессии по id и email
    const deleteResult = await database(
      "security",
      "DELETE FROM security WHERE id = $1 AND email = $2 RETURNING session_token",
      [tokenId, email]
    );

    if (deleteResult.rowCount === 0) {
      return { message: "Токен не найден.", status: "error" };
    }

    // Проверяем, удаляется ли текущая сессия
    const deletedToken = deleteResult.rows[0].session_token;
    const isCurrent = (deletedToken === auth_token_1);

    return {
      message: "Токен успешно удален.",
      status: "success",
      deletedCurrent: isCurrent
    };
  } catch (error) {
    console.error("Error in delete-token handler:", error);
    return { message: "Внутренняя ошибка сервера.", status: "error" };
  }
} 