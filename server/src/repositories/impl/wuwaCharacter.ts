import { ID } from '../types'
import { Types } from 'mongoose'
import { IWuwaCharacterRepository } from '../wuwaCharacter'
import { IWuwaCharacterDTO, WuwaCharacterModel } from '@/models/wuwaCharacter'

export class WuwaCharacterRepository implements IWuwaCharacterRepository {
    async get(id: ID): Promise<IWuwaCharacterDTO | null> {
        return WuwaCharacterModel.getCollection().findOne({ _id: new Types.ObjectId(id) })
    }

    async list(): Promise<IWuwaCharacterDTO[]> {
        return WuwaCharacterModel.getCollection().find().toArray()
    }
}
