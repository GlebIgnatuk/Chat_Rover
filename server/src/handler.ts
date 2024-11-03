import { config, dev, hmr, PORT, ROOT_DIR } from '@/config/config'
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
import { Server } from 'socket.io'
import { IServices } from './core/types'
import { PrivateChatService } from './core/privateChatService'
import { WuwaCharacterRepository } from './repositories/impl/wuwaCharacter'
import { ProfileRepository } from './repositories/impl/profile'
import { OnlineService } from './core/onlineService'
import { GlobalChatRepository } from './repositories/impl/globalChat'
import { GlobalChatService } from './core/globalChatService'

const app = express()
let server: http.Server | https.Server
if (dev && !hmr) {
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
    const repositories: IRepositories = {
        chatMessage: new ChatMessageRepository(privateChat),
        privateChat: privateChat,
        globalChat: globalChat,
        user: new UserRepository(),
        wuwaCharacter: new WuwaCharacterRepository(),
        profile: new ProfileRepository(),
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
    server.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`> Ready on http://localhost:${PORT}`)
        console.log(`  Environment: ${process.env.NODE_ENV}`)
        console.log(`          App: ${process.env.APP_ENV}`)
        console.log(`       Logger: ${process.env.LOGGER_LEVEL}`)
    })
}

export default handler
