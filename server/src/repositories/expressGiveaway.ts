import { IExpressGiveawayDTO } from '@/models/expressGiveaway'
import { ID } from './types'
import { mongo } from 'mongoose'
import { IGiveawayItemDTO } from '@/models/giveawayItem'
import { IPublicUserDTO } from '@/models/user'

export interface IExpressGiveawayCreate {
    name: string
    cost: number
    giveawayItemId: ID

    minParticipants: number
    maxParticipants: number

    maxWinners: number

    durationInSeconds: number
}

export type IListingExpressGiveawayDTO = mongo.WithId<{
    name: string
    cost: number
    giveawayItem: IGiveawayItemDTO

    participants: number
    minParticipants: number
    maxParticipants: number
    isParticipating: boolean

    winners: IPublicUserDTO[]
    maxWinners: number

    startedAt: string | null
    finishedAt: string | null
    createdAt: string
    durationInSeconds: number
}>

export interface IExpressGiveawayRepository {
    list(): Promise<IExpressGiveawayDTO[]>
    listInListing(userId: ID): Promise<IListingExpressGiveawayDTO[]>
    create(payload: IExpressGiveawayCreate): Promise<IExpressGiveawayDTO>
    addParticipant(userId: ID, giveawayId: ID): Promise<void>
    // patch(payload: IExpressGiveawayCreate): Promise<IExpressGiveawayDTO>
    delete(id: ID): Promise<void>
}
