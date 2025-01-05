import mongoose from 'mongoose'
import { MongooseQueryLogger } from 'mongoose-query-logger'

export class MongoDBService {
    public static async lazy(url?: string) {
        if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
            console.log('[DB] reusing existing connection')

            try {
                const result = await mongoose.connection.db?.command({ ping: 1 })
                if (!result || result.ok !== 1) {
                    throw new Error('Ping error')
                }
            } catch {
                console.log('[DB] Failed to ping db')
                mongoose.connection.close()
            }

            return mongoose.connection.asPromise()
        }

        try {
            const connection = await mongoose.connect(url || '', {
                maxPoolSize: 2,
                maxIdleTimeMS: 30 * 60 * 1000,
            })

            const queryLogger = new MongooseQueryLogger()
            mongoose.set('debug', process.env.NODE_ENV !== 'production')
            mongoose.plugin(queryLogger.getPlugin())

            console.log('[DB] connected')

            return connection
        } catch (e) {
            console.error(e)

            return null
        }
    }
}
