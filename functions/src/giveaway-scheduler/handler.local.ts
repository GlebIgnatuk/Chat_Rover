import dotenv from 'dotenv'
dotenv.config({
    path: 'env/.env.giveaway-scheduler.dev',
})

import handler from './handler'

const [, , seconds] = process.argv
const ms = Number(seconds || '60') * 1000

let i = 0

setInterval(() => {
    handler()
    console.log(`[Giveaway Scheduler] Processed #${++i}! Next tick in ${ms / 1000}s`)
}, ms)

console.log(`[Giveaway Scheduler] Running! Next tick in ${ms / 1000}s`)
