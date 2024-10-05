import * as UsersController from './users/users.controller'
import * as PrivateChatsController from './privateChats/privateChats.controller'
import * as ChatMessagesController from './chatMessages/chatMessages.controller'
import * as WuwaCharactersController from './wuwaCharacters/wuwaCharacters.controller'
import { Router } from 'express'
import {
    ValidatedUserPayload,
    validateUserPayload,
    validateUserPayloadMock,
} from '@/services/telegram'
import { config } from '@/config/config'
import express from 'express'
import cors from 'cors'
import { IRepositories } from '@/repositories/repositories'
import { IServices } from '@/core/types'

export const setupHttpRouter = (
    router: Router,
    repositories: IRepositories,
    services: IServices,
) => {
    // Middlewares
    router.use(express.json())
    router.use(
        cors({
            origin: [
                'https://127.0.0.1:3000',
                'https://roverchat.pokoichangli.ru',
                'https://dev.roverchat.pokoichangli.ru',
            ],
        }),
    )
    router.use(async (req, _, next) => {
        console.info(`Incoming request: ${req.method} ${req.originalUrl} | ${req.baseUrl}`)
        next()
    })
    router.use((_, res, next) => {
        // Inject dependencies
        res.locals = {
            ...res.locals,
            repositories,
            services,
        }

        next()
    })

    const authorized = Router({ mergeParams: true })

    // Protect endpoints with telegram data hash check
    authorized.use((req, res, next) => {
        const initData = req.headers['x-telegram-init-data'] as string

        let identity: ValidatedUserPayload
        try {
            if (config.ALLOW_FAKE_PROFILES === 'true') {
                identity = validateUserPayloadMock(initData, config.TELEGRAM_BOT_TOKEN)
            } else {
                identity = validateUserPayload(initData, config.TELEGRAM_BOT_TOKEN)
            }
        } catch {
            return res.status(403).json({ success: false, error: 'Invalid user data' })
        }

        res.locals = {
            ...res.locals,
            identity,
        }

        next()
    })

    // Public routes
    router.get('/health', (req, res) => {
        res.json({
            sucess: true,
            data: {
                baseUrl: req.baseUrl,
                originalUrl: req.originalUrl,
                url: req.url,
            },
        })
    })

    // Protected routes
    router.use('/', authorized)

    // User
    authorized.get('/users', UsersController.search)
    authorized.get('/users/me', UsersController.getAuthenticated)
    authorized.delete('/users/me', UsersController.deleteAuthenticated)
    authorized.post('/users', UsersController.create)

    // Private chat
    authorized.get('/privateChats', PrivateChatsController.listMyChats)
    authorized.post('/privateChats', PrivateChatsController.create)
    authorized.delete('/privateChats/:chatId', PrivateChatsController.remove)

    // Chat message
    authorized.get('/chats/:chatId/messages', ChatMessagesController.list)
    authorized.post('/chats/:chatId/messages', ChatMessagesController.create)
    authorized.patch('/chats/:chatId/messages/:messageId', ChatMessagesController.patch)
    authorized.delete('/chats/:chatId/messages/:messageId', ChatMessagesController.remove)

    // Wuwa characters
    authorized.get('/wuwaCharacters', WuwaCharactersController.list)

    // Fallback
    router.use('*', (_, res) => res.sendStatus(404))
}
