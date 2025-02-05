import * as UsersController from './users/users.controller'
import * as PrivateChatsController from './privateChats/privateChats.controller'
import * as GlobalChatsController from './globalChats/globalChats.controller'
import * as PrivateChatMessagesController from './privateChats/messages/messages.controller'
import * as GlobalChatMessagesController from './globalChats/messages/messages.controller'
import * as ReportsController from './reports/reports.controller'
import * as WuwaCharactersController from './wuwaCharacters/wuwaCharacters.controller'
import * as ProfilesController from './profiles/profiles.controller'
import * as AppConfigController from './appConfig/appConfig.controller'
import * as TranslationsController from './translations/translations.controller'
import * as ErrorsController from './errors/errors.controller'
import * as GiveawayItemsController from './giveawayItems/giveawayItems.controller'
import * as ExpressGiveawaysController from './expressGiveaways/expressGiveaways.controller'
import * as TelegramUsersController from './telegramUsers/telegramUsers.controller'
import * as ShopOrdersController from './shopOrders/shopOrders.controller'
import * as ShopProductsController from './shopProducts/shopProducts.controller'
import { Router } from 'express'
import multer, { memoryStorage } from 'multer'
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
import { isAdmin } from './_middlewares/admin.middleware'

export const setupHttpRouter = (
    router: Router,
    repositories: IRepositories,
    services: IServices,
) => {
    const upload = multer({ storage: memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

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
    // optionally include authenticated user
    unauthorized.use((req, res, next) => {
        const initData = req.headers['x-telegram-init-data'] as string

        let identity: ValidatedUserPayload
        try {
            if (config.ALLOW_FAKE_PROFILES === 'true') {
                identity = validateUserPayloadMock(initData, config.TELEGRAM_BOT_TOKEN)
            } else {
                identity = validateUserPayload(initData, config.TELEGRAM_BOT_TOKEN)
            }

            res.locals = {
                ...res.locals,
                identity,
            }

            next()
        } catch {
            next()
        }
    })

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

    // Errors
    unauthorized.post('/errors', ErrorsController.create)

    // App config
    unauthorized.get('/appConfig', AppConfigController.get)

    // Intls
    unauthorized.get('/intls/:language', AppConfigController.getIntl)

    // Wuwa characters
    unauthorized.get('/wuwaCharacters', WuwaCharactersController.list)

    // Translations
    unauthorized.get('/translations/:language', TranslationsController.getByLanguage)

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
    authorized.get('/users/:id', UsersController.get)
    authorized.delete('/users/me', UsersController.deleteAuthenticated)
    authorized.post('/users', UsersController.create)
    authorized.patch('/users/me', UsersController.patch)
    authorized.post('/me/activities', UsersController.trackActivity)
    authorized.post('/me/bonuses/daily/redeems', UsersController.redeemDailyBonus)
    authorized.post(
        '/me/balancePromocodes/:code/activations',
        UsersController.claimBalancePromocode,
    )

    // Profiles
    authorized.post('/profiles', ProfilesController.create)
    authorized.put('/profiles/:id', ProfilesController.update)
    authorized.get('/profiles', ProfilesController.search)
    authorized.post(
        '/profiles/:id/exports',
        (req, res, next) => {
            const fn = upload.single('photo')

            // @ts-expect-error
            fn(req, res, next)
        },
        ProfilesController.createExport,
    )
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

    // Translations
    authorized.get('/translations', TranslationsController.getAll)
    authorized.post('/translations', TranslationsController.create)
    authorized.patch('/translations/:id', TranslationsController.update)
    authorized.delete('/translations/:id', TranslationsController.remove)

    // Shop Orders
    authorized.post('/shopOrders', ShopOrdersController.create)
    authorized.get('/shopOrders', ShopOrdersController.list)
    authorized.get('/shopOrders/:id', ShopOrdersController.get)
    authorized.post('/shopOrders/:id/statuses', isAdmin, ShopOrdersController.changeStatus)
    authorized.get('/admin/shopOrders', isAdmin, ShopOrdersController.listAdmin)
    authorized.get('/admin/shopOrders/:id', isAdmin, ShopOrdersController.getAdmin)
    authorized.post(
        '/admin/shopOrders/:id/statuses',
        isAdmin,
        ShopOrdersController.changeStatusAdmin,
    )
    authorized.post(
        '/admin/shopOrders/:id/shopProducts/:productId/statuses',
        isAdmin,
        ShopOrdersController.changeProductStatus,
    )
    authorized.post(
        '/admin/shopOrders/:id/reminders',
        isAdmin,
        ShopOrdersController.sendOrderReminder,
    )

    // Shop Products
    authorized.get('/shopProducts', ShopProductsController.list)

    // Giveaway items
    authorized.get('/admin/giveawayItems', isAdmin, GiveawayItemsController.list)
    authorized.post('/admin/giveawayItems', isAdmin, GiveawayItemsController.create)
    authorized.delete('/admin/giveawayItems/:id', isAdmin, GiveawayItemsController.remove)

    // Express giveaways
    authorized.get(
        '/admin/expressGiveaways',
        isAdmin,
        ExpressGiveawaysController.listAdminListItems,
    )
    authorized.post('/admin/expressGiveaways', isAdmin, ExpressGiveawaysController.create)
    authorized.post(
        '/admin/expressGiveaways/:id/processedWinners',
        isAdmin,
        ExpressGiveawaysController.markWinnerAsProcessed,
    )
    authorized.post(
        '/admin/expressGiveaways/:id/rerolledWinners',
        isAdmin,
        ExpressGiveawaysController.rerollWinner,
    )
    authorized.delete('/admin/expressGiveaways/:id', isAdmin, ExpressGiveawaysController.remove)
    authorized.delete(
        '/admin/expressGiveaways/:id/processedWinners/:winnerId',
        isAdmin,
        ExpressGiveawaysController.markWinnerAsPending,
    )
    authorized.post(
        '/admin/expressGiveaways/:id/winners/:winnerId/notifications',
        isAdmin,
        ExpressGiveawaysController.sendWinnerNotification,
    )

    authorized.get('/expressGiveaways', ExpressGiveawaysController.listInListing)
    authorized.post('/expressGiveaways/:id/participants', ExpressGiveawaysController.addParticipant)

    // Telegram users
    authorized.get('/admin/users/:id/telegramUsers', isAdmin, TelegramUsersController.list)

    // Fallback
    router.use('*', (_, res) => res.sendStatus(404))
}
