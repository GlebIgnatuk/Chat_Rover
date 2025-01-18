import mongoose, { mongo, Types } from 'mongoose'
import { IBaseModel } from './base'

export interface IExpressGiveawayModel extends IBaseModel {
    name: string
    cost: number
    giveawayItemId: Types.ObjectId

    participants: Types.ObjectId[]
    minParticipants: number
    maxParticipants: number

    winners: Types.ObjectId[]
    maxWinners: number

    startedAt: Date | null
    finishedAt: Date | null
    scheduledAt: Date
    durationInSeconds: number
}

export type IExpressGiveawayDTO = mongo.WithId<IExpressGiveawayModel>

export const ExpressGiveawayModel = {
    getCollection: () => mongoose.connection.collection<IExpressGiveawayModel>('express_giveaways'),
}
