import { dev, GATEWAY_PATH, ROOT_DIR } from '@/config/config'
import { MongoDBService } from '@/services/database'
import express, { Router } from 'express'
import { Request, Response } from 'firebase-functions'
import path from 'path'
import { registerRoutes } from './router'

const PORT = parseInt(process.env.PORT || '4000')

const expressApp = express()

const handler = async (options?: { request: Request; response: Response }) => {
  expressApp.use(express.json())
  if (!dev) {
    expressApp.use(
      express.static(path.join(ROOT_DIR, '..', 'public'), {
        setHeaders: (res, path, stat) => {
          if (path.endsWith('/index.html')) {
            res.setHeader('cache-control', 'no-cache, no-store, must-revalidate')
          }
        },
      }),
    )
  }

  // GCP prefixes the domain with pathname
  const router = Router({ mergeParams: true })
  router.use(async (req, res, next) => {
    try {
      await MongoDBService.lazy(process.env.MONGO_URI)

      next()
    } catch (e) {
      res.sendStatus(500)
    }
  })
  expressApp.use(dev ? `${GATEWAY_PATH}/api` : '/api', router)
  registerRoutes(router)

  // Forward cloud function request to express
  if (options) {
    return expressApp(options.request, options.response)
  }

  // Start development server
  expressApp.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${PORT}`)
    console.log(`  Environment: ${process.env.NODE_ENV}`)
    console.log(`          App: ${process.env.APP_ENV}`)
    console.log(`       Logger: ${process.env.LOGGER_LEVEL}`)
  })
}

export default handler
