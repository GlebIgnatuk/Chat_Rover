import { ID, PaginationOptions } from "./types"
import { IChatMessageDTO } from "@/models/chatMessage"

export interface IChatMessageCreate {
    userId: ID
    chatId: ID
    text: string
}

export interface IChatMessagePatch {
    text?: string
}

export interface IChatMessageRepository {
    get(id: ID): Promise<IChatMessageDTO | null>
    list(chatId: ID, options?: PaginationOptions): Promise<IChatMessageDTO[]>
    create(payload: IChatMessageCreate): Promise<IChatMessageDTO>
    patch(messageId: ID, payload: IChatMessagePatch): Promise<IChatMessageDTO | null>
    delete(id: ID): Promise<void>
}