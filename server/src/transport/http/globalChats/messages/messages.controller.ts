import { IAuthorizedRequestHandler } from '@/transport/http/types'

export const list: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const slug = req.params.chatId
        const page = Number(req.query.page || '1')
        const limit = Number(req.query.limit || '15')

        const { repositories } = res.locals

        const chat = await repositories.globalChat.getBySlug(slug)
        if (!chat) {
            return res
                .json({
                    success: false,
                    error: 'No such chat',
                })
                .status(400)
        }

        const messages = await repositories.chatMessage.list(chat._id, {
            page: page - 1,
            limit,
        })

        return res.json({
            success: true,
            data: messages.reverse(),
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
        const slug = req.params.chatId

        const { identity, services } = res.locals

        const message = await services.globalChat.sendMessage(
            // @todo migrate to chatId
            slug,
            req.body.text,
            identity,
        )

        return res.json({
            success: true,
            data: message,
        })
    } catch (e) {
        next(e)
    }
}

export const patch: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { chatId, messageId } = req.params
        const text = (req.body.text || '').trim()

        if (text.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Message can't be empty",
            })
        }

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
                error: "You don't have access to this chat",
            })
        }

        const message = await repositories.chatMessage.get(messageId)
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'No such message',
            })
        }

        if (message.createdBy._id.equals(user._id) === false) {
            return res.status(403).json({
                success: false,
                error: "You don't have access to this chat",
            })
        }

        const updatedMessage = await repositories.chatMessage.patch(messageId, {
            text: req.body.text,
        })

        return res.json({
            success: true,
            data: updatedMessage,
        })
    } catch (e) {
        next(e)
    }
}

export const remove: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { chatId, messageId } = req.params
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

        await repositories.chatMessage.delete(messageId)

        return res.json({
            success: true,
        })
    } catch (e) {
        next(e)
    }
}
