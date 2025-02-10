import { GameModel, IGameModel } from '@/models/game'
import { IWuwaCharacterDTO } from '@/models/wuwaCharacter'
import { CharacterQuizRepository } from '@/repositories/impl/characterQuiz'
import { ShopProductRepository } from '@/repositories/impl/shopProduct'
import { WuwaCharacterRepository } from '@/repositories/impl/wuwaCharacter'
import { MongoDBService } from '@/services/database'

async function main() {
    await MongoDBService.lazy(process.env.MONGO_URI)

    const now = new Date()

    const charactersRepo = new WuwaCharacterRepository()
    const quizRepo = new CharacterQuizRepository(charactersRepo)

    const allCharacters = await charactersRepo.list()
    const pickedCharacters: IWuwaCharacterDTO[] = []

    const startAt = new Date('2025-02-09T18:00:00Z')

    for (let i = 1; i < allCharacters.length; i++) {
        if (allCharacters.length === 0 && pickedCharacters.length === 0) {
            throw new Error('Nothing to pick')
        }

        if (allCharacters.length === 0) {
            allCharacters.push(...pickedCharacters)
            pickedCharacters.splice(0, pickedCharacters.length)
        }

        const randomIdx = Math.floor(Math.random() * allCharacters.length)
        const picked = allCharacters.splice(randomIdx, 1)
        pickedCharacters.push(picked[0])

        await quizRepo.create({
            name: `Quiz #${i + 1}`,
            characterId: picked[0]._id,
            scheduledAt: new Date(startAt.getTime() + 24 * 60 * 60 * 1000 * i),
        })
    }

    console.log('Done!')
}

main().then(() => process.exit(0))
