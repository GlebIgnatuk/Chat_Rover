import dotenv from 'dotenv'
dotenv.config({
  path: '.env.local',
})

import handler from './handler'
handler()
