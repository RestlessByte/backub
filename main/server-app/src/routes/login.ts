import { decryptedDataClient, encryptedDataClient } from "@crypto/*";
import { database } from "@db/connects";
import { DecryptedKeys } from "@decrypted/*";
export default async function handler(data: any) {
  try {
    if (!data) {
      return { message: "Missing data in request body.", status: "error" };
    }
    const decrypted = await decryptedDataClient(data, DecryptedKeys);
    const { auth } = decrypted;
    const { email, password, device, ip } = auth;

    if (!email || !password) {
      return { message: "Email or password missing.", status: "error" };
    }
    const normalizedEmail = email.toLowerCase().trim();
    const dbResult = await database('web',
      "SELECT user_id, email, password, auth_token_0 FROM users WHERE email = $1",
      [normalizedEmail]
    );
    if (!dbResult?.rows?.length) {
      return { message: "Пользователь не найден", status: "error" };
    }
    const user = dbResult.rows[0];
    const storedPassword = await decryptedDataClient(user.password, DecryptedKeys);

    if (storedPassword !== password) {
      return { message: "Неверный email или пароль", status: "error" };
    }
    const today = Date.now();
    const token1 = await encryptedDataClient({ data: today }, DecryptedKeys);
    // ⚠️ Обновлено: Сохраняем новый токен в массив существующих
    const newTokens = token1;
    await database('security', `INSERT INTO web (email, auth_token_0, device, ip, status) VALUES ($1,$2,$3,$4,$5)`, [normalizedEmail, newTokens, device, await encryptedDataClient(ip, DecryptedKeys), 'Авторизация']);
    const encryptedData = await encryptedDataClient(
      { auth_token_0: token1 },
      DecryptedKeys
    );

    return {
      data: encryptedData,
      message: "Успешный вход",
      status: "success",
    };
  } catch (error) {
    console.error("Error in login handler:", error);
    return { message: "Внутренняя ошибка сервера.", status: "error" };
  }
}
