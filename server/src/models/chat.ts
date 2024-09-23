import mongoose, { mongo, Types } from "mongoose"
import { IBaseModel } from "./base"
import { IUserDTO } from "./user"

export interface IChatModel extends IBaseModel {
    type: string
    members: Types.ObjectId[]
}

export interface IPrivateChatModel extends IChatModel {}
export interface IGlobalChatModel extends IChatModel {}

export const CHAT_TYPES = ['private', 'global'] as const
export type ChatType = typeof CHAT_TYPES[number]

export type IChatDTO = mongo.WithId<IChatModel>
export type IPrivateChatDTO = mongo.WithId<IPrivateChatModel> & {
    members: IUserDTO[]
}
export type IGlobalChatDTO = mongo.WithId<IGlobalChatModel> & {
    members: IUserDTO[]
}

export const ChatModel = {
    getCollection: () => mongoose.connection.collection<IChatModel>('chats')
}