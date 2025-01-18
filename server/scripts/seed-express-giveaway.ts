import { ExpressGiveawayRepository } from '@/repositories/impl/expressGiveaway'
import { GiveawayItemRepository } from '@/repositories/impl/giveawayItem'
import { UserRepository } from '@/repositories/impl/user'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const userRepo = new UserRepository()
    const itemRepo = new GiveawayItemRepository()
    const giveawayRepo = new ExpressGiveawayRepository(userRepo, itemRepo)

    const item = await itemRepo.create({
        name: 'Lunite Subscription',
        photoPath: '/public/products/lunite_subscription.png',
    })

    const now = new Date()

    for (let i = 0; i < 14; i++) {
        const giveaway = await giveawayRepo.create({
            name: `Express Giveaway #${i + 1}`,
            giveawayItemId: item._id,
            cost: 5,
            minParticipants: 25,
            maxParticipants: 1000,
            maxWinners: 1,
            durationInSeconds: 3 * 60 * 60, // 3 hours
            scheduledAt: new Date(now.getTime() + i * 12 * 60 * 60 * 1000),
        })

        console.log('Done!', giveaway._id, '\n')
    }
}

main().then(() => process.exit(0))
