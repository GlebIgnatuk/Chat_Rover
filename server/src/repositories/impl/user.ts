import { IUserDTO, IUserState, UserModel } from '@/models/user'
import { ID, RepositoryError } from '../types'
import { IUserCreate, IUserPatch, IUserRepository } from '../user'
import mongoose, { ClientSession, Types } from 'mongoose'
import { IBalancePromocodeActivationRepository } from '../balancePromocodeActivation'
import { IBalancePromocodeRepository } from '../balancePromocode'

export class UserRepository implements IUserRepository {
    private readonly balancePromocodeRepo: IBalancePromocodeRepository
    private readonly balancePromocodeActivationRepo: IBalancePromocodeActivationRepository

    constructor(
        balancePromocodeRepo: IBalancePromocodeRepository,
        balancePromocodeActivationRepo: IBalancePromocodeActivationRepository,
    ) {
        this.balancePromocodeRepo = balancePromocodeRepo
        this.balancePromocodeActivationRepo = balancePromocodeActivationRepo
    }

    async get(id: ID): Promise<IUserDTO | null> {
        return UserModel.getCollection().findOne({ _id: new Types.ObjectId(id) })
    }

    async getByExternalId(id: number): Promise<IUserDTO | null> {
        return UserModel.getCollection().findOne({ externalId: id })
    }

    async search({ exceptFor }: { exceptFor: ID }): Promise<IUserDTO[]> {
        return UserModel.getCollection()
            .find({
                _id: { $ne: new Types.ObjectId(exceptFor) },
            })
            .toArray()
    }

    async create(payload: IUserCreate): Promise<IUserDTO> {
        const now = new Date()

        const state: IUserState = 'created'

        const result = await UserModel.getCollection().insertOne({
            externalId: payload.externalId,
            language: payload.language,
            nickname: payload.nickname,
            state: state,
            balance: 10,
            createdAt: now,
            updatedAt: now,
            lastActivityAt: now,
            // Make it available right away, set to some value to omit nulls
            dailyBonusCollectedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        })

        const user = await this.get(result.insertedId)
        if (!user) {
            throw new Error('Failed to create a user.')
        }

        return user
    }

    async patch(id: ID, payload: IUserPatch, tx?: ClientSession): Promise<IUserDTO | null> {
        const now = new Date()

        const update: Partial<IUserDTO> = {}
        if (payload.state) {
            update.state = payload.state
        }
        if (payload.language) {
            update.language = payload.language
        }
        if (payload.isPremium !== undefined) {
            update.isPremium = payload.isPremium
        }

        const user = await UserModel.getCollection().findOneAndUpdate(
            {
                _id: new Types.ObjectId(id),
            },
            {
                $set: {
                    ...update,
                    updatedAt: now,
                },
            },
            {
                session: tx,
            },
        )

        return user
    }

    async chargeBalance(id: ID, value: number, tx?: ClientSession): Promise<IUserDTO | null> {
        const now = new Date()

        const charge = async (session: ClientSession) => {
            const user = await UserModel.getCollection().findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                { $set: { updatedAt: now } },
                { session, returnDocument: 'after' },
            )
            if (!user) {
                return null
            }

            if (user.balance < value) {
                throw new RepositoryError('Insufficient balance')
            }

            return await UserModel.getCollection().findOneAndUpdate(
                { _id: new Types.ObjectId(id) },
                { $inc: { balance: -value } },
                { session, returnDocument: 'after' },
            )
        }

        if (tx) {
            return charge(tx)
        } else {
            return mongoose.connection.withSession(async (session) => {
                return session.withTransaction(async (session) => {
                    return charge(session)
                })
            })
        }
    }

    async redeemDailyBonus(id: ID): Promise<IUserDTO> {
        const now = new Date()

        return mongoose.connection.withSession(async (session) => {
            return session.withTransaction(async (session) => {
                const user = await UserModel.getCollection().findOneAndUpdate(
                    { _id: new Types.ObjectId(id) },
                    { $set: { updatedAt: now } },
                    { session, returnDocument: 'after' },
                )
                if (!user) {
                    throw new RepositoryError('No such user')
                }

                if (Date.now() - user.dailyBonusCollectedAt.getTime() < 12 * 60 * 60 * 1000) {
                    throw new RepositoryError('Bonus not available')
                }

                const updated = await UserModel.getCollection().findOneAndUpdate(
                    { _id: new Types.ObjectId(id) },
                    { $set: { dailyBonusCollectedAt: now }, $inc: { balance: 1 } },
                    { session, returnDocument: 'after' },
                )
                if (!updated) {
                    throw new RepositoryError('Failed to update user')
                }

                return updated
            })
        })
    }

    async claimBalancePromocode(id: ID, code: string): Promise<IUserDTO> {
        const now = new Date()

        return mongoose.connection.withSession(async (session) => {
            return session.withTransaction(async (session) => {
                const user = await UserModel.getCollection().findOneAndUpdate(
                    { _id: new Types.ObjectId(id) },
                    { $set: { updatedAt: now } },
                    { session, returnDocument: 'after' },
                )
                if (!user) {
                    throw new RepositoryError('No such user')
                }

                const balancePromocode = await this.balancePromocodeRepo.findByCode(code, session)
                if (!balancePromocode) {
                    throw new Error('No such promocode')
                }

                await this.balancePromocodeActivationRepo.create(
                    {
                        balancePromocodeId: balancePromocode._id,
                        userId: user._id,
                    },
                    session,
                )

                const updated = await UserModel.getCollection().findOneAndUpdate(
                    { _id: new Types.ObjectId(id) },
                    { $inc: { balance: balancePromocode.value } },
                    { session, returnDocument: 'after' },
                )
                if (!updated) {
                    throw new RepositoryError('Failed to update user')
                }

                return updated
            })
        })
    }

    async trackActivity(id: ID): Promise<void> {
        const now = new Date()

        const result = await UserModel.getCollection().findOneAndUpdate(
            { _id: new Types.ObjectId(id) },
            { $set: { lastActivityAt: now } },
        )

        if (!result) {
            throw new Error('Failed to update the last activity time.')
        }
    }

    async delete(id: ID): Promise<void> {
        await UserModel.getCollection().deleteOne({ _id: new Types.ObjectId(id) })
    }

    async deleteByExternalId(id: number): Promise<void> {
        await UserModel.getCollection().deleteOne({ externalId: id })
    }
}
