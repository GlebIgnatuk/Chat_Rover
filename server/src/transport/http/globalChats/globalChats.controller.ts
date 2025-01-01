import { IGlobalChatDTO } from '@/models/chat'
import { IAuthorizedRequestHandler } from '@/transport/http/types'

export const list: IAuthorizedRequestHandler = async (_, res, next) => {
    try {
        const { repositories, services } = res.locals

        const chats = await repositories.globalChat.list()

        const chatsWithMetadata: (IGlobalChatDTO & { activeSubscribers: number })[] = []
        for (const chat of chats) {
            chatsWithMetadata.push({
                ...chat,
                activeSubscribers: services.globalChat.getSubscribersCount(chat.slug),
            })
        }

        res.json({ success: true, data: chatsWithMetadata })
    } catch (e) {
        next(e)
    }
}
