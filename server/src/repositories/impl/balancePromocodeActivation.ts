import {
    IBalancePromocodeActivationCreate,
    IBalancePromocodeActivationRepository,
} from '../balancePromocodeActivation'
import { ClientSession, Types } from 'mongoose'
import {
    BalancePromocodeActivationModel,
    IBalancePromocodeActivationDTO,
} from '@/models/balancePromocodeActivation'
import { ID } from '../types'

export class BalancePromocodeActivationRepository implements IBalancePromocodeActivationRepository {
    async get(id: ID, tx?: ClientSession): Promise<IBalancePromocodeActivationDTO | null> {
        return BalancePromocodeActivationModel.getCollection().findOne(
            {
                _id: new Types.ObjectId(id),
            },
            { session: tx },
        )
    }

    async create(
        payload: IBalancePromocodeActivationCreate,
        tx?: ClientSession,
    ): Promise<IBalancePromocodeActivationDTO> {
        const existing = await BalancePromocodeActivationModel.getCollection().findOne(
            {
                balancePromocodeId: new Types.ObjectId(payload.balancePromocodeId),
                userId: new Types.ObjectId(payload.userId),
            },
            { projection: { _id: 1 }, session: tx },
        )
        if (existing) {
            throw new Error('Promocode has been already activated')
        }

        const now = new Date()

        const result = await BalancePromocodeActivationModel.getCollection().insertOne(
            {
                balancePromocodeId: new Types.ObjectId(payload.balancePromocodeId),
                userId: new Types.ObjectId(payload.userId),
                createdAt: now,
                updatedAt: now,
            },
            { session: tx },
        )

        const activation = await this.get(result.insertedId, tx)
        if (!activation) {
            throw new Error('Failed to create promocode activation')
        }

        return activation
    }
}
