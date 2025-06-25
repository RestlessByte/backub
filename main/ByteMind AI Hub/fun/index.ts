import OpenAI from "openai"
import { ByteMindAIHubUsingAI } from "./ai"
import type { IInterfaceByteMindAIHubModels, IInterfaceByteMindAIHubUsers } from "../types/all"
import database from '../../db/connection'
export class ByteMindAiHub {
  user: IInterfaceByteMindAIHubUsers | undefined
  async getUsers(user_id: number) {
    const db = await database('ai', 'SELECT * FROM users WHERE user_id = $1', [user_id])
    this.user = db.rows[0]
    return this.user
  }
  async getModelsFromUsers(user_id: number) {

    const models = await database('ai', 'SELECT * from models WHERE title = $1', [user_id])
    return models.rows[0] as IInterfaceByteMindAIHubModels
  }
  async getModelsAll() {
    const models = await database('ai', 'SELECT * from models')
    return models.rows as IInterfaceByteMindAIHubModels[]
  }
  async usingModel(props: { userId?: number, prompt: string }) {
    return ByteMindAIHubUsingAI(Number(this.user?.user_id || props.userId), props.prompt)
  }
}