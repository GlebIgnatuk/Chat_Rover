import { IUserDTO, UserModel } from '@/models/user'
import { ID } from '../types'
import { IUserCreate, IUserRepository } from '../user'
import { Types } from 'mongoose'

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

        const result = await UserModel.getCollection().insertOne({
            externalId: payload.externalId,
            language: payload.language,
            nickname: payload.nickname,
            profile: null,
            createdAt: now,
            updatedAt: now,
        })

        const user = await this.get(result.insertedId)
        if (!user) {
            throw new Error('Failed to create a user.')
        }

        return user
    }

    async delete(id: ID): Promise<void> {
        await UserModel.getCollection().deleteOne({ _id: new Types.ObjectId(id) })
    }

    async deleteByExternalId(id: number): Promise<void> {
        await UserModel.getCollection().deleteOne({ externalId: id })
    }
}
