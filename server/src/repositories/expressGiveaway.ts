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
    scheduledAt: Date
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

export type IAdminExpressGiveawayListItem = mongo.WithId<{
    _id: string
    name: string

    participants: number
    maxParticipants: number

    winners: (Pick<IPublicUserDTO, '_id' | 'nickname'> & { processed: boolean })[]

    giveawayItem: IGiveawayItemDTO

    finishedAt: string
}>

export interface IExpressGiveawayRepository {
    list(): Promise<IExpressGiveawayDTO[]>
    listInListing(userId: ID): Promise<IListingExpressGiveawayDTO[]>
    listAdmin(): Promise<IAdminExpressGiveawayListItem[]>
    markWinnerAsProcessed(giveawayId: ID, winnerId: ID): Promise<IAdminExpressGiveawayListItem>
    markWinnerAsPending(giveawayId: ID, winnerId: ID): Promise<IAdminExpressGiveawayListItem>
    rerollWinner(giveawayId: ID, winnerId: ID): Promise<IAdminExpressGiveawayListItem>
    create(payload: IExpressGiveawayCreate): Promise<IExpressGiveawayDTO>
    addParticipant(userId: ID, giveawayId: ID): Promise<void>
    // patch(payload: IExpressGiveawayCreate): Promise<IExpressGiveawayDTO>
    delete(id: ID): Promise<void>
}
