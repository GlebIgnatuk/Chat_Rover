import mongoose, { mongo, Types } from "mongoose"
import { IUserDTO } from "./user"
import { IBaseModel } from "./base"

export interface IChatMessageModel extends IBaseModel {
    chatId: Types.ObjectId
    type: string
    text: string
    createdBy: Types.ObjectId
}

export const MESSAGE_TYPES = ['text'] as const
export type MessageType = typeof MESSAGE_TYPES[number]

export type IChatMessageDTO = mongo.WithId<IChatMessageModel> & {
    createdBy?: IUserDTO
}

export const ChatMessageModel = {
    getCollection: () => mongoose.connection.collection<IChatMessageModel>('chat_messages')
}