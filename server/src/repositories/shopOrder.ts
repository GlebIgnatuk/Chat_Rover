import { ClientSession, mongo } from 'mongoose'
import { ID } from './types'
import { IShopOrderDTO, IShopOrderStatus } from '@/models/shopOrder'
import { IUserDTO } from '@/models/user'
import { IShopCurrency } from '@/config/config'

export type IShopOrderListItemDTO = mongo.WithId<{
    status: IShopOrderStatus
    processedCount: number
    totalCount: number
    price: Record<IShopCurrency, number>
}>

export type IShopOrderAdminListItemDTO = mongo.WithId<{
    status: IShopOrderStatus
    user: Pick<IUserDTO, '_id' | 'nickname'>
    processedCount: number
    totalCount: number
    price: Record<IShopCurrency, number>
}>

export type IShopOrderCreate = {
    userId: ID
    products: {
        productId: ID
        currency: IShopCurrency
    }[]
}

export interface IShopOrderRepository {
    get(id: ID): Promise<IShopOrderDTO | null>
    list(userId: ID, status?: IShopOrderStatus): Promise<IShopOrderListItemDTO[]>
    listAdmin(status?: IShopOrderStatus): Promise<IShopOrderAdminListItemDTO[]>
    create(payload: IShopOrderCreate): Promise<IShopOrderDTO>
    cancel(id: ID): Promise<IShopOrderDTO | null>
    // @todo
    // refund(id: ID): Promise<IShopOrderDTO | null>
    markAsProcessed(id: ID): Promise<IShopOrderDTO | null>
    markAsPending(id: ID): Promise<IShopOrderDTO | null>
    markProductAsProcessed(orderId: ID, productId: ID): Promise<IShopOrderDTO | null>
    markProductAsPending(orderId: ID, productId: ID): Promise<IShopOrderDTO | null>
}
