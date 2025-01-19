import mongoose, { mongo } from 'mongoose'
import { IBaseModel } from './base'

export interface IBalancePromocodeModel extends IBaseModel {
    value: number
    code: string
    expiresAt: Date | null
}

export type IBalancePromocodeDTO = mongo.WithId<IBalancePromocodeModel>

export const BalancePromocodeModel = {
    getCollection: () =>
        mongoose.connection.collection<IBalancePromocodeModel>('balance_promocodes'),
}
