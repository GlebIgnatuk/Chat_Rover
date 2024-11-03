import { IGlobalChatDTO } from '@/models/chat'
import { ID } from './types'

export interface IGlobalChatCreate {
    title: string
    slug: string
    description?: string
}

export interface IGlobalChatRepository {
    get(id: ID): Promise<IGlobalChatDTO | null>
    getBySlug(slug: string): Promise<IGlobalChatDTO | null>
    list(): Promise<IGlobalChatDTO[]>
    create(payload: IGlobalChatCreate): Promise<IGlobalChatDTO>
}
