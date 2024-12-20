import { ITranslationDTO, TranslationModel } from '@/models/translation'
import { ID } from '../types'
import { ITranslationCreate, ITranslationRepository, ITranslationUpdate } from '../translation'
import { Types } from 'mongoose'

export class TranslationRepository implements ITranslationRepository {
    async get(id: ID): Promise<ITranslationDTO | null> {
        return TranslationModel.getCollection().findOne({ _id: new Types.ObjectId(id) })
    }

    async getAll(): Promise<ITranslationDTO[]> {
        return TranslationModel.getCollection().find({}).toArray()
    }    

    async getByLanguage(language: string): Promise<Record<string, string>> {
        const translations = await TranslationModel.getCollection().find({ language }).toArray()
        return translations.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)
    }

    async create(payload: ITranslationCreate): Promise<ITranslationDTO> {
        const result = await TranslationModel.getCollection().insertOne({
            ...payload,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        return this.get(result.insertedId) as Promise<ITranslationDTO>
    }

    async update(id: ID, payload: ITranslationUpdate): Promise<ITranslationDTO | null> {
        await TranslationModel.getCollection().updateOne(
            { _id: new Types.ObjectId(id) },
            {
                $set: { ...payload, updatedAt: new Date() },
            },
        )
        return this.get(id)
    }

    async delete(id: ID): Promise<boolean> {
        const result = await TranslationModel.getCollection().deleteOne({ _id: new Types.ObjectId(id) })
        return result.deletedCount > 0
    }
}
