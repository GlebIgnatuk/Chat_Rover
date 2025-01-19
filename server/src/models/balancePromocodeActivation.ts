import mongoose, { mongo, Types } from 'mongoose'
import { IBaseModel } from './base'

export interface IBalancePromocodeActivationModel extends IBaseModel {
    balancePromocodeId: Types.ObjectId
    userId: Types.ObjectId
}

export type IBalancePromocodeActivationDTO = mongo.WithId<IBalancePromocodeActivationModel>

export const BalancePromocodeActivationModel = {
    getCollection: () =>
        mongoose.connection.collection<IBalancePromocodeActivationModel>(
            'balance_promocode_activations',
        ),
}
