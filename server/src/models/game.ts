import mongoose from 'mongoose'
import { IBaseModel } from './base'

export interface IGameModel extends IBaseModel {
    name: string
    slug: string
    photoPath: string
}

export type IGameDTO = mongoose.mongo.WithId<IGameModel>

export const GameModel = {
    getCollection: () => mongoose.connection.collection<IGameModel>('games'),
}
