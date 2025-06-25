export interface IInterfaceTelegramNeuroUser {
  id: number;
  user_id: number;
  username?: string;
  balance?: number;
  name?: string
  speak?: boolean;
  completion_tokens?: number
  total_tokens?: number
}