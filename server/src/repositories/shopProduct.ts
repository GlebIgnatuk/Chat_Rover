import { ClientSession } from 'mongoose'
import { ID } from './types'
import { IShopProductDTO } from '@/models/shopProduct'
import { IShopCurrency } from '@/config/config'

export type IShopProductCreate = {
    name: string
    photoPath: string
    category: string
    gameId?: ID
    prices: {
        currency: IShopCurrency
        price: number
    }[]
}

export interface IShopProductRepository {
    get(id: ID, tx?: ClientSession): Promise<IShopProductDTO | null>
    list(): Promise<IShopProductDTO[]>
    findMany(ids: ID[], tx?: ClientSession): Promise<IShopProductDTO[]>
    create(payload: IShopProductCreate): Promise<IShopProductDTO>
}
