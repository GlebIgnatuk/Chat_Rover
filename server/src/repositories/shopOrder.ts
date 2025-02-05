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
    createdAt: string
}>

export type IShopOrderAdminListItemDTO = mongo.WithId<{
    status: IShopOrderStatus
    user: Pick<IUserDTO, '_id' | 'nickname'>
    processedCount: number
    totalCount: number
    price: Record<IShopCurrency, number>
    createdAt: string
}>

export type IShopOrderAdminDTO = Omit<IShopOrderDTO, 'userId'> & {
    user: Pick<IUserDTO, '_id' | 'nickname'>
}

export type IShopOrderCreate = {
    userId: ID
    products: {
        productId: ID
        currency: IShopCurrency
    }[]
}

export interface IShopOrderRepository {
    get(id: ID): Promise<IShopOrderDTO | null>
    getAdmin(id: ID): Promise<IShopOrderAdminDTO | null>
    list(userId: ID, status?: IShopOrderStatus): Promise<IShopOrderListItemDTO[]>
    listAdmin(status?: IShopOrderStatus): Promise<IShopOrderAdminListItemDTO[]>
    create(payload: IShopOrderCreate): Promise<IShopOrderDTO>
    cancel(id: ID): Promise<IShopOrderDTO | null>
    cancelAdmin(id: ID): Promise<IShopOrderAdminDTO | null>
    // @todo
    // refund(id: ID): Promise<IShopOrderDTO | null>
    markAsProcessed(id: ID): Promise<IShopOrderAdminDTO | null>
    markAsPending(id: ID): Promise<IShopOrderAdminDTO | null>
    markProductAsProcessed(orderId: ID, productId: ID): Promise<IShopOrderAdminDTO | null>
    markProductAsPending(orderId: ID, productId: ID): Promise<IShopOrderAdminDTO | null>
}
