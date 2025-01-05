import dotenv from 'dotenv'
dotenv.config({
    path: 'env/.env.giveaway-scheduler.dev',
})

import handler from './handler'
handler().then(() => process.exit())
