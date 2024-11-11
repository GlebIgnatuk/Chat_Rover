import { IChatMessageRepository } from './chatMessage'
import { IPrivateChatRepository } from './privateChat'
import { IUserRepository } from './user'
import { IWuwaCharacterRepository } from './wuwaCharacter'
import { IProfileRepository } from './profile'
import { IGlobalChatRepository } from './globalChat'
import { IReportRepository } from './reports'

export interface IRepositories {
    chatMessage: IChatMessageRepository
    privateChat: IPrivateChatRepository
    globalChat: IGlobalChatRepository
    report: IReportRepository
    user: IUserRepository
    wuwaCharacter: IWuwaCharacterRepository
    profile: IProfileRepository
}
