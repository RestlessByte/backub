import { config } from "dotenv";
config({ path: '../../.env' });
export const DecryptedKeys = [
  `${process.env.CLIENT_SECURITY_KEY_0}`,
  `${process.env.CLIENT_SECURITY_KEY_1}`,

];
