import mongoose, { mongo } from 'mongoose'
import { IBaseModel } from './base'

export interface IWuwaCharacterModel extends IBaseModel {
    name: string
    photoPath: string
    photoUrl: string
    accentColor: string
    element: string
    sex: string
}

export type IWuwaCharacterDTO = mongo.WithId<IWuwaCharacterModel>

export const WuwaCharacterModel = {
    getCollection: () => mongoose.connection.collection<IWuwaCharacterModel>('wuwa_characters'),
}
