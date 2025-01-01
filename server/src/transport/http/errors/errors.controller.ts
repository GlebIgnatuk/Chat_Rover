import { IRequestHandler } from '../types'

export const create: IRequestHandler = async (req, res, next) => {
    try {
        const { repositories, identity } = res.locals

        await repositories.error.create({
            name: req.body.name,
            message: req.body.message,
            stack: req.body.stack,
            externalUserId: identity?.user.id,
            location: req.body.location,
        })

        res.json({ success: true })
    } catch (e) {
        next(e)
    }
}
