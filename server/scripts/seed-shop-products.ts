import { GameModel, IGameDTO } from '@/models/game'
import { ShopProductModel } from '@/models/shopProduct'
import { ShopProductRepository } from '@/repositories/impl/shopProduct'
import { IShopProductCreate } from '@/repositories/shopProduct'
import { MongoDBService } from '@/services/database'
import { Types } from 'mongoose'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const repo = new ShopProductRepository()

    const games = await GameModel.getCollection().find().toArray()
    const gamesBySlug = games.reduce<Record<string, IGameDTO>>((acc, n) => {
        acc[n.slug] = n
        return acc
    }, {})

    const wuwaGame = gamesBySlug['wuthering-waves']
    if (!wuwaGame) throw new Error('Wuwa game not found')
    const wuwaProducts: IShopProductCreate[] = [
        {
            name: 'Lunite subscription',
            photoPath: '/products/wuthering-waves/lunite_subscription.png',
            category: 'Special Offers',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 499 },
                { currency: 'XLNT', price: 675 },
            ],
        },
        {
            name: 'Insider Channel',
            photoPath: '/products/wuthering-waves/insider_channel.png',
            category: 'Channel',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 949 },
                { currency: 'XLNT', price: 1349 },
            ],
        },
        {
            name: 'Connoiseur Channel',
            photoPath: '/products/wuthering-waves/connoiseur_channel.png',
            category: 'Channel',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 1840 },
                { currency: 'XLNT', price: 2685 },
            ],
        },

        {
            name: 'Lunite x60',
            photoPath: '/products/wuthering-waves/lunite-60.png',
            category: 'Purchase',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 149 },
                { currency: 'XLNT', price: 149 },
            ],
        },
        {
            name: 'Lunite x300',
            photoPath: '/products/wuthering-waves/lunite-60.png',
            category: 'Purchase',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 499 },
                { currency: 'XLNT', price: 675 },
            ],
        },
        {
            name: 'Lunite x980',
            photoPath: '/products/wuthering-waves/lunite-60.png',
            category: 'Purchase',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 1340 },
                { currency: 'XLNT', price: 1935 },
            ],
        },
        {
            name: 'Lunite x1980',
            photoPath: '/products/wuthering-waves/lunite-60.png',
            category: 'Purchase',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 2540 },
                { currency: 'XLNT', price: 3735 },
            ],
        },
        {
            name: 'Lunite x3280',
            photoPath: '/products/wuthering-waves/lunite-60.png',
            category: 'Purchase',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 4540 },
                { currency: 'XLNT', price: 6735 },
            ],
        },
        {
            name: 'Lunite x6480',
            photoPath: '/products/wuthering-waves/lunite-60.png',
            category: 'Purchase',
            gameId: wuwaGame._id,
            prices: [
                { currency: 'RUB', price: 9040 },
                { currency: 'XLNT', price: 13485 },
            ],
        },
    ]

    const honkaiGame = gamesBySlug['honkai-star-rail']
    if (!honkaiGame) throw new Error('Honkai game not found')
    const honkaiProducts: IShopProductCreate[] = [
        {
            name: 'Express Supply Pass',
            photoPath: '/products/honkai-star-rail/express-supply-pass.png',
            category: 'Express Supply Pass',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 499 },
                { currency: 'XLNT', price: 675 },
            ],
        },

        {
            name: 'The Nameless Glory',
            photoPath: '/products/honkai-star-rail/the-nameless-glory.png',
            category: 'Nameless Honor',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 949 },
                { currency: 'XLNT', price: 1349 },
            ],
        },
        {
            name: 'The Nameless Medal',
            photoPath: '/products/honkai-star-rail/the-nameless-medal.png',
            category: 'Nameless Honor',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 1840 },
                { currency: 'XLNT', price: 2685 },
            ],
        },

        {
            name: 'Oneiric Shard x60',
            photoPath: '/products/honkai-star-rail/oneiric-shard-60.png',
            category: 'Purchase',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 149 },
                { currency: 'XLNT', price: 149 },
            ],
        },
        {
            name: 'Oneiric Shard x300',
            photoPath: '/products/honkai-star-rail/oneiric-shard-60.png',
            category: 'Purchase',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 499 },
                { currency: 'XLNT', price: 675 },
            ],
        },
        {
            name: 'Oneiric Shard x980',
            photoPath: '/products/honkai-star-rail/oneiric-shard-60.png',
            category: 'Purchase',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 1340 },
                { currency: 'XLNT', price: 1935 },
            ],
        },
        {
            name: 'Oneiric Shard x1980',
            photoPath: '/products/honkai-star-rail/oneiric-shard-60.png',
            category: 'Purchase',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 2540 },
                { currency: 'XLNT', price: 3735 },
            ],
        },
        {
            name: 'Oneiric Shard x3280',
            photoPath: '/products/honkai-star-rail/oneiric-shard-60.png',
            category: 'Purchase',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 4540 },
                { currency: 'XLNT', price: 6735 },
            ],
        },
        {
            name: 'Oneiric Shard x6480',
            photoPath: '/products/honkai-star-rail/oneiric-shard-60.png',
            category: 'Purchase',
            gameId: honkaiGame._id,
            prices: [
                { currency: 'RUB', price: 9040 },
                { currency: 'XLNT', price: 13485 },
            ],
        },
    ]

    const zenlessGame = gamesBySlug['zenless-zone-zero']
    if (!zenlessGame) throw new Error('Zenless game not found')
    const zenlessProducts: IShopProductCreate[] = [
        {
            name: 'Inter-Knot Membership',
            photoPath: '/products/zenless-zone-zero/inter-knot-membership.png',
            category: 'Inter-Knot Membership',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 499 },
                { currency: 'XLNT', price: 675 },
            ],
        },

        {
            name: 'New Eridu City Fund: Growth Plan',
            photoPath: '/products/zenless-zone-zero/new-eridu-city-plan-growth-plan.png',
            category: 'New Eridu City Fund',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 949 },
                { currency: 'XLNT', price: 1349 },
            ],
        },
        {
            name: 'New Eridu City Fund: Premium Plan',
            photoPath: '/products/zenless-zone-zero/new-eridu-city-plan-premium-plan.png',
            category: 'New Eridu City Fund',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 1840 },
                { currency: 'XLNT', price: 2685 },
            ],
        },

        {
            name: 'Monochrome x60',
            photoPath: '/products/zenless-zone-zero/monochrome-60.png',
            category: 'Purchase',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 149 },
                { currency: 'XLNT', price: 149 },
            ],
        },
        {
            name: 'Monochrome x300',
            photoPath: '/products/zenless-zone-zero/monochrome-60.png',
            category: 'Purchase',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 499 },
                { currency: 'XLNT', price: 675 },
            ],
        },
        {
            name: 'Monochrome x980',
            photoPath: '/products/zenless-zone-zero/monochrome-60.png',
            category: 'Purchase',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 1340 },
                { currency: 'XLNT', price: 1935 },
            ],
        },
        {
            name: 'Monochrome x1980',
            photoPath: '/products/zenless-zone-zero/monochrome-60.png',
            category: 'Purchase',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 2540 },
                { currency: 'XLNT', price: 3735 },
            ],
        },
        {
            name: 'Monochrome x3280',
            photoPath: '/products/zenless-zone-zero/monochrome-60.png',
            category: 'Purchase',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 4540 },
                { currency: 'XLNT', price: 6735 },
            ],
        },
        {
            name: 'Monochrome x6480',
            photoPath: '/products/zenless-zone-zero/monochrome-60.png',
            category: 'Purchase',
            gameId: zenlessGame._id,
            prices: [
                { currency: 'RUB', price: 9040 },
                { currency: 'XLNT', price: 13485 },
            ],
        },
    ]

    const genshinGame = gamesBySlug['genshin-impact']
    if (!genshinGame) throw new Error('Genshin game not found')
    const genshinProducts: IShopProductCreate[] = [
        {
            name: 'Blessing of the Welkin Moon',
            photoPath: '/products/genshin-impact/blessing-of-the-welkin-moon.png',
            category: 'Blessing of the Welkin Moon',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 499 },
                { currency: 'XLNT', price: 675 },
            ],
        },

        {
            name: 'Gnostic Hymn',
            photoPath: '/products/genshin-impact/gnostic-hymn.png',
            category: 'Battle Pass',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 949 },
                { currency: 'XLNT', price: 1349 },
            ],
        },
        {
            name: 'Gnostic Chorus',
            photoPath: '/products/genshin-impact/gnostic-chorus.png',
            category: 'Battle Pass',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 1840 },
                { currency: 'XLNT', price: 2685 },
            ],
        },

        {
            name: 'Genesis Crystals x60',
            photoPath: '/products/genshin-impact/genesis-crystals-60.png',
            category: 'Purchase',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 149 },
                { currency: 'XLNT', price: 149 },
            ],
        },
        {
            name: 'Genesis Crystals x300',
            photoPath: '/products/genshin-impact/genesis-crystals-60.png',
            category: 'Purchase',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 499 },
                { currency: 'XLNT', price: 675 },
            ],
        },
        {
            name: 'Genesis Crystals x980',
            photoPath: '/products/genshin-impact/genesis-crystals-60.png',
            category: 'Purchase',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 1340 },
                { currency: 'XLNT', price: 1935 },
            ],
        },
        {
            name: 'Genesis Crystals x1980',
            photoPath: '/products/genshin-impact/genesis-crystals-60.png',
            category: 'Purchase',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 2540 },
                { currency: 'XLNT', price: 3735 },
            ],
        },
        {
            name: 'Genesis Crystals x3280',
            photoPath: '/products/genshin-impact/genesis-crystals-60.png',
            category: 'Purchase',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 4540 },
                { currency: 'XLNT', price: 6735 },
            ],
        },
        {
            name: 'Genesis Crystals x6480',
            photoPath: '/products/genshin-impact/genesis-crystals-60.png',
            category: 'Purchase',
            gameId: genshinGame._id,
            prices: [
                { currency: 'RUB', price: 9040 },
                { currency: 'XLNT', price: 13485 },
            ],
        },
    ]

    const products = [...wuwaProducts, ...honkaiProducts, ...zenlessProducts, ...genshinProducts]

    for (const p of products) {
        const exsting = await ShopProductModel.getCollection().findOne({
            name: p.name,
            category: p.category,
        })
        if (exsting) {
            await ShopProductModel.getCollection().updateOne(
                { _id: exsting._id },
                {
                    $set: {
                        category: p.category,
                        gameId: p.gameId ? new Types.ObjectId(p.gameId) : null,
                        photoPath: p.photoPath,
                        prices: p.prices,
                    },
                },
            )
            console.log(`Updated: ${exsting._id}`)
        } else {
            const product = await repo.create(p)
            console.log(`Created: ${product._id}`)
        }
    }

    console.log('Done!')
}

main().then(() => process.exit(0))
