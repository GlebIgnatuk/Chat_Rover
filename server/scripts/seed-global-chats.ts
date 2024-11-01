import { GlobalChatModel, IGlobalChatModel } from '@/models/chat'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)
    await GlobalChatModel.getCollection().deleteMany({ type: "global" })

    const now = new Date()

    const chats: Omit<IGlobalChatModel, 'createdAt' | 'updatedAt'>[] = [
        {
            title: "Ching Chong",
            type: "global",
            description: "For yellow people"
        },
        {
            title: "Niggers",
            type: "global",
            description: "For KSI people"
        },
        {
            title: "Jew",
            type: "global",
            description: "For greedy people"
        },
    ]

    const mapped = chats.map<IGlobalChatModel>((c) => ({
        ...c,
        createdAt: now,
        updatedAt: now,
    }))

    await GlobalChatModel.getCollection().insertMany(mapped)

    console.log('Done!')
}

main().then(() => process.exit(0))
