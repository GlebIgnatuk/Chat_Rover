import dotenv from 'dotenv'

(async () => {
  dotenv.config({
    path: '.env',
  })

  const module = await import('./handler')
  module.default()
})();