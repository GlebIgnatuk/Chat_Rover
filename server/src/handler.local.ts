import dotenv from 'dotenv'

(async () => {
  dotenv.config({
    path: '.env.local',
  })

  const module = await import('./handler')
  module.default()
})();