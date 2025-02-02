import { ShopProductRepository } from '@/repositories/impl/shopProduct'
import { IShopProductCreate } from '@/repositories/shopProduct'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const repo = new ShopProductRepository()

    const products: IShopProductCreate[] = [
        {
            name: 'Lunite subscription',
            photoPath: '/products/lunite_subscription.png',
            category: 'Special Offers',
            prices: [
                { currency: 'RUB', price: 449 },
                { currency: 'XLNT', price: 675 },
            ],
        },
        {
            name: 'Insider Channel',
            photoPath: '/products/insider_channel.png',
            category: 'Channel',
            prices: [
                { currency: 'RUB', price: 899 },
                { currency: 'XLNT', price: 1349 },
            ],
        },
        {
            name: 'Connoiseur Channel',
            photoPath: '/products/connoiseur_channel.png',
            category: 'Channel',
            prices: [
                { currency: 'RUB', price: 1790 },
                { currency: 'XLNT', price: 2685 },
            ],
        },

        {
            name: 'Lunite x60',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', price: 99 },
                { currency: 'XLNT', price: 149 },
            ],
        },
        {
            name: 'Lunite x300',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', price: 449 },
                { currency: 'XLNT', price: 675 },
            ],
        },
        {
            name: 'Lunite x980',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', price: 1290 },
                { currency: 'XLNT', price: 1935 },
            ],
        },
        {
            name: 'Lunite x1980',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', price: 2490 },
                { currency: 'XLNT', price: 3735 },
            ],
        },
        {
            name: 'Lunite x3280',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', price: 4490 },
                { currency: 'XLNT', price: 6735 },
            ],
        },
        {
            name: 'Lunite x6480',
            photoPath: '/currency/lunite.png',
            category: 'Purchase',
            prices: [
                { currency: 'RUB', price: 8990 },
                { currency: 'XLNT', price: 13485 },
            ],
        },

        {
            name: "Vault's Tide Collection",
            photoPath: '/products/vaults_tide_collection.png',
            category: 'Special Offers',
            prices: [
                { currency: 'RUB', price: 249 },
                { currency: 'XLNT', price: 375 },
            ],
        },
        {
            name: "Vault's Radiant Collection I",
            photoPath: '/products/vaults_tide_collection.png',
            category: 'Special Offers',
            prices: [
                { currency: 'RUB', price: 899 },
                { currency: 'XLNT', price: 1350 },
            ],
        },
        {
            name: "Vault's Forging Collection",
            photoPath: '/products/vaults_tide_collection.png',
            category: 'Special Offers',
            prices: [
                { currency: 'RUB', price: 899 },
                { currency: 'XLNT', price: 1350 },
            ],
        },
        {
            name: "Vault's Tide Selection",
            photoPath: '/products/vaults_tide_collection.png',
            category: 'Special Offers',
            prices: [
                { currency: 'RUB', price: 1790 },
                { currency: 'XLNT', price: 2685 },
            ],
        },
        {
            name: "Vault's Radiant Collection II",
            photoPath: '/products/vaults_tide_collection.png',
            category: 'Special Offers',
            prices: [
                { currency: 'RUB', price: 2490 },
                { currency: 'XLNT', price: 3735 },
            ],
        },
    ]

    for (const p of products) {
        const product = await repo.create(p)
        console.log(`Created: ${product._id}`)
    }

    console.log('Done!')
}

main().then(() => process.exit(0))
