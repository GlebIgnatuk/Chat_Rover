import { ID } from './types'
import { ITranslationDTO } from '@/models/translation'

export interface ITranslationCreate {
    key: string
    description: string
    language: string
    value: string
}

export interface ITranslationUpdate extends Partial<ITranslationCreate> {}

export interface ITranslationRepository {
    getAll(): Promise<ITranslationDTO[]>
    getByLanguage(language: string): Promise<Record<string, string>>
    create(payload: ITranslationCreate): Promise<ITranslationDTO>
    update(id: ID, payload: ITranslationUpdate): Promise<ITranslationDTO | null>
    delete(id: ID): Promise<boolean>
}

