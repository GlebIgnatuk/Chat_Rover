import mongoose, { mongo } from 'mongoose'
import { IBaseModel } from './base'
import { IShopCurrency } from '@/config/config'

export interface IShopProductModel extends IBaseModel {
    name: string
    photoPath: string
    category: string
    prices: {
        currency: IShopCurrency
        price: number
    }[]
}

export type IShopProductDTO = mongo.WithId<IShopProductModel>

export const ShopProductModel = {
    getCollection: () => mongoose.connection.collection<IShopProductModel>('shop_products'),
}
