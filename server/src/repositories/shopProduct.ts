import { ClientSession } from 'mongoose'
import { ID } from './types'
import { IShopProductDTO } from '@/models/shopProduct'

export interface IShopProductRepository {
    get(id: ID, tx?: ClientSession): Promise<IShopProductDTO | null>
    findMany(ids: ID[], tx?: ClientSession): Promise<IShopProductDTO[]>
}
