import mongoose, { mongo, Types } from 'mongoose'
import { IBaseModel } from './base'

export type IUserState = 'created' | 'complete'

export interface IUserModel extends IBaseModel {
    externalId: number
    nickname: string
    language: string
    avatarUrl?: string
    lastActivityAt: Date
    state: string
}

export type IUserDTO = mongo.WithId<IUserModel>

export type IPublicUserDTO = mongo.WithId<
    Pick<IUserModel, 'language' | 'nickname' | 'lastActivityAt' | 'avatarUrl'>
>

export const UserModel = {
    getCollection: () => mongoose.connection.collection<IUserModel>('users'),
}
