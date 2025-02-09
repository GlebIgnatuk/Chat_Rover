import { CharacterQuizModel, ICharacterQuizDTO } from '@/models/characterQuiz'
import {
    ICharacterQuizCreate,
    ICharacterQuizRepository,
    ITodayCharacterQuizDTO,
    ITomorrowCharacterQuizDTO,
} from '../characterQuiz'
import { ID } from '../types'
import mongoose, { ClientSession, Types } from 'mongoose'
import { CharacterQuizGuessModel, ICharacterQuizGuessDTO } from '@/models/characterQuizGuess'
import { IWuwaCharacterRepository } from '../wuwaCharacter'

export class CharacterQuizRepository implements ICharacterQuizRepository {
    private readonly wuwaCharacterRepo: IWuwaCharacterRepository

    constructor(wuwaCharacterRepo: IWuwaCharacterRepository) {
        this.wuwaCharacterRepo = wuwaCharacterRepo
    }

    async create(payload: ICharacterQuizCreate): Promise<ICharacterQuizDTO> {
        const now = new Date()

        const character = await this.wuwaCharacterRepo.get(payload.characterId)
        if (!character) {
            throw new Error('No such characteer')
        }

        const windowSize = 64

        // @todo remove hardcoded image size
        const imgWidth = 330
        const imgHeight = 650

        const xMax = imgWidth / windowSize - 0.3
        const yMax = imgHeight / windowSize - 0.3

        const xMin = 0.3
        const yMin = 0.3

        const x = Math.random() * (xMax - xMin) + xMin
        const y = Math.random() * (yMax - yMin) + yMin

        const result = await CharacterQuizModel.getCollection().insertOne({
            name: payload.name,
            characterId: character._id,
            photoPath: character.photoPath,
            x,
            y,
            scheduledAt: payload.scheduledAt,
            createdAt: now,
            updatedAt: now,
        })

        const quiz = await this.get(result.insertedId)
        if (!quiz) {
            throw new Error('Failed to create character quiz')
        }

        return quiz
    }

    async get(id: ID, tx?: ClientSession): Promise<ICharacterQuizDTO | null> {
        return CharacterQuizModel.getCollection().findOne(
            { _id: new Types.ObjectId(id) },
            { session: tx },
        )
    }

    async getToday(): Promise<ITodayCharacterQuizDTO | null> {
        const quiz = await CharacterQuizModel.getCollection().findOne(
            { scheduledAt: { $lte: new Date() } },
            { sort: { scheduledAt: -1 } },
        )
        if (!quiz) return null

        const guessedCount = await CharacterQuizGuessModel.getCollection().countDocuments({
            quizId: quiz._id,
            guessedAt: { $ne: null },
        })

        return {
            ...quiz,
            guessedCount,
        }
    }

    async getTomorrow(): Promise<ITomorrowCharacterQuizDTO | null> {
        return CharacterQuizModel.getCollection().findOne(
            { scheduledAt: { $gt: new Date() } },
            { sort: { scheduledAt: 1 }, projection: { _id: 1, scheduledAt: 1 } },
        )
    }

    async getGuess(userId: ID, quizId: ID): Promise<ICharacterQuizGuessDTO | null> {
        return CharacterQuizGuessModel.getCollection().findOne({
            userId: new Types.ObjectId(userId),
            quizId: new Types.ObjectId(quizId),
        })
    }

    async guess(userId: ID, quizId: ID, characterId: ID): Promise<ICharacterQuizGuessDTO> {
        return await mongoose.connection.withSession(async (session) => {
            const now = new Date()

            const quiz = await this.get(quizId, session)
            if (!quiz) {
                throw new Error('No such quiz')
            }

            const guessed = quiz.characterId.equals(characterId)

            const guess = await CharacterQuizGuessModel.getCollection().findOneAndUpdate(
                {
                    userId: new Types.ObjectId(userId),
                    quizId: new Types.ObjectId(quizId),
                },
                {
                    $set: { updatedAt: now, guessedAt: guessed ? now : null },
                    $push: { guesses: new Types.ObjectId(characterId) },
                    $setOnInsert: {
                        quizId: new Types.ObjectId(quizId),
                        userId: new Types.ObjectId(userId),
                        createdAt: now,
                    },
                },
                { returnDocument: 'after', upsert: true },
            )
            if (!guess) {
                throw new Error('Failed to create guess')
            }

            if (guess.guessedAt === null && guessed) {
                throw new Error('Already guessed')
            }

            return guess
        })
    }
}
