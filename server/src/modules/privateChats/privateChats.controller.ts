import { IAuthorizedRequestHandler } from "../types";


export const listMyChats: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { identity, repositories } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found'
            })
        }

        const chats = await repositories.privateChat.listMyChats(user._id)

        return res.json({ success: true, data: chats })
    } catch (e) {
        next(e)
    }
}

export const create: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const { identity, repositories } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found'
            })
        }

        const peer = await repositories.user.get(req.body.peerId)
        if (!peer) {
            return res.status(400).json({
                success: false,
                error: 'Peer not found'
            })
        }

        const existingChat = await repositories.privateChat.findByPeer(user._id, peer._id)
        if (existingChat) {
            return res.status(400).json({
                success: false,
                error: 'Chat already exists'
            })
        }

        const chat = await repositories.privateChat.create({
            userId: user._id,
            peerId: peer._id
        })

        return res.json({ success: true, data: chat })
    } catch (e) {
        next(e)
    }
}

export const remove: IAuthorizedRequestHandler = async (req, res, next) => {
    try {
        const chatId = req.params.chatId
        const { identity, repositories } = res.locals

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'User not found'
            })
        }

        const chat = await repositories.privateChat.hasMember(chatId, user._id)
        if (!chat) {
            return res.status(400).json({
                success: false,
                error: 'Invalid chat id'
            })
        }

        await repositories.privateChat.delete(chatId)

        return res.json({ success: true })
    } catch (e) {
        next(e)
    }
}