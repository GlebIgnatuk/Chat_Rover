import mongoose, { mongo } from 'mongoose'
import { IBaseModel } from './base'

export interface IGiveawayItemModel extends IBaseModel {
    name: string
    photoPath: string
}

export type IGiveawayItemDTO = mongo.WithId<IGiveawayItemModel>

export const GiveawayItemModel = {
    getCollection: () => mongoose.connection.collection<IGiveawayItemModel>('giveaway_items'),
}
