import { IAuthorizedRequestHandler } from '../types'

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const giveawayItems = await repositories.giveawayItem.list()

        res.json({ success: true, data: giveawayItems })
    } catch (e) {
        next(e)
    }
}

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const giveawayItem = await repositories.giveawayItem.create({
            name: req.body.name,
            photoUrl: req.body.photoUrl,
        })

        res.json({ success: true, data: giveawayItem })
    } catch (e) {
        next(e)
    }
}

export const remove: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const giveawayItemId = req.params.id
        const { repositories } = res.locals

        await repositories.giveawayItem.delete(giveawayItemId)

        res.json({ success: true })
    } catch (e) {
        next(e)
    }
}
