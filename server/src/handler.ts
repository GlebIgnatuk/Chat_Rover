import { config, dev, hmr, PORT, ROOT_DIR } from '@/config/config'
import { MongoDBService } from '@/services/database'
import express, { Router } from 'express'
import fs from 'fs'
import { createServer } from 'https'
import path from 'path'
import { registerRoutes } from './router'
import { IRepositories } from './repositories/repositories'
import { UserRepository } from './repositories/impl/user'
import { PrivateChatRepository } from './repositories/impl/privateChat'
import { ChatMessageRepository } from './repositories/impl/chatMessage'

const expressApp = express()
const server =
    dev && !hmr
    // dev
        ? createServer(
              {
                  cert: fs.readFileSync(path.join(ROOT_DIR, 'tls', 'cert.pem')),
                  key: fs.readFileSync(path.join(ROOT_DIR, 'tls', 'key.pem')),
              },
              expressApp,
          )
        : expressApp

const handler = async () => {
    await MongoDBService.lazy(config.MONGO_URI)

    const repositories: IRepositories = {
        chatMessage: new ChatMessageRepository(),
        privateChat: new PrivateChatRepository(),
        user: new UserRepository()
    }

    // API routes
    const api = Router({ mergeParams: true })
    expressApp.use('/api', api)
    registerRoutes(api, repositories)

    // Static assets
    expressApp.use(
        '/public',
        express.static(path.join(ROOT_DIR, '..', 'public'))
    )
    expressApp.use('*', (_, res) => {
        res.sendFile(path.join(ROOT_DIR, '..', 'public', 'index.html'))
    })

    expressApp.use([(err, req, res, next) => {
        console.error(err.stack)

        res.status(500).json({
            success: false,
            error: 'Something went wrong.'
        })
    }])

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
