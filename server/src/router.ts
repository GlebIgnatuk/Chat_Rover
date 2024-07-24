import { Router } from 'express'

export const registerRoutes = (router: Router) => {
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
}
