import mongoose, { mongo, Types } from 'mongoose';
import { IBaseModel } from './base';
import { IUserDTO } from './user';

export interface IChatModel extends IBaseModel {
    type: ChatType;
}

export interface IPrivateChatModel extends IChatModel { lastMessageSentAt: Date; members: Types.ObjectId[]; }
export interface IGlobalChatModel extends IChatModel { title: string; description?: string; }

export const CHAT_TYPES = ['private', 'global'] as const;
export type ChatType = (typeof CHAT_TYPES)[number];

export type IChatDTO = mongo.WithId<IChatModel>;
export type IPrivateChatDTO = Omit<mongo.WithId<IPrivateChatModel>, 'members'> & {
    members: IUserDTO[];
};
export type IGlobalChatDTO = Omit<mongo.WithId<IGlobalChatModel>, 'members'> & {
    
};

export const ChatModel = {
    getCollection: () => mongoose.connection.collection<IChatModel>('chats'),
};

export const GlobalChatModel = {
    getCollection: () => mongoose.connection.collection<IGlobalChatModel>('chats'),
};

export const PrivateChatModel = {
    getCollection: () => mongoose.connection.collection<IPrivateChatModel>('chats'),
};
