import { IChatDTO, IPrivateChatDTO } from '@/models/chat'
import { ID } from './types'
import { IUserDTO } from '@/models/user'
import { IChatMessageDTO } from '@/models/chatMessage'

export interface IPrivateChatCreate {
    userId: ID
    peerId: ID
}

export type IMyPrivateChatDTO = Omit<IChatDTO, 'members'> & {
    peer: IUserDTO
    lastMessage: IChatMessageDTO | null
}

export type IPrivateChatPatch = {
    lastMessageSentAt?: Date
}

export interface IPrivateChatRepository {
    get(id: ID): Promise<IPrivateChatDTO | null>
    listMyChats(userId: ID): Promise<IMyPrivateChatDTO[]>
    findByPeer(userId: ID, peerId: ID): Promise<IPrivateChatDTO | null>
    hasMember(chatId: ID, memberId: ID): Promise<boolean>
    create(payload: IPrivateChatCreate): Promise<IPrivateChatDTO>
    patch(id: ID, payload: IPrivateChatPatch): Promise<IPrivateChatDTO | null>
    delete(id: ID): Promise<void>
}
