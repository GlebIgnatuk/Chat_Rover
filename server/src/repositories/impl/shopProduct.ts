import { ClientSession, Types } from 'mongoose'
import { IShopProductCreate, IShopProductRepository } from '../shopProduct'
import { IShopProductDTO, ShopProductModel } from '@/models/shopProduct'
import { ID } from '../types'

export class ShopProductRepository implements IShopProductRepository {
    async get(id: ID, tx?: ClientSession): Promise<IShopProductDTO | null> {
        return ShopProductModel.getCollection().findOne(
            {
                _id: new Types.ObjectId(id),
            },
            { session: tx },
        )
    }

    async list(): Promise<IShopProductDTO[]> {
        return ShopProductModel.getCollection().find().toArray()
    }

    async findMany(ids: ID[], tx?: ClientSession): Promise<IShopProductDTO[]> {
        return ShopProductModel.getCollection()
            .find(
                {
                    _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
                },
                { session: tx },
            )
            .toArray()
    }

    async create(payload: IShopProductCreate): Promise<IShopProductDTO> {
        const now = new Date()

        const result = await ShopProductModel.getCollection().insertOne({
            name: payload.name,
            category: payload.category,
            photoPath: payload.photoPath,
            prices: payload.prices,
            gameId: payload.gameId ? new Types.ObjectId(payload.gameId) : null,
            createdAt: now,
            updatedAt: now,
        })

        const product = await this.get(result.insertedId)
        if (!product) {
            throw new Error('Faield to create shop product')
        }

        return product
    }
}
