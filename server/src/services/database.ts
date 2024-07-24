import mongoose from 'mongoose'
import { MongooseQueryLogger } from 'mongoose-query-logger'

export class MongoDBService {
  public static async lazy(url?: string) {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
      console.log('[DB] reusing existing connection')
      return mongoose.connection.asPromise()
    }

    const connection = await mongoose.connect(url || '', {
      maxPoolSize: 2,
      maxIdleTimeMS: 30 * 60 * 1000,
    })

    const queryLogger = new MongooseQueryLogger()
    mongoose.set('debug', process.env.NODE_ENV !== 'production')
    mongoose.plugin(queryLogger.getPlugin())

    console.log('[DB] connected')

    return connection
  }
}
