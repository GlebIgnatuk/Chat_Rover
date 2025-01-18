import { GiveawayItemModel, IGiveawayItemDTO } from '@/models/giveawayItem'
import { IGiveawayItemCreate, IGiveawayItemRepository } from '../giveawayItem'
import { ID } from '../types'
import { Types } from 'mongoose'

export class GiveawayItemRepository implements IGiveawayItemRepository {
    async get(id: ID): Promise<IGiveawayItemDTO | null> {
        return GiveawayItemModel.getCollection().findOne({ _id: new Types.ObjectId(id) })
    }

    async list(): Promise<IGiveawayItemDTO[]> {
        return GiveawayItemModel.getCollection().find().toArray()
    }

    async create(payload: IGiveawayItemCreate) {
        const now = new Date()

        const result = await GiveawayItemModel.getCollection().insertOne({
            name: payload.name,
            photoPath: payload.photoPath,
            createdAt: now,
            updatedAt: now,
        })

        const item = await this.get(result.insertedId)
        if (!item) throw new Error('Failed to create giveaway item')

        return item
    }

    async delete(id: ID): Promise<void> {
        await GiveawayItemModel.getCollection().deleteOne({ _id: new Types.ObjectId(id) })
    }
}
