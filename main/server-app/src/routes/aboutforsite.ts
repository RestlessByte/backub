import { encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    const result = await database('web', "SELECT * FROM aboutforsite");
    if (result.rows.length === 0) {
      return { error: "SEO конфигурация не найдена" };
    }

    const encrypted = await encryptedDataClient(result.rows, DecryptedKeys);
    return { data: encrypted };
  } catch (error) {
    return { error: "Ошибка сервера" };
  }
}
