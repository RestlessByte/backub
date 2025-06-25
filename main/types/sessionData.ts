export interface SessionData {
  token?: string;       // Токен пользователя
  avatarId?: string;    // ID выбранного аватара
  text?: string;        // Текст для Reels
  expectedInput?: "token" | "registrationEmail" | "textForReels" | "avatarPhoto" | "textForHeyGen" | undefined; // Ожидаемый тип ввода от пользователя
  subscription?: {
    type: 'free' | 'pro' | 'business';
    expiresAt: Date;
    usageCount: number;
  };
} 