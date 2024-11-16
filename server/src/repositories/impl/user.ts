import { IUserDTO, IUserState, UserModel } from '@/models/user'
import { ID } from '../types'
import { IUserCreate, IUserPatch, IUserRepository } from '../user'
import { ClientSession, Types } from 'mongoose'

export class UserRepository implements IUserRepository {
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
            createdAt: now,
            updatedAt: now,
            lastActivityAt: now,
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
