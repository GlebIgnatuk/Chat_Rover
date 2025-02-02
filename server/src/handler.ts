import { config, dev, PORT, ROOT_DIR, standalone } from '@/config/config'
import { MongoDBService } from '@/services/database'
import express, { Router } from 'express'
import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'
import { setupHttpRouter } from './transport/http/transport'
import { setupWsRouter } from './transport/ws/transport'
import { IRepositories } from './repositories/repositories'
import { UserRepository } from './repositories/impl/user'
import { PrivateChatRepository } from './repositories/impl/privateChat'
import { ChatMessageRepository } from './repositories/impl/chatMessage'
import { ReportRepository } from './repositories/impl/reports'
import { Server } from 'socket.io'
import { IServices } from './core/types'
import { PrivateChatService } from './core/privateChatService'
import { WuwaCharacterRepository } from './repositories/impl/wuwaCharacter'
import { ProfileRepository } from './repositories/impl/profile'
import { OnlineService } from './core/onlineService'
import { GlobalChatRepository } from './repositories/impl/globalChat'
import { GlobalChatService } from './core/globalChatService'
import { TranslationRepository } from './repositories/impl/translation'
import { ErrorRepository } from './repositories/impl/error'
import { ProfileExportRepository } from './repositories/impl/profileExport'
import { ExpressGiveawayRepository } from './repositories/impl/expressGiveaway'
import { GiveawayItemRepository } from './repositories/impl/giveawayItem'
import { BalancePromocodeRepository } from './repositories/impl/balancePromocode'
import { BalancePromocodeActivationRepository } from './repositories/impl/balancePromocodeActivation'
import { ShopProductRepository } from './repositories/impl/shopProduct'
import { ShopOrderRepository } from './repositories/impl/shopOrder'

const app = express()
let server: http.Server | https.Server
if (dev && standalone) {
    server = https.createServer(
        {
            cert: fs.readFileSync(path.join(ROOT_DIR, 'tls', 'cert.pem')),
            key: fs.readFileSync(path.join(ROOT_DIR, 'tls', 'key.pem')),
        },
        app,
    )
} else {
    server = http.createServer(app)
}
const wss = new Server(server)

const handler = async () => {
    await MongoDBService.lazy(config.MONGO_URI)

    const privateChat = new PrivateChatRepository()
    const globalChat = new GlobalChatRepository()
    const balancePromocodeRepo = new BalancePromocodeRepository()
    const balancePromocodeActivationRepo = new BalancePromocodeActivationRepository()
    const userRepo = new UserRepository(balancePromocodeRepo, balancePromocodeActivationRepo)
    const giveawayItemRepo = new GiveawayItemRepository()
    const shopProductRepo = new ShopProductRepository()
    const repositories: IRepositories = {
        balancePromocode: balancePromocodeRepo,
        chatMessage: new ChatMessageRepository(privateChat),
        privateChat: privateChat,
        globalChat: globalChat,
        report: new ReportRepository(userRepo),
        user: userRepo,
        wuwaCharacter: new WuwaCharacterRepository(),
        profile: new ProfileRepository(userRepo),
        translation: new TranslationRepository(),
        error: new ErrorRepository(),
        profileExport: new ProfileExportRepository(),
        expressGiveaway: new ExpressGiveawayRepository(userRepo, giveawayItemRepo),
        giveawayItem: giveawayItemRepo,
        shopProduct: shopProductRepo,
        shopOrder: new ShopOrderRepository(shopProductRepo, userRepo),
    }
    const services: IServices = {
        privateChat: new PrivateChatService(
            wss,
            repositories.privateChat,
            repositories.user,
            repositories.chatMessage,
        ),
        globalChat: new GlobalChatService(
            wss,
            repositories.user,
            repositories.chatMessage,
            globalChat,
        ),
        online: new OnlineService(wss, repositories.user),
    }

    // API routes
    const api = Router({ mergeParams: true })
    setupHttpRouter(api, repositories, services)

    // WS routes
    setupWsRouter(wss, repositories, services)

    // Static assets
    // expressApp.use(
    //     '/public',
    //     express.static(path.join(ROOT_DIR, '..', 'public'))
    // )
    // expressApp.use('*', (_, res) => {
    //     res.sendFile(path.join(ROOT_DIR, '..', 'public', 'index.html'))
    // })

    app.use('/api', api)

    app.use([
        (err, _, res, __) => {
            console.error(err.stack)

            res.status(500).json({
                success: false,
                error: 'Something went wrong.',
            })
        },
    ])

    // Start the server
    server.listen(PORT, `0.0.0.0`, () => {
        // eslint-disable-next-line no-console
        console.log(`> Ready on ${standalone ? 'https' : 'http'}://0.0.0.0:${PORT}`)
        console.log(`  Environment: ${process.env.NODE_ENV}`)
        console.log(`          App: ${process.env.APP_ENV}`)
        console.log(`       Logger: ${process.env.LOGGER_LEVEL}`)
    })
}

export default handler
