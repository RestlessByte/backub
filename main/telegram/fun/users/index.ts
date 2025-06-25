import database, { IDataBase } from "@db/connection";
import { ITelegramUsers } from "@root/telegram/types/user/type";

export const ParseTelegramUsersInDatabaseByID = async (db: IDataBase, id: number) => {
  const user = await database(db, 'SELECT * FROM users WHERE user_id = $1', [id])
  return user.rows[0] as ITelegramUsers
}