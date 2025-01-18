import { ExpressGiveawayModel, IExpressGiveawayDTO } from '@/models/expressGiveaway'
import {
    IExpressGiveawayCreate,
    IExpressGiveawayRepository,
    IListingExpressGiveawayDTO,
} from '../expressGiveaway'
import { ID, RepositoryError } from '../types'
import mongoose, { mongo, Types } from 'mongoose'
import { IGiveawayItemRepository } from '../giveawayItem'
import { GiveawayItemModel } from '@/models/giveawayItem'
import { UserModel } from '@/models/user'
import { IUserRepository } from '../user'

export class ExpressGiveawayRepository implements IExpressGiveawayRepository {
    private readonly userRepo: IUserRepository
    private readonly giveawayItemRepo: IGiveawayItemRepository

    constructor(userRepo: IUserRepository, giveawayItemRepo: IGiveawayItemRepository) {
        this.userRepo = userRepo
        this.giveawayItemRepo = giveawayItemRepo
    }

    async get(id: ID): Promise<IExpressGiveawayDTO | null> {
        return ExpressGiveawayModel.getCollection().findOne({ _id: new Types.ObjectId(id) })
    }

    async list(): Promise<IExpressGiveawayDTO[]> {
        return ExpressGiveawayModel.getCollection().find({}, { limit: 20 }).toArray()
    }

    async listInListing(userId: ID): Promise<IListingExpressGiveawayDTO[]> {
        const common = [
            {
                $lookup: {
                    from: GiveawayItemModel.getCollection().name,
                    localField: 'giveawayItemId',
                    foreignField: '_id',
                    as: 'giveawayItem',
                },
            },
            {
                $unwind: {
                    path: '$giveawayItem',
                },
            },
            {
                $lookup: {
                    from: UserModel.getCollection().name,
                    localField: 'winners',
                    foreignField: '_id',
                    as: 'winners',
                },
            },
            {
                $addFields: {
                    participants: {
                        $size: '$participants',
                    },
                    isParticipating: {
                        $in: [new Types.ObjectId(userId), '$participants'],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    cost: 1,
                    giveawayItem: 1,
                    participants: 1,
                    minParticipants: 1,
                    maxParticipants: 1,
                    isParticipating: 1,
                    winners: 1,
                    maxWinners: 1,
                    startedAt: 1,
                    finishedAt: 1,
                    createdAt: 1,
                    durationInSeconds: 1,
                },
            },
        ]

        const [result] = await ExpressGiveawayModel.getCollection()
            .aggregate<{
                previous: IListingExpressGiveawayDTO[]
                actual: IListingExpressGiveawayDTO[]
            }>([
                { $match: { scheduledAt: { $lte: new Date() } } },
                {
                    $facet: {
                        previous: [
                            { $match: { finishedAt: { $ne: null } } },
                            { $sort: { scheduledAt: -1 } },
                            { $limit: 10 },
                            ...common,
                        ],
                        actual: [
                            { $match: { finishedAt: null } },
                            { $sort: { scheduledAt: 1 } },
                            { $limit: 1 },
                            ...common,
                        ],
                    },
                },
            ])
            .toArray()

        return result.actual.concat(result.previous)
    }

    async create(payload: IExpressGiveawayCreate): Promise<IExpressGiveawayDTO> {
        const now = new Date()

        const giveawayItem = await this.giveawayItemRepo.get(payload.giveawayItemId)
        if (!giveawayItem) throw new Error('Giveaway item does not exist')

        const result = await ExpressGiveawayModel.getCollection().insertOne({
            name: payload.name,
            cost: payload.cost,
            giveawayItemId: giveawayItem._id,

            participants: [],
            minParticipants: payload.minParticipants,
            maxParticipants: payload.maxParticipants,

            winners: [],
            maxWinners: payload.maxWinners,

            startedAt: null,
            finishedAt: null,
            scheduledAt: null,
            durationInSeconds: payload.durationInSeconds,

            createdAt: now,
            updatedAt: now,
        })

        const giveaway = await this.get(result.insertedId)
        if (!giveaway) throw new Error('Failed to create giveaway')

        return giveaway
    }

    async addParticipant(userId: ID, giveawayId: ID): Promise<void> {
        await mongoose.connection.withSession(async (session) => {
            return session.withTransaction(async (session) => {
                const now = new Date()

                // lock record
                const lockedGiveaway = await ExpressGiveawayModel.getCollection().findOneAndUpdate(
                    {
                        _id: new Types.ObjectId(giveawayId),
                    },
                    { $set: { updatedAt: now } },
                    { session },
                )
                if (!lockedGiveaway) throw new RepositoryError('Giveaway does not exist')

                // charge user
                if (lockedGiveaway.cost !== 0) {
                    const user = await this.userRepo.chargeBalance(
                        userId,
                        lockedGiveaway.cost,
                        session,
                    )
                    if (!user) {
                        throw new RepositoryError('No such user')
                    }
                }

                const [giveaway] = await ExpressGiveawayModel.getCollection()
                    .aggregate<
                        mongo.WithId<{
                            participants: number
                            minParticipants: number
                            maxParticipants: number
                            isParticipating: boolean
                            winners: number
                            startedAt: Date | null
                            finishedAt: Date | null
                            durationInSeconds: number
                        }>
                    >(
                        [
                            { $match: { _id: new Types.ObjectId(giveawayId) } },
                            { $limit: 1 },
                            {
                                $addFields: {
                                    participants: {
                                        $size: '$participants',
                                    },
                                    winners: {
                                        $size: '$winners',
                                    },
                                    isParticipating: {
                                        $in: [new Types.ObjectId(userId), '$participants'],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                    participants: 1,
                                    winners: 1,
                                    minParticipants: 1,
                                    maxParticipants: 1,
                                    isParticipating: 1,
                                    startedAt: 1,
                                    finishedAt: 1,
                                    durationInSeconds: 1,
                                },
                            },
                        ],
                        { session },
                    )
                    .toArray()

                // Verify giveaway is available
                if (!giveaway) {
                    throw new RepositoryError('Giveaway does not exist')
                }

                if (giveaway.finishedAt) {
                    throw new RepositoryError('Giveaway has ended')
                }

                if (
                    giveaway.startedAt &&
                    (Date.now() - giveaway.startedAt.getTime()) / 1000 -
                        giveaway.durationInSeconds >=
                        -60
                ) {
                    throw new RepositoryError('Giveaway has been locked')
                }

                if (giveaway.participants >= giveaway.maxParticipants) {
                    throw new RepositoryError('Participants limit has been reached')
                }

                if (giveaway.isParticipating) {
                    throw new RepositoryError('Already participating')
                }

                // add user to participants
                const result = await ExpressGiveawayModel.getCollection().updateOne(
                    {
                        _id: new Types.ObjectId(giveawayId),
                    },
                    {
                        $push: {
                            participants: new Types.ObjectId(userId),
                        },
                        $set: {
                            startedAt:
                                giveaway.startedAt ??
                                (giveaway.participants + 1 >= giveaway.minParticipants
                                    ? new Date()
                                    : null),
                        },
                    },
                    { session },
                )

                if (result.modifiedCount === 0) {
                    throw new Error('Failed to add participant')
                }
            })
        })
    }

    async delete(id: ID): Promise<void> {
        await ExpressGiveawayModel.getCollection().deleteOne({ _id: new Types.ObjectId(id) })
    }
}
