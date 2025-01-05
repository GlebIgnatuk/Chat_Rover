import { ExpressGiveawayRepository } from '@/repositories/impl/expressGiveaway'
import { GiveawayItemRepository } from '@/repositories/impl/giveawayItem'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const itemRepo = new GiveawayItemRepository()
    const giveawayRepo = new ExpressGiveawayRepository(itemRepo)

    const item = await itemRepo.create({
        name: 'Lunite Subscription',
        photoUrl: 'http://localhost:3000/public/products/lunite_subscription.png',
    })

    const giveaway = await giveawayRepo.create({
        name: 'Express Giveaway #22',
        giveawayItemId: item._id,
        cost: 2,
        minParticipants: 1,
        maxParticipants: 10,
        maxWinners: 1,
        durationInSeconds: 5 * 60,
    })

    console.log('Done!', giveaway._id, '\n')
    console.log(JSON.stringify(giveaway, null, 2))
}

main().then(() => process.exit(0))
