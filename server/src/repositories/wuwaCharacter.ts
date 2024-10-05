import { ID } from './types'
import { IWuwaCharacterDTO } from '@/models/wuwaCharacter'

export interface IWuwaCharacterRepository {
    get(id: ID): Promise<IWuwaCharacterDTO | null>
    list(): Promise<IWuwaCharacterDTO[]>
}
