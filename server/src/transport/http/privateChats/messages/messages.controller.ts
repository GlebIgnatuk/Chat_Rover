import { IAuthorizedRequestHandler } from '@/transport/http/types'

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const chatId = req.params.chatId
        const page = Number(req.query.page || '1')
        const limit = Number(req.query.limit || '15')

        const { identity, repositories } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'No such user',
            })
        }

        const hasAccess = await repositories.privateChat.hasMember(chatId, user._id)
        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                error: "You don' have access to this chat",
            })
        }

        const messages = await repositories.chatMessage.list(chatId, {
            page: page - 1,
            limit,
        })

        return res.json({
            success: true,
            data: messages,
            meta: {
                pagination: {
                    page,
                    itemsPerPage: limit,
                    items: messages.length,
                },
            },
        })
    } catch (e) {
        next(e)
    }
}

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const chatId = req.params.chatId

        const { identity, services } = res.locals

        const message = await services.privateChat.sendMessage(chatId, req.body.text, identity)

        return res.json({
            success: true,
            data: message,
        })
    } catch (e) {
        next(e)
    }
}
