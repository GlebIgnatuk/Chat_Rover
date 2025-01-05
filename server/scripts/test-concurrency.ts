import { MongoDBService } from '@/services/database'
import mongoose, { mongo, Types } from 'mongoose'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const id = new Types.ObjectId('677a85b02a68e5c8efc45336')

    await mongoose.connection.withSession(async (session) => {
        return session.withTransaction(async (session) => {
            console.log('Started')
            await mongoose.connection
                .collection('express_giveaways')
                .updateOne({ _id: id }, { $set: { updatedAt: new Date() } }, { session })
            console.log('Locked')
            const g = await mongoose.connection
                .collection<mongo.WithId<{ maxWinners: number }>>('express_giveaways')
                .findOne(
                    {
                        _id: id,
                    },
                    { session },
                )
            console.log('Get')
            if (!g) throw new Error('Not found')

            await new Promise((res) => setTimeout(res, 5000))
            await mongoose.connection
                .collection('express_giveaways')
                .updateOne({ _id: id }, { $set: { maxWinners: g.maxWinners + 1 } }, { session })
            console.log('Update 1')

            await mongoose.connection
                .collection('express_giveaways')
                .updateOne({ _id: id }, { $set: { maxParticipants: 20 } }, { session })
            console.log('Update 2')
        })
    })

    console.log('Done!')
}

main().then(() => process.exit(0))
