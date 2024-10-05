import { IAuthorizedRequestHandler } from '../types'

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { repositories } = res.locals

        const characters = await repositories.wuwaCharacter.list()

        return res.json({ success: true, data: characters })
    } catch (e) {
        next(e)
    }
}
