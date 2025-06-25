import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";

export default async function handler(data: any) {
  try {
    if (!data) throw new Error("Запрос не содержит данных.");
    const decrypted = await decryptedDataClient(data, DecryptedKeys);
    const { path } = decrypted
    const result = await database('web', "SELECT * FROM seo WHERE path=$1", [path]);
    if (result.rows.length === 0) {
      return { error: "SEO конфигурация не найдена" };
    }

    const encrypted = await encryptedDataClient(result.rows, DecryptedKeys);
    return { data: encrypted };
  } catch (error) {
    console.error("Ошибка обработки /seo:", error);
    return { error: "Ошибка сервера" };
  }
}
