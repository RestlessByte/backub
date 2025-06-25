import { Sequelize } from 'sequelize'
import { Config } from '../../config/config.js'

import UserModel, {
	defineAssociations as defineUserAssociations,
} from './user.model.js'
import CollaborationModel from './collaboration.model.js'
import UserCollaborationModel, {
	defineUserCollaborationAssociations,
} from './userCollaboration.model.js'
import CollaborationPhotoModel from './collaborationPhoto.model.js'
import CollaborationRequestModel from './collaborationRequest.model.js'
import MatchModel from './match.model.js'
import ChatModel, {
	defineAssociations as defineChatAssociations,
} from './chat.model.js'
import MessageModel, {
	defineAssociations as defineMessageAssociations,
} from './message.model.js'
import PortfolioModel, {
	defineAssociations as definePortfolioAssociations,
} from './portfolio.model.js'
import SwipeRecordModel, {
	defineAssociations as defineSwipeRecordAssociations,
} from './swipeRecord.model.js'
import PortfolioMediaModel, {
	defineAssociations as definePortfolioMediaAssociations,
} from './portfolioMedia.model.js'
import ARContentModel from './arContent.model.js'
import RequestModel, {
	defineAssociations as defineRequestAssociations,
} from './request.model.js'
import CollaborationChatModel, {
	defineAssociations as defineCollaborationChatAssociations,
} from './collaborationChat.model.js'
import CollaborationMessageModel, {
	defineAssociations as defineCollaborationMessageAssociations,
} from './collaborationMessage.model.js'
import AIChatModel, {
	defineAssociations as defineAIChatAssociations,
} from './AIChat.model.js'

// export const sequelize = new Sequelize(process.env.DATABASE_URL, {
// 	dialect: 'postgres',
// 	logging: false,
// 	dialectOptions: {
// 		ssl: {
// 			require: true,
// 			rejectUnauthorized: false,
// 		},
// 	},
// })

//local
export const sequelize = new Sequelize({
	database: Config.db.database,
	username: Config.db.user,
	password: Config.db.password,
	host: Config.db.host,
	port: Config.db.port,
	dialect: Config.db.dialect,
	logging: false,
	dialectOptions:
		process.env.NODE_ENV === 'production'
			? {
				ssl: {
					require: true,
					rejectUnauthorized: false,
				},
			}
			: {},
})
// Инициализация моделей
export const User = UserModel(sequelize)
export const Collaboration = CollaborationModel(sequelize)
export const UserCollaboration = UserCollaborationModel(sequelize)
export const CollaborationPhoto = CollaborationPhotoModel(sequelize)
export const CollaborationRequest = CollaborationRequestModel(sequelize)
export const Match = MatchModel(sequelize)
export const Chat = ChatModel(sequelize)
export const Message = MessageModel(sequelize)
export const Portfolio = PortfolioModel(sequelize)
export const SwipeRecord = SwipeRecordModel(sequelize)
export const Request = RequestModel(sequelize)
export const PortfolioMedia = PortfolioMediaModel(sequelize)
export const ARContent = ARContentModel(sequelize)
export const AIChat = AIChatModel(sequelize)
export const CollaborationChat = CollaborationChatModel(sequelize)
export const CollaborationMessage = CollaborationMessageModel(sequelize)

const models = {
	User,
	Collaboration,
	UserCollaboration,
	CollaborationPhoto,
	CollaborationRequest,
	Match,
	Chat,
	Message,
	CollaborationChat,
	CollaborationMessage,
	Portfolio,
	PortfolioMedia,
	ARContent,
	SwipeRecord,
	Request,
	AIChat,
}

// Определение ассоциаций
defineUserAssociations(User, models)
definePortfolioAssociations(Portfolio, models)
defineCollaborationChatAssociations(CollaborationChat, models)
defineCollaborationMessageAssociations(CollaborationMessage, models)
defineChatAssociations(Chat, models)
defineMessageAssociations(Message, models)
defineRequestAssociations(Request, models)
defineAIChatAssociations(AIChat, models)
defineSwipeRecordAssociations(SwipeRecord, models)
definePortfolioMediaAssociations(PortfolioMedia, models)
defineUserCollaborationAssociations(UserCollaboration, models)

sequelize
	.sync({ alter: true })
	.then(() => console.log('[INFO] DB synced'))
	.catch(err => console.error('[ERROR] DB sync failed:', err))

export default models
