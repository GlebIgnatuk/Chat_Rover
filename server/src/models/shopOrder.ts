import mongoose, { mongo, Types } from 'mongoose'
import { IBaseModel } from './base'
import { IShopCurrency } from '@/config/config'

export const SHOP_ORDER_STATUSES = ['pending', 'cancelled', 'processed', 'refunded'] as const
export type IShopOrderStatus = (typeof SHOP_ORDER_STATUSES)[number]

export interface IShopOrderModel extends IBaseModel {
    userId: Types.ObjectId
    products: {
        _id: Types.ObjectId
        productId: Types.ObjectId
        name: string
        photoPath: string
        category: string
        currency: IShopCurrency
        price: number
        processed: boolean
    }[]
    status: IShopOrderStatus
}

export type IShopOrderDTO = mongo.WithId<IShopOrderModel>

export const ShopOrderModel = {
    getCollection: () => mongoose.connection.collection<IShopOrderModel>('shop_orders'),
}
