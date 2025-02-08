import { GameModel, IGameModel } from '@/models/game'
import { ShopProductRepository } from '@/repositories/impl/shopProduct'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const now = new Date()

    const games: IGameModel[] = [
        {
            name: 'Wuthering Waves',
            slug: 'wuthering-waves',
            photoPath: '/games/wuthering-waves.png',
            createdAt: now,
            updatedAt: now,
        },
        {
            name: 'Honkai: Star Rail',
            slug: 'honkai-star-rail',
            photoPath: '/games/honkai-star-rail.png',
            createdAt: now,
            updatedAt: now,
        },
        {
            name: 'Zenless Zone Zero',
            slug: 'zenless-zone-zero',
            photoPath: '/games/zenless-zone-zero.png',
            createdAt: now,
            updatedAt: now,
        },
        {
            name: 'Genshin Impact',
            slug: 'genshin-impact',
            photoPath: '/games/genshin-impact.png',
            createdAt: now,
            updatedAt: now,
        },
    ]

    await GameModel.getCollection().insertMany(games)

    console.log('Done!')
}

main().then(() => process.exit(0))
