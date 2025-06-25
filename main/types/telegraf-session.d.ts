import { SessionData } from './sessionData';

declare module "telegraf" {
  interface Context {
    session?: SessionData;
  }
} 