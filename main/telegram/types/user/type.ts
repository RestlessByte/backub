export interface ITelegramUser {
  user_id: bigint
  balance?: bigint
  rub?: bigint
  prefix?: string
  level?: bigint
  rank?: bigint
  registration: string
  create_project: boolean
  username: string
}