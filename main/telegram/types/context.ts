import { Context } from "telegraf";
import { ITelegramUser } from "./user/type";

export interface SessionData {
  token?: string;
  avatarId?: string;
  text?: string;
  isPremium?: boolean;
  awaitingToken?: boolean;
  awaitingWriteText?: boolean;
  awaitingNewToken?: boolean;
  awaitingPhotoForAvatar?: boolean;
  [key: string]: unknown;
  user?: ITelegramUser;
}

export interface MyContext extends Context {
  session: SessionData;
} 