import mongoose, { mongo, Types } from 'mongoose'
import { IBaseModel } from './base'

export type IUserState = 'created' | 'complete'

export interface IUserModel extends IBaseModel {
    externalId: number
    nickname: string
    language: string
    lastActivityAt: Date
    state: string
}

export type IUserDTO = mongo.WithId<IUserModel>

export const UserModel = {
    getCollection: () => mongoose.connection.collection<IUserModel>('users'),
}
