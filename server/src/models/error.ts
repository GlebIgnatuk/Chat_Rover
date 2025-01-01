import mongoose, { Types } from 'mongoose'
import { IBaseModel } from './base'

export interface IErrorModel extends IBaseModel {
    name: string
    message: string
    stack?: string
    location: string
    externalUserId?: number
}

export type IErrorDTO = mongoose.mongo.WithId<IErrorModel>

export const ErrorModel = {
    getCollection: () => mongoose.connection.collection<IErrorModel>('errors'),
}
