import * as UsersController from './users/users.controller'
import * as PrivateChatsController from './privateChats/privateChats.controller'
import * as GlobalChatsController from './globalChats/globalChats.controller'
import * as PrivateChatMessagesController from './privateChats/messages/messages.controller'
import * as GlobalChatMessagesController from './globalChats/messages/messages.controller'
import * as ReportsController from './reports/reports.controller'
import * as WuwaCharactersController from './wuwaCharacters/wuwaCharacters.controller'
import * as ProfilesController from './profiles/profiles.controller'
import * as AppConfigController from './appConfig/appConfig.controller'
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

    const unauthorized = Router({ mergeParams: true })

    //
    // Public routes
    //
    router.use('/public', unauthorized)

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

    // App config
    unauthorized.get('/appConfig', AppConfigController.get)
    unauthorized.get('/appConfig/intls/:language', AppConfigController.getIntl)

    //
    // Protected routes
    //
    const authorized = Router({ mergeParams: true })
    router.use('/', authorized)

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

    // User
    authorized.get('/users', UsersController.search)
    authorized.get('/users/me', UsersController.getAuthenticated)
    authorized.delete('/users/me', UsersController.deleteAuthenticated)
    authorized.post('/users', UsersController.create)
    authorized.post('/me/activities', UsersController.trackActivity)

    // Profiles
    authorized.post('/profiles', ProfilesController.create)
    authorized.put('/profiles/:id', ProfilesController.update)
    authorized.get('/profiles', ProfilesController.search)
    authorized.get('/me/profiles', ProfilesController.getMine)

    // Private chat
    authorized.get('/privateChats/:id', PrivateChatsController.get)
    authorized.get('/privateChats', PrivateChatsController.listMyChats)
    authorized.post('/privateChats', PrivateChatsController.create)
    authorized.delete('/privateChats/:chatId', PrivateChatsController.remove)

    // Private chat messages
    authorized.get('/privateChats/:chatId/messages', PrivateChatMessagesController.list)
    authorized.post('/privateChats/:chatId/messages', PrivateChatMessagesController.create)

    // Global chat
    authorized.get('/globalChats', GlobalChatsController.list)

    // Global chat messages
    authorized.get('/globalChats/:chatId/messages', GlobalChatMessagesController.list)
    authorized.post('/globalChats/:chatId/messages', GlobalChatMessagesController.create)

    // Reports
    authorized.get('/reports/:id', ReportsController.get)
    authorized.get('/reports', ReportsController.list)
    authorized.post('/reports', ReportsController.create)

    // Wuwa characters
    authorized.get('/wuwaCharacters', WuwaCharactersController.list)

    // Fallback
    router.use('*', (_, res) => res.sendStatus(404))
}
