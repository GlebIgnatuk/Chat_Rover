import { IChatMessageRepository } from './chatMessage'
import { IPrivateChatRepository } from './privateChat'
import { IUserRepository } from './user'
import { IWuwaCharacterRepository } from './wuwaCharacter'

export interface IRepositories {
    chatMessage: IChatMessageRepository
    privateChat: IPrivateChatRepository
    user: IUserRepository
    wuwaCharacter: IWuwaCharacterRepository
}
