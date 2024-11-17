import { IProfileDTO, ProfileModel } from '@/models/profile'
import { ID } from '../types'
import {
    IProfileCreate,
    IProfileRepository,
    IProfileUpdate,
    IProfileSearchParams,
    ITeamSearchParams,
    ISearchedProfileDTO,
} from '../profile'
import mongoose, { ClientSession, Types } from 'mongoose'
import { IUserRepository } from '../user'
import { UserModel } from '@/models/user'

export class ProfileRepository implements IProfileRepository {
    private readonly userRepo: IUserRepository

    constructor(userRepo: IUserRepository) {
        this.userRepo = userRepo
    }

    async get(id: ID, tx?: ClientSession): Promise<IProfileDTO | null> {
        return ProfileModel.getCollection().findOne(
            { _id: new Types.ObjectId(id) },
            { session: tx },
        )
    }

    async getByUserId(userId: ID): Promise<IProfileDTO[] | null> {
        return ProfileModel.getCollection()
            .find({ userId: new Types.ObjectId(userId) })
            .toArray()
    }

    async create(payload: IProfileCreate): Promise<IProfileDTO> {
        const now = new Date()

        if (payload.team.length !== 3) {
            throw new Error('Team must be of size 3')
        }

        return await mongoose.connection.withSession(async (session) => {
            const result = await ProfileModel.getCollection().insertOne(
                {
                    ...payload,
                    team: payload.team.map((t) =>
                        t
                            ? {
                                  ...t,
                                  characterId: new Types.ObjectId(t.characterId),
                              }
                            : t,
                    ),
                    userId: new Types.ObjectId(payload.userId),
                    createdAt: now,
                    updatedAt: now,
                },
                { session },
            )

            const profile = await this.get(result.insertedId, session)
            if (!profile) {
                throw new Error('Failed to create a profile.')
            }

            const user = await this.userRepo.patch(payload.userId, {
                state: 'complete',
            })
            if (!user) {
                throw new Error("Failed to updated user's state")
            }

            return profile
        })
    }

    async update(id: ID, payload: IProfileUpdate): Promise<IProfileDTO | null> {
        const now = new Date()

        // Exclude userId from the update payload
        const { userId, ...updatePayload } = payload

        const set: Record<string, any> = { ...updatePayload }

        if (updatePayload.team) {
            set.team = updatePayload.team.map((t) =>
                t
                    ? {
                          ...t,
                          characterId: new Types.ObjectId(t.characterId),
                      }
                    : t,
            )
        }

        await ProfileModel.getCollection().updateOne(
            { _id: new Types.ObjectId(id) },
            {
                $set: {
                    ...set,
                    updatedAt: now,
                },
            },
        )

        return this.get(id)
    }

    async search(params: IProfileSearchParams): Promise<ISearchedProfileDTO[]> {
        const query: Record<string, any> = {}

        if (params.uid !== undefined) {
            query.uid = params.uid
        }

        if (params.nickname !== undefined) {
            query.nickname = params.nickname
        }

        // if either uid or nickname is provided - ignore other filters
        if (Object.keys(query).length === 0) {
            if (params.server !== undefined) {
                query.server = params.server
            }

            if (params.usesVoice !== undefined) {
                query.usesVoice = params.usesVoice
            }

            if (params.languages && params.languages.length > 0) {
                query.languages = { $in: params.languages }
            }

            if (params.minWorldLevel !== undefined) {
                query.worldLevel = query.worldLevel ?? {}
                query.worldLevel.$gte = params.minWorldLevel
            }

            if (params.maxWorldLevel !== undefined) {
                query.worldLevel = query.worldLevel ?? {}
                query.worldLevel.$lte = params.maxWorldLevel
            }

            if (params.team && params.team.length !== 0) {
                query.team = { $all: [] }

                for (const t of params.team) {
                    const match: Record<string, any> = {}

                    if (t.characterId) {
                        match.characterId = new Types.ObjectId(t.characterId)
                    }

                    if (t.minLevel !== undefined) {
                        match.level = match.level ?? {}
                        match.level.$gte = t.minLevel
                    }
                    if (t.maxLevel !== undefined) {
                        match.level = match.level ?? {}
                        match.level.$lte = t.maxLevel
                    }

                    if (t.minConstellation !== undefined) {
                        match.constellation = match.constellation ?? {}
                        match.constellation.$gte = t.minConstellation
                    }
                    if (t.maxConstellation !== undefined) {
                        match.constellation = match.constellation ?? {}
                        match.constellation.$lte = t.maxConstellation
                    }

                    query.team.$all.push({ $elemMatch: match })
                }
            }
        }

        const limit = Math.min(params.limit ?? 10, 100)
        const page = Math.max(params.page ?? 1, 1)

        return await ProfileModel.getCollection()
            .aggregate<ISearchedProfileDTO>([
                {
                    $match: query,
                },
                {
                    $lookup: {
                        from: UserModel.getCollection().name,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $unwind: {
                        path: '$user',
                    },
                },
                {
                    $skip: (page - 1) * limit,
                },
                {
                    $limit: limit,
                },
            ])
            .toArray()
    }
}
