import { IAuthorizedRequestHandler } from '../types'

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
