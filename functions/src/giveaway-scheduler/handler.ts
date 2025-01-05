import mongoose, { mongo, Types } from 'mongoose'
import { MongoDBService } from '../shared/services/MongoDB'

const giveawayScheduler = async () => {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const giveaways = mongoose.connection
        .collection<
            mongo.WithId<{
                participants: Types.ObjectId[]
                maxWinners: number
                giveawayItemId: Types.ObjectId
            }>
        >('express_giveaways')
        .find(
            {
                startedAt: { $ne: null },
                finishedAt: null,
                $expr: {
                    $gte: [
                        {
                            $dateDiff: {
                                startDate: '$startedAt',
                                endDate: '$$NOW',
                                unit: 'second',
                            },
                        },
                        { $subtract: ['$durationInSeconds', 60] },
                    ],
                },
            },
            { projection: { _id: 1, participants: 1, maxWinners: 1, giveawayItemId: 1 } }
        )

    for await (const giveaway of giveaways) {
        console.log('\nGIVEAWAY:', giveaway._id)

        try {
            const winners: Types.ObjectId[] = []
            const participants = [...giveaway.participants]
            for (let i = 0; i < giveaway.maxWinners; i++) {
                if (participants.length === 0) break

                const randomIndex = Math.floor(Math.random() * (participants.length - 1 - 0)) + 0
                winners.push(participants[randomIndex])

                participants[randomIndex] = participants[participants.length - 1]
                participants.pop()
            }

            await mongoose.connection.collection('express_giveaways').updateOne(
                { _id: giveaway._id },
                {
                    $set: {
                        winners,
                        finishedAt: new Date(),
                    },
                }
            )

            console.log(`Determined winners for giveaway "${giveaway._id}"`)

            const product = await mongoose.connection
                .collection<{ name: string }>('giveaway_items')
                .findOne({ _id: giveaway.giveawayItemId })
            if (!product) {
                continue
            }

            for (const winner of winners) {
                const user = await mongoose.connection
                    .collection<{ externalId: number }>('users')
                    .findOne({ _id: winner })
                if (!user) continue

                const response = await fetch(
                    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            chat_id: user.externalId,
                            text: `Hello! You won ${product.name} in a giveaway!\nWe will contact you from this account @WuWa007 soon.`,
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text: 'Go to app',
                                            url: `tg://resolve?domain=rover_chat_bot&appname=rover_chat`,
                                        },
                                    ],
                                ],
                            },
                        }),
                    }
                )
                if (!response.ok) {
                    console.error(`Failed to send notification: ${await response.text()}`)
                }
            }
        } catch (e) {
            console.error(`Failed to process giveaway "${giveaway._id}": ${(e as Error).message}`)
        }
    }
}

export default giveawayScheduler
