import { GameModel, IGameDTO } from '@/models/game'
import { IGameRepository } from '../game'

export class GameRepository implements IGameRepository {
    async list(): Promise<IGameDTO[]> {
        return GameModel.getCollection().find().toArray()
    }
}
