import dotenv from "dotenv";
import { Pool } from "pg";

// Загружаем переменные окружения из .env
dotenv.config();

export const RootDatabase = async (db: 'ai' | 'aiwars' | 'channel' | 'games' | 'hey_gen' | 'main' | 'minecraft' | 'payments' | 'postgres' | 'security'
  | 'shop' | 'telegram_game' | 'telegram_my_security' | 'vk_game' | 'web', text: string, params?: any[]) => new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: db,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
  }).query(text, params)

