import { ICharacterQuizDTO } from '@/models/characterQuiz'
import { ID } from './types'
import { ICharacterQuizGuessDTO } from '@/models/characterQuizGuess'
import { mongo } from 'mongoose'

export type ICharacterQuizCreate = {
    name: string
    characterId: ID
    scheduledAt: Date
}

export type ITodayCharacterQuizDTO = mongo.WithId<{
    guessedCount: number
}>

export type ITomorrowCharacterQuizDTO = mongo.WithId<{
    scheduledAt: Date
}>

export interface ICharacterQuizRepository {
    create(payload: ICharacterQuizCreate): Promise<ICharacterQuizDTO>
    get(id: ID): Promise<ICharacterQuizDTO | null>
    getToday(): Promise<ITodayCharacterQuizDTO | null>
    getTomorrow(): Promise<ITomorrowCharacterQuizDTO | null>
    guess(userId: ID, quizId: ID, characterId: ID): Promise<ICharacterQuizGuessDTO>
    getGuess(userId: ID, quizId: ID): Promise<ICharacterQuizGuessDTO | null>
}
