import { Server } from 'socket.io'
import {
    ValidatedUserPayload,
    validateUserPayload,
    validateUserPayloadMock,
} from '@/services/telegram'
import { config } from '@/config/config'
import { IRepositories } from '@/repositories/repositories'
import { IServices } from '@/core/types'

export const setupWsRouter = (wss: Server, repositories: IRepositories, services: IServices) => {
    const chats = wss.of('/ws/chats/private')

    chats.on('connection', async (socket) => {
        let identity: ValidatedUserPayload
        try {
            const initData = socket.handshake.query['x-telegram-init-data']

            if (config.ALLOW_FAKE_PROFILES === 'true') {
                identity = validateUserPayloadMock(
                    initData?.toString() ?? '',
                    config.TELEGRAM_BOT_TOKEN,
                )
            } else {
                identity = validateUserPayload(
                    initData?.toString() ?? '',
                    config.TELEGRAM_BOT_TOKEN,
                )
            }
        } catch (e) {
            return socket.disconnect(true)
        }

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return socket.disconnect(true)
        }

        console.log(`${user._id} connected`)

        socket.join(user._id.toString())

        socket.on('disconnect', () => {
            console.log(`${user._id} disconnected`)
        })
    })

    const activities = wss.of('/ws/users/activities')

    activities.on('connection', async (socket) => {
        let identity: ValidatedUserPayload
        try {
            const initData = socket.handshake.query['x-telegram-init-data']

            if (config.ALLOW_FAKE_PROFILES === 'true') {
                identity = validateUserPayloadMock(
                    initData?.toString() ?? '',
                    config.TELEGRAM_BOT_TOKEN,
                )
            } else {
                identity = validateUserPayload(
                    initData?.toString() ?? '',
                    config.TELEGRAM_BOT_TOKEN,
                )
            }
        } catch (e) {
            return socket.disconnect(true)
        }

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return socket.disconnect(true)
        }

        console.log(`${user._id} connected`)

        // socket.join(user._id.toString())

        socket.on('subscribe', async (body) => {
            socket.join(body)
        })

        socket.on('unsubscribe', async (body) => {
            console.log(body, typeof body)

            socket.leave(body)
        })

        socket.on('disconnect', () => {
            // activities.to(user._id.toString()).emit('offline', user._id.toString())

            console.log(`${user._id} disconnected`)
        })
    })

    const globalChats = wss.of('/ws/chats/global')

    globalChats.on('connection', async (socket) => {
        let identity: ValidatedUserPayload
        try {
            const initData = socket.handshake.query['x-telegram-init-data']

            if (config.ALLOW_FAKE_PROFILES === 'true') {
                identity = validateUserPayloadMock(
                    initData?.toString() ?? '',
                    config.TELEGRAM_BOT_TOKEN,
                )
            } else {
                identity = validateUserPayload(
                    initData?.toString() ?? '',
                    config.TELEGRAM_BOT_TOKEN,
                )
            }
        } catch (e) {
            return socket.disconnect(true)
        }

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return socket.disconnect(true)
        }

        console.log(`${user._id} connected`)

        socket.on('subscribe', async (slug) => {
            socket.join(slug)
        })

        socket.on('unsubscribe', async (slug) => {
            socket.leave(slug)
        })

        socket.on('disconnect', () => {
            console.log(`${user._id} disconnected`)
        })

        socket.emit('init')
    })
}
