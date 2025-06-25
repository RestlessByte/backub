import { database } from "@db/connects";

export default async function handler(data: any) {
  try {
    // Дешифрованные данные уже получены
    const dbResult = await database('web', "SELECT * FROM config");

    if (!dbResult.rows.length) {
      return {
        status: 'error',
        error: "CONFIG_NOT_FOUND"
      };
    }

    return {
      status: 'success',
      data: dbResult.rows[0].title_web_site
    };
  } catch (error) {
    console.error("CONFIG_ERROR:", error);
    return {
      status: 'error',
      error: "SERVER_ERROR"
    };
  }
}