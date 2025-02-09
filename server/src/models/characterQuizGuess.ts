import mongoose, { Types } from 'mongoose'
import { IBaseModel } from './base'

export interface ICharacterQuizGuessModel extends IBaseModel {
    quizId: Types.ObjectId
    userId: Types.ObjectId
    guesses: Types.ObjectId[]
    guessedAt: Date | null
}

export type ICharacterQuizGuessDTO = mongoose.mongo.WithId<ICharacterQuizGuessModel>

export const CharacterQuizGuessModel = {
    getCollection: () =>
        mongoose.connection.collection<ICharacterQuizGuessModel>('character_quiz_guesses'),
}
