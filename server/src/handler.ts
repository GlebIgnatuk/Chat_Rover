import { dev, GATEWAY_PATH, hmr, ROOT_DIR } from '@/config/config'
import { MongoDBService } from '@/services/database'
import express, { Router } from 'express'
import { Request, Response } from 'firebase-functions'
import fs from 'fs'
import { createServer } from 'https'
import path from 'path'
import { registerRoutes } from './router'

const PORT = parseInt(process.env.PORT || (hmr ? '4000' : '3000'))

const expressApp = express()
const server =
    dev && !hmr
        ? createServer(
              {
                  cert: fs.readFileSync(path.join(ROOT_DIR, 'tls', 'cert.pem')),
                  key: fs.readFileSync(path.join(ROOT_DIR, 'tls', 'key.pem')),
              },
              expressApp,
          )
        : expressApp

const handler = async (options?: { request: Request; response: Response }) => {
    expressApp.use(express.json())

    // GCP prefixes the domain with pathname
    const router = Router({ mergeParams: true })
    router.use(async (req, res, next) => {
        try {
            res.setHeader('cache-control', 'max-age=0, private, must-revalidate')
            await MongoDBService.lazy(process.env.MONGO_URI)

            next()
        } catch (e) {
            res.sendStatus(500)
        }
    })
    expressApp.use(dev ? `${GATEWAY_PATH}/api` : '/api', router)
    registerRoutes(router)
    router.use('*', (req, res) => res.sendStatus(404))

    // Forward cloud function request to express
    if (options) {
        expressApp.use(
            '/public',
            express.static(path.join(ROOT_DIR, '..', 'public'), {
                setHeaders: (res, path, stat) => {
                    if (path.endsWith('/index.html')) {
                        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate')
                    }
                },
                fallthrough: false,
                redirect: false,
            }),
        )
        expressApp.use('*', (req, res, next) => {
            res.setHeader('cache-control', 'no-cache, no-store, must-revalidate').sendFile(
                path.join(ROOT_DIR, '..', 'public', 'index.html'),
            )
        })

        return expressApp(options.request, options.response)
    } else {
        expressApp.use(
            `${GATEWAY_PATH}/public`,
            express.static(path.join(ROOT_DIR, '..', 'public'), {
                setHeaders: (res, path, stat) => {
                    if (path.endsWith('/index.html')) {
                        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate')
                    }
                },
                fallthrough: false,
                redirect: false,
            }),
        )
        expressApp.use('*', (req, res, next) => {
            res.setHeader('cache-control', 'no-cache, no-store, must-revalidate').sendFile(
                path.join(ROOT_DIR, '..', 'public', 'index.html'),
            )
        })

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
