export interface SessionData {
  token?: string;
  avatarId?: string;
  text?: string;
  expectedInput?: "token" | "textForHeyGen" | "textForReels" | "avatarPhoto";
  // Другие поля сессии...
} 