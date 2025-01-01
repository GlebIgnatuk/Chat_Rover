import { SUPPORTED_SERVERS } from '@/config/config'
import { GlobalChatModel, IGlobalChatModel } from '@/models/chat'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)
    // await GlobalChatModel.getCollection().deleteMany({ type: 'global' })

    const now = new Date()

    const chats: Omit<IGlobalChatModel, 'createdAt' | 'updatedAt'>[] = [
        {
            title: 'Global',
            slug: 'global',
            type: 'global',
            description: '',
        },
        ...SUPPORTED_SERVERS.map<Omit<IGlobalChatModel, 'createdAt' | 'updatedAt'>>((s) => ({
            title: s,
            slug: s.toLowerCase(),
            type: 'global',
            description: '',
        })),
    ]

    const mapped = chats.map<IGlobalChatModel>((c) => ({
        ...c,
        createdAt: now,
        updatedAt: now,
    }))

    const filtered: IGlobalChatModel[] = []

    for (const c of mapped) {
        const found = await GlobalChatModel.getCollection().findOne({
            type: 'global',
            slug: c.slug,
        })
        if (found) continue

        filtered.push(c)
    }

    if (filtered.length !== 0) await GlobalChatModel.getCollection().insertMany(filtered)

    console.log('Done!')
}

main().then(() => process.exit(0))
