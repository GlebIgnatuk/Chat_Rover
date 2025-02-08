import { IAuthorizedRequestHandler } from '../types'

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const games = await repositories.game.list()

        res.json({ success: true, data: games })
    } catch (e) {
        next(e)
    }
}
