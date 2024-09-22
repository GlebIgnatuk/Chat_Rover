import { dev, hmr, ROOT_DIR } from '@/config/config'
import { MongoDBService } from '@/services/database'
import express, { Router } from 'express'
import { Request, Response } from 'firebase-functions'
import fs from 'fs'
import { createServer } from 'https'
import path from 'path'
import { registerRoutes } from './router'
import cors from 'cors'

const PORT = parseInt(process.env.PORT || (hmr ? '4000' : '3000'))

const expressApp = express()
const server =
    // dev && !hmr
    dev
        ? createServer(
              {
                  cert: fs.readFileSync(path.join(ROOT_DIR, 'tls', 'cert.pem')),
                  key: fs.readFileSync(path.join(ROOT_DIR, 'tls', 'key.pem')),
              },
              expressApp,
          )
        : expressApp

const handler = async (options?: { request: Request; response: Response }) => {
    await MongoDBService.lazy(process.env.MONGO_URI)

    expressApp.use(express.json())
    expressApp.use(cors({
        origin: [
            'https://127.0.0.1:3000',
            'https://roverchat.pokoichangli.ru',
            'https://dev.roverchat.pokoichangli.ru'
        ]
    }))

    // GCP prefixes the domain with pathname
    const router = Router({ mergeParams: true })
    router.use(async (req, res, next) => {
        try {
            res.setHeader('cache-control', 'max-age=0, private, must-revalidate')
            console.log(`Incoming request: ${req.method} ${req.originalUrl} | ${req.baseUrl}`)

            next()
        } catch (e) {
            res.sendStatus(500)
        }
    })
    expressApp.use('/api', router)
    registerRoutes(router)
    router.use('*', (req, res) => res.sendStatus(404))

    expressApp.use(
        '/public',
        express.static(path.join(ROOT_DIR, '..', 'public'))
    )
    expressApp.use('*', (_, res) => {
        res.sendFile(path.join(ROOT_DIR, '..', 'public', 'index.html'))
    })

    // Forward cloud function request to express
    if (options) {
        return expressApp(options.request, options.response)
    } else {
        // Start development server
        server.listen(PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`> Ready on http://localhost:${PORT}`)
            console.log(`  Environment: ${process.env.NODE_ENV}`)
            console.log(`          App: ${process.env.APP_ENV}`)
            console.log(`       Logger: ${process.env.LOGGER_LEVEL}`)
        })
    }
}

export default handler
