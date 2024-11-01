import { IAuthorizedRequestHandler } from '../types'

export const list: IAuthorizedRequestHandler = async (_, res, next) => {
    try {
        const { repositories } = res.locals


        const chats = await repositories.globalChat.list()

        console.log("Chats from controller: ", chats)

        res.json(chats)
    } catch (e) {
        next(e)
    }
}