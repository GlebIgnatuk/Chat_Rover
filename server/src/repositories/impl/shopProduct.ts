import { ClientSession, Types } from 'mongoose'
import { IShopProductRepository } from '../shopProduct'
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
}
