import { SUPPORTED_LANGUAGES, SUPPORTED_SERVERS } from '@/config/config'
import { ExpressGiveawayModel } from '@/models/expressGiveaway'
import { ProfileRepository } from '@/repositories/impl/profile'
import { UserRepository } from '@/repositories/impl/user'
import { WuwaCharacterRepository } from '@/repositories/impl/wuwaCharacter'
import { MongoDBService } from '@/services/database'
import { Types } from 'mongoose'

const randomString = (min: number, max: number) => {
    const length = Math.floor(Math.random() * (max - min)) + min
    const sequence = Array.from({ length }, () => Math.floor(Math.random() * (122 - 97)) + 97)

    return String.fromCharCode(...sequence)
}

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const skip = Number(process.env.SKIP)
    const take = Number(process.env.TAKE)

    if (Number.isNaN(skip + take)) {
        throw new Error('SKIP or TAKE is NaN')
    }

    // const giveaways = await ExpressGiveawayModel.getCollection()
    //     .find({ finishedAt: { $ne: null } }, { sort: { scheduledAt: -1 }, limit: take, skip: skip })
    //     .toArray()
    const giveaways = await ExpressGiveawayModel.getCollection()
        .aggregate([
            { $match: { finishedAt: { $ne: null } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'winners',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                },
            },
            {
                $project: {
                    user: 1,
                },
            },
        ])
        .toArray()

    let text = ''

    for (const g of giveaways) {
        console.log(g.user.externalId)

        const response = await fetch(
            `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getChatMember`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    user_id: g.user.externalId,
                }),
            },
        )
        if (!response.ok) {
            const text = await response.text()
            console.error(text)
            return
        }

        const data = await response.json()

        const name = data.result.user.username || data.result.user.first_name

        text += `[@${name}](tg://user?id=${g.user.externalId})\n`
    }

    console.log(text)

    console.log('Done!')
}

main().then(() => process.exit(0))
