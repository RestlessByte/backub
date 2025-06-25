import { Context } from "telegraf";

// Определение вашего типа сессии
export interface SessionData {
  token?: string;
  avatarId?: string;
  text?: string;
  expectedInput?: "token" | "textForReels" | "avatarPhoto";
  subscription?: {
    type: 'free' | 'pro' | 'business';
    expiresAt: Date;
    usageCount: number;
  };
}

// Расширяем тип Context, добавляя свойство session
declare module "telegraf" {
  interface Context {
    session: SessionData;
  }
} 