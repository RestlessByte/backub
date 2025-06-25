import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    if (!data) {
      return { error: "Нет данных в запросе." };
    }

    // Дешифруем данные
    const decrypted = await decryptedDataClient(data, DecryptedKeys);
    const { link } = decrypted;

    if (!link) {
      return { error: "Отсутствует параметр link." };
    }

    console.log("Запрашиваемый link:", link);

    // Запрос к базе данных
    const db = await database('web', "SELECT * FROM cv WHERE link = $1", [link]);

    if (db.rows.length === 0) {
      console.error(`CV с link "${link}" не найдено.`);
      return { error: "CV не найдено." };
    }

    // Шифруем данные для клиента
    const encrypted = await encryptedDataClient(db.rows[0], DecryptedKeys);
    return { data: encrypted };
  } catch (error: any) {
    console.error("Ошибка обработки запроса CV:", error.message);
    return { error: "Ошибка сервера." };
  }
}
