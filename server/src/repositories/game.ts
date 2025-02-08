import { IGameDTO } from '@/models/game'

export interface IGameRepository {
    list(): Promise<IGameDTO[]>
}
