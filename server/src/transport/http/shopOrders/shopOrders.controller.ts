import { IShopOrderStatus, SHOP_ORDER_STATUSES } from '@/models/shopOrder'
import { IAuthorizedRequestHandler } from '../types'
import { IShopOrderAdminDTO } from '@/repositories/shopOrder'
import { NotificationService } from '@/services/notification'

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories, identity } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.json({ success: false, error: 'No such user' })
        }

        const order = await repositories.shopOrder.create({
            userId: user._id,
            products: req.body,
        })

        res.json({ success: true, data: order })
    } catch (e) {
        next(e)
    }
}

export const get: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const orders = await repositories.shopOrder.get(req.params.id)

        res.json({ success: true, data: orders })
    } catch (e) {
        next(e)
    }
}

export const getAdmin: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const orders = await repositories.shopOrder.getAdmin(req.params.id)

        res.json({ success: true, data: orders })
    } catch (e) {
        next(e)
    }
}

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories, identity } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.json({ success: false, error: 'No such user' })
        }

        const status = req.query.status as IShopOrderStatus | undefined
        if (status && SHOP_ORDER_STATUSES.includes(status) === false) {
            return res.json({ success: false, error: 'invalid status' })
        }

        const orders = await repositories.shopOrder.list(user._id, status)

        res.json({ success: true, data: orders })
    } catch (e) {
        next(e)
    }
}

export const listAdmin: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const status = req.query.status as IShopOrderStatus | undefined
        if (status && SHOP_ORDER_STATUSES.includes(status) === false) {
            return res.json({ success: false, error: 'invalid status' })
        }

        const orders = await repositories.shopOrder.listAdmin(status)

        res.json({ success: true, data: orders })
    } catch (e) {
        next(e)
    }
}

export const changeStatus: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        let order: IShopOrderAdminDTO | null
        switch (req.body.status) {
            case 'pending':
                {
                    order = await repositories.shopOrder.markAsPending(req.params.id)
                }
                break

            case 'processed':
                {
                    order = await repositories.shopOrder.markAsProcessed(req.params.id)
                }
                break

            case 'cancelled':
                {
                    order = await repositories.shopOrder.cancel(req.params.id)
                }
                break

            default: {
                return res.status(400).json({ success: false, error: 'Invalid status' })
            }
        }

        res.json({ success: true, data: order })
    } catch (e) {
        next(e)
    }
}

export const changeProductStatus: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        let order: IShopOrderAdminDTO | null
        switch (req.body.status) {
            case 'pending':
                {
                    order = await repositories.shopOrder.markProductAsPending(
                        req.params.id,
                        req.params.productId,
                    )
                }
                break

            case 'processed':
                {
                    order = await repositories.shopOrder.markProductAsProcessed(
                        req.params.id,
                        req.params.productId,
                    )
                }
                break

            default: {
                return res.status(400).json({ success: false, error: 'Invalid status' })
            }
        }

        res.json({ success: true, data: order })
    } catch (e) {
        next(e)
    }
}

export const sendOrderReminder: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const order = await repositories.shopOrder.get(req.params.id)
        if (!order) {
            return res.status(400).json({ success: false, error: 'No such order' })
        }

        const user = await repositories.user.get(order.userId)
        if (!user) {
            return res.status(400).json({ success: false, error: 'No such user' })
        }

        await NotificationService.sendOrderReminder(user, order)

        res.json({ success: true })
    } catch (e) {
        next(e)
    }
}
