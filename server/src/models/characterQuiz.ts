import mongoose, { Types } from 'mongoose'
import { IBaseModel } from './base'

export interface ICharacterQuizModel extends IBaseModel {
    name: string
    characterId: Types.ObjectId
    photoPath: string
    x: number
    y: number
    scheduledAt: Date
}

export type ICharacterQuizDTO = mongoose.mongo.WithId<ICharacterQuizModel>

export const CharacterQuizModel = {
    getCollection: () => mongoose.connection.collection<ICharacterQuizModel>('character_quizzes'),
}
