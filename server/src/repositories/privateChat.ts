import { IChatDTO, IPrivateChatDTO } from '@/models/chat'
import { ID } from './types'
import { IUserDTO } from '@/models/user'
import { IChatMessageDTO } from '@/models/chatMessage'

export interface IPrivateChatCreate {
    userId: ID
    peerId: ID
}

export type IPrivateChatWithMetadataDTO = Omit<IChatDTO, 'members'> & {
    peer: IUserDTO
    lastMessage: IChatMessageDTO | null
}

export type IPrivateChatPatch = {
    lastMessageSentAt?: Date
}

export interface IPrivateChatRepository {
    get(id: ID): Promise<IPrivateChatDTO | null>
    getWithMetadata(id: ID, userId: ID): Promise<IPrivateChatWithMetadataDTO | null>
    list(userId: ID): Promise<IPrivateChatWithMetadataDTO[]>
    findByPeer(userId: ID, peerId: ID): Promise<IPrivateChatWithMetadataDTO | null>
    hasMember(chatId: ID, memberId: ID): Promise<boolean>
    create(payload: IPrivateChatCreate): Promise<IPrivateChatDTO>
    patch(id: ID, payload: IPrivateChatPatch): Promise<IPrivateChatDTO | null>
    delete(id: ID): Promise<void>
}
