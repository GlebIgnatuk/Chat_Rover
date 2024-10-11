import { IChatMessageRepository } from './chatMessage'
import { IPrivateChatRepository } from './privateChat'
import { IUserRepository } from './user'
import { IWuwaCharacterRepository } from './wuwaCharacter'
import { IProfileRepository } from './profile'

export interface IRepositories {
    chatMessage: IChatMessageRepository
    privateChat: IPrivateChatRepository
    user: IUserRepository
    wuwaCharacter: IWuwaCharacterRepository
    profile: IProfileRepository
}
