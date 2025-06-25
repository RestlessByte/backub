import dotenv from "dotenv";
import { Pool } from "pg";
// Загружаем переменные окружения из .env
dotenv.config({ path: '.env' });
export type IDataBase = 'telegram_my_security';
export default async (SQL_BASE: IDataBase, SQL_TEXT: string, SQL_PARAMS?: any[], ORM?: boolean) => {
  if (!ORM) {
    return new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: SQL_BASE,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT)
    }).query(SQL_TEXT, SQL_PARAMS)
  }
  else {
    return TelegramAIHubSyncModels()
  }
}

