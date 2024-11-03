import { IAuthorizedRequestHandler } from '@/transport/http/types'

export const list: IAuthorizedRequestHandler = async (_, res, next) => {
    try {
        const { repositories } = res.locals

        const chats = await repositories.globalChat.list()

        res.json({ success: true, data: chats })
    } catch (e) {
        next(e)
    }
}
