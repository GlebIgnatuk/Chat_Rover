import dotenv from 'dotenv'
dotenv.config({
  path: '.env',
})

import handler from './handler'
handler()
