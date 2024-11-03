import { ChatType, GlobalChatModel, IGlobalChatDTO } from '@/models/chat'
import { IGlobalChatCreate, IGlobalChatRepository } from '../globalChat'
import { ID } from '../types'
import { Types } from 'mongoose'

export class GlobalChatRepository implements IGlobalChatRepository {
    private static CHAT_TYPE: ChatType = 'global'

    async get(id: ID): Promise<IGlobalChatDTO | null> {
        const chat = await GlobalChatModel.getCollection().findOne({
            _id: new Types.ObjectId(id),
            type: GlobalChatRepository.CHAT_TYPE,
        })

        return chat
    }

    async getBySlug(slug: string): Promise<IGlobalChatDTO | null> {
        const chat = await GlobalChatModel.getCollection().findOne({
            slug,
            type: GlobalChatRepository.CHAT_TYPE,
        })

        return chat
    }

    async list(): Promise<IGlobalChatDTO[]> {
        const chats = await GlobalChatModel.getCollection()
            .find({ type: GlobalChatRepository.CHAT_TYPE })
            .toArray()

        return chats
    }

    async create(payload: IGlobalChatCreate): Promise<IGlobalChatDTO> {
        const now = new Date()

        const inserted = await GlobalChatModel.getCollection().insertOne({
            type: GlobalChatRepository.CHAT_TYPE,
            title: payload.title,
            slug: payload.slug,
            description: payload.description,
            createdAt: now,
            updatedAt: now,
        })

        const chat = await this.get(inserted.insertedId)
        if (!chat) {
            throw new Error('Failed to create global chat')
        }

        return chat
    }
}
