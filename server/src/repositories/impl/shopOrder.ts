import mongoose, { ClientSession, Types } from 'mongoose'
import { IShopProductRepository } from '../shopProduct'
import { IShopProductDTO } from '@/models/shopProduct'
import { ID } from '../types'
import {
    IShopOrderAdminListItemDTO,
    IShopOrderCreate,
    IShopOrderListItemDTO,
    IShopOrderRepository,
} from '../shopOrder'
import {
    IShopOrderStatus,
    IShopOrderDTO,
    ShopOrderModel,
    IShopOrderModel,
} from '@/models/shopOrder'
import { IUserRepository } from '../user'
import { UserModel } from '@/models/user'

export class ShopOrderRepository implements IShopOrderRepository {
    private readonly shopProductRepo: IShopProductRepository
    private readonly userRepo: IUserRepository

    constructor(shopProductRepo: IShopProductRepository, userRepo: IUserRepository) {
        this.shopProductRepo = shopProductRepo
        this.userRepo = userRepo
    }

    async create(payload: IShopOrderCreate): Promise<IShopOrderDTO> {
        return await mongoose.connection.withSession(async (tx) => {
            const productsIds = Array.from(new Set(payload.products.map((p) => p.productId)))
            const products = await this.shopProductRepo.findMany(productsIds, tx)

            if (products.length !== productsIds.length) {
                throw new Error('Some products were not found')
            }

            const productsIndexed = products.reduce<Record<string, IShopProductDTO>>(
                (acc, n) => ({ ...acc, [n._id.toString()]: n }),
                {},
            )

            const orderedProducts: IShopOrderModel['products'] = []
            let toCharge = 0
            for (const requestedProduct of payload.products) {
                const product = productsIndexed[requestedProduct.productId.toString()]
                if (!product) throw new Error('Product was not found')

                const price = product.prices.find(
                    (price) => price.currency === requestedProduct.currency,
                )
                if (!price) throw new Error('Price was not found')

                switch (price.currency) {
                    case 'XLNT':
                        {
                            toCharge += price.price
                        }
                        break

                    default:
                        break
                }

                orderedProducts.push({
                    _id: new Types.ObjectId(),
                    productId: product._id,
                    name: product.name,
                    category: product.category,
                    photoPath: product.photoPath,
                    currency: price.currency,
                    price: price.price,
                    processed: false,
                })
            }

            if (toCharge > 0) {
                await this.userRepo.chargeBalance(payload.userId, toCharge, tx)
            }

            const now = new Date()
            const result = await ShopOrderModel.getCollection().insertOne(
                {
                    products: orderedProducts,
                    status: 'pending',
                    userId: new Types.ObjectId(payload.userId),
                    createdAt: now,
                    updatedAt: now,
                },
                { session: tx },
            )

            const order = await this.get(result.insertedId, tx)
            if (!order) {
                throw new Error('Faield to create order')
            }

            return order
        })
    }

    async list(userId: ID, status?: IShopOrderStatus): Promise<IShopOrderListItemDTO[]> {
        const filter: Record<string, any> = {
            userId: new Types.ObjectId(userId),
        }
        if (status !== undefined) {
            filter.status = status
        }

        const orders = await ShopOrderModel.getCollection()
            .aggregate<IShopOrderListItemDTO & { products: IShopOrderModel['products'] }>([
                { $match: filter },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $addFields: {
                        processedCount: {
                            $size: {
                                $filter: {
                                    input: '$products',
                                    as: 'p',
                                    cond: {
                                        $eq: ['$$p.processed', true],
                                    },
                                },
                            },
                        },
                        totalCount: {
                            $size: '$products',
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        processedCount: 1,
                        totalCount: 1,
                        products: 1,
                    },
                },
            ])
            .toArray()

        return orders.map((o) => {
            return {
                ...o,
                products: undefined,
                price: o.products.reduce<Record<string, number>>((acc, n) => {
                    if (acc[n.currency] === undefined) acc[n.currency] = 0
                    acc[n.currency] += n.price
                    return acc
                }, {}),
            }
        })
    }

    async listAdmin(status?: IShopOrderStatus): Promise<IShopOrderAdminListItemDTO[]> {
        const filter: Record<string, any> = {}
        if (status !== undefined) {
            filter.status = status
        }

        const orders = await ShopOrderModel.getCollection()
            .aggregate<IShopOrderAdminListItemDTO & { products: IShopOrderModel['products'] }>([
                { $match: filter },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: UserModel.getCollection().name,
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $unwind: {
                        path: '$user',
                    },
                },
                {
                    $addFields: {
                        processedCount: {
                            $size: {
                                $filter: {
                                    input: '$products',
                                    as: 'p',
                                    cond: {
                                        $eq: ['$$p.processed', true],
                                    },
                                },
                            },
                        },
                        totalCount: {
                            $size: '$products',
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        status: 1,
                        user: 1,
                        processedCount: 1,
                        totalCount: 1,
                        products: 1,
                    },
                },
            ])
            .toArray()

        return orders.map((o) => {
            return {
                ...o,
                products: undefined,
                price: o.products.reduce<Record<string, number>>((acc, n) => {
                    if (acc[n.currency] === undefined) acc[n.currency] = 0
                    acc[n.currency] += n.price
                    return acc
                }, {}),
            }
        })
    }

    async cancel(id: ID): Promise<IShopOrderDTO | null> {
        return await ShopOrderModel.getCollection().findOneAndUpdate(
            {
                _id: new Types.ObjectId(id),
            },
            {
                $set: {
                    status: 'cancelled',
                },
            },
            {
                returnDocument: 'after',
            },
        )
    }

    // @todo
    // async refund(id: ID): Promise<IShopOrderDTO | null> {
    //     return await ShopOrderModel.getCollection().findOneAndUpdate(
    //         {
    //             _id: new Types.ObjectId(id),
    //         },
    //         {
    //             $set: {
    //                 status: 'refunded',
    //             },
    //         },
    //         {
    //             returnDocument: 'after',
    //         },
    //     )
    // }

    async markAsProcessed(id: ID): Promise<IShopOrderDTO | null> {
        return await ShopOrderModel.getCollection().findOneAndUpdate(
            {
                _id: new Types.ObjectId(id),
            },
            {
                $set: {
                    status: 'processed',
                },
            },
            {
                returnDocument: 'after',
            },
        )
    }

    async markAsPending(id: ID): Promise<IShopOrderDTO | null> {
        return await ShopOrderModel.getCollection().findOneAndUpdate(
            {
                _id: new Types.ObjectId(id),
            },
            {
                $set: {
                    status: 'pending',
                },
            },
            {
                returnDocument: 'after',
            },
        )
    }

    async markProductAsProcessed(orderId: ID, productId: ID): Promise<IShopOrderDTO | null> {
        return await ShopOrderModel.getCollection().findOneAndUpdate(
            {
                _id: new Types.ObjectId(orderId),
                products: { $elemMatch: { _id: new Types.ObjectId(productId) } },
            },
            {
                $set: {
                    'products.$.processed': true,
                },
            },
            {
                returnDocument: 'after',
            },
        )
    }

    async markProductAsPending(orderId: ID, productId: ID): Promise<IShopOrderDTO | null> {
        return await ShopOrderModel.getCollection().findOneAndUpdate(
            {
                _id: new Types.ObjectId(orderId),
                products: { $elemMatch: { _id: new Types.ObjectId(productId) } },
            },
            {
                $set: {
                    'products.$.processed': false,
                },
            },
            {
                returnDocument: 'after',
            },
        )
    }

    async get(id: ID, tx?: ClientSession): Promise<IShopOrderDTO | null> {
        return ShopOrderModel.getCollection().findOne(
            {
                _id: new Types.ObjectId(id),
            },
            { session: tx },
        )
    }
}
