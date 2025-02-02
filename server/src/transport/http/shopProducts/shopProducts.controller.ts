import { IAuthorizedRequestHandler } from '../types'

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const products = await repositories.shopProduct.list()

        res.json({ success: true, data: products })
    } catch (e) {
        next(e)
    }
}
