import { BalancePromocodeModel, IBalancePromocodeDTO } from '@/models/balancePromocode'
import { IBalancePromocodeCreate, IBalancePromocodeRepository } from '../balancePromocode'
import { ID } from '../types'
import { ClientSession, Types } from 'mongoose'

export class BalancePromocodeRepository implements IBalancePromocodeRepository {
    async get(id: ID): Promise<IBalancePromocodeDTO | null> {
        return BalancePromocodeModel.getCollection().findOne({ _id: new Types.ObjectId(id) })
    }

    async create(payload: IBalancePromocodeCreate): Promise<IBalancePromocodeDTO> {
        const now = new Date()

        const result = await BalancePromocodeModel.getCollection().insertOne({
            code: payload.code,
            value: payload.value,
            expiresAt: payload.expiresAt,
            createdAt: now,
            updatedAt: now,
        })

        const promocode = await this.get(result.insertedId)
        if (!promocode) {
            throw new Error('Failed to create promocode')
        }

        return promocode
    }

    async list(): Promise<IBalancePromocodeDTO[]> {
        return await BalancePromocodeModel.getCollection().find().toArray()
    }

    async findByCode(code: string, session?: ClientSession): Promise<IBalancePromocodeDTO | null> {
        return await BalancePromocodeModel.getCollection().findOne({ code }, { session })
    }

    async expire(id: ID): Promise<IBalancePromocodeDTO | null> {
        const now = new Date()

        return await BalancePromocodeModel.getCollection().findOneAndUpdate(
            { _id: new Types.ObjectId(id) },
            { $set: { expiresAt: now, updatedAt: now } },
            { returnDocument: 'after' },
        )
    }
}
