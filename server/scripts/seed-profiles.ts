import { SUPPORTED_LANGUAGES, SUPPORTED_SERVERS } from '@/config/config'
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

    const userId = process.env.USER_ID
    if (!userId) throw new Error('USER_ID is missing')

    const repo = new ProfileRepository(new UserRepository())
    const charactersRepo = new WuwaCharacterRepository()

    const characters = await charactersRepo.list()
    if (characters.length === 0) throw new Error('No wuwa characters found')

    for (let i = 0; i < 1173; i++) {
        const languagesCount = Math.floor(Math.random() * (4 - 1)) + 1
        const languagesIndex = Math.floor(
            Math.random() * (SUPPORTED_LANGUAGES.length - languagesCount),
        )

        await repo.create({
            about: `Hello from ${i + 1}`,
            languages: SUPPORTED_LANGUAGES.slice(languagesIndex, languagesIndex + languagesCount),
            nickname: randomString(4, 10),
            server: SUPPORTED_SERVERS[Math.floor(Math.random() * SUPPORTED_SERVERS.length)],
            team: Array.from({ length: 3 }, (_) => ({
                characterId: characters[Math.floor(Math.random() * characters.length)]._id,
                constellation: Math.floor(Math.random() * (6 - 1)) + 1,
                level: Math.floor(Math.random() * (90 - 1)) + 1,
            })),
            uid: Math.floor(Math.random() * (999_999_999 - 100_000_000)) + 100_000_000,
            userId: new Types.ObjectId(userId),
            usesVoice: Math.round(Math.random()) === 0,
            worldLevel: Math.floor(Math.random() * (8 - 1)) + 1,
        })

        console.log(`Created #${i + 1}`)
    }

    console.log('Done!')
}

main().then(() => process.exit(0))
