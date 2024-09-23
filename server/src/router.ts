import * as UsersController from '@/modules/users/users.controller'
import * as PrivateChatsController from '@/modules/privateChats/privateChats.controller'
import * as ChatMessagesController from '@/modules/chatMessages/chatMessages.controller'
import { Router } from 'express'
import { ValidatedUserPayload, validateUserPayload } from './services/telegram'
import { config } from './config/config'
import { IRepositories } from './repositories/repositories'
import express from 'express'
import cors from 'cors'

export const registerRoutes = (router: Router, repositories: IRepositories) => {
    // Middlewares
    router.use(express.json())
    router.use(cors({
        origin: [
            'https://127.0.0.1:3000',
            'https://roverchat.pokoichangli.ru',
            'https://dev.roverchat.pokoichangli.ru'
        ]
    }))
    router.use(async (req, _, next) => {
        console.info(`Incoming request: ${req.method} ${req.originalUrl} | ${req.baseUrl}`)
        next()
    })

    // Inject repositories
    router.use((_, res, next) => {
        res.locals = {
            ...res.locals,
            repositories
        }

        next()
    })

    const authorized = Router({ mergeParams: true })
    router.use('/', authorized)

    // Protect endpoints with telegram data hash check
    authorized.use((req, res, next) => {
        const initData = req.headers['x-telegram-init-data'] as string

        let identity: ValidatedUserPayload
        try {
            identity = validateUserPayload(initData, config.TELEGRAM_BOT_TOKEN)
        } catch {
            return res.status(403).json({ success: false, error: 'Invalid user data' })
        }

        res.locals = {
            ...res.locals,
            identity
        }

        next()
    })

    // Routes
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


    // User
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

    // Fallback
    router.use('*', (_, res) => res.sendStatus(404))
}
