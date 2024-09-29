import { ChatMessageModel, IChatMessageDTO, MessageType } from '@/models/chatMessage'
import { IChatMessageCreate, IChatMessagePatch, IChatMessageRepository } from '../chatMessage'
import { ID, PaginationOptions } from '../types'
import { Types } from 'mongoose'
import { UserModel } from '@/models/user'
import { IPrivateChatRepository } from '../privateChat'

export class ChatMessageRepository implements IChatMessageRepository {
    private readonly chatRepo: IPrivateChatRepository

    constructor(chatRepo: IPrivateChatRepository) {
        this.chatRepo = chatRepo
    }

    async get(id: ID): Promise<IChatMessageDTO | null> {
        const messages = await ChatMessageModel.getCollection()
            .aggregate<IChatMessageDTO>([
                { $match: { _id: new Types.ObjectId(id) } },
                { $limit: 1 },
                {
                    $lookup: {
                        from: UserModel.getCollection().name,
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdBy',
                    },
                },
                {
                    $unwind: {
                        path: '$createdBy',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ])
            .toArray()

        return messages[0] ?? null
    }

    async list(chatId: ID, options?: PaginationOptions): Promise<IChatMessageDTO[]> {
        const page = options?.page ?? 0
        const limit = options?.limit ?? 15

        const messages = ChatMessageModel.getCollection()
            .aggregate<IChatMessageDTO>([
                { $match: { chatId: new Types.ObjectId(chatId) } },
                { $sort: { createdAt: -1 } },
                { $skip: page * limit },
                { $limit: limit },
                {
                    $lookup: {
                        from: UserModel.getCollection().name,
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdBy',
                    },
                },
                {
                    $unwind: {
                        path: '$createdBy',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ])
            .toArray()

        return messages
    }

    async create(payload: IChatMessageCreate): Promise<IChatMessageDTO> {
        const now = new Date()

        const type: MessageType = 'text'

        const inserted = await ChatMessageModel.getCollection().insertOne({
            chatId: new Types.ObjectId(payload.chatId),
            createdBy: new Types.ObjectId(payload.userId),
            text: payload.text,
            type: type,
            createdAt: now,
            updatedAt: now,
        })
        const message = await this.get(inserted.insertedId)
        if (!message) {
            throw new Error('Failed to create message')
        }

        // @todo add transactions
        await this.chatRepo.patch(payload.chatId, {
            lastMessageSentAt: now,
        })
        await new Promise((res) => setTimeout(res, Math.random() * 4000 + 1000))
        return message
    }

    async patch(messageId: ID, payload: IChatMessagePatch): Promise<IChatMessageDTO | null> {
        const update: Record<string, any> = {}

        // @todo add helper function
        if (payload.text !== undefined) {
            update.text = payload.text
        }

        update.updatedAt = new Date()

        const updated = await ChatMessageModel.getCollection().updateOne(
            { _id: new Types.ObjectId(messageId) },
            { $set: update },
        )

        if (updated.modifiedCount === 0) {
            throw new Error('No such message')
        }

        return this.get(messageId)
    }

    async delete(id: ID): Promise<void> {
        const deleted = await ChatMessageModel.getCollection().findOneAndDelete({
            _id: new Types.ObjectId(id),
        })

        if (!deleted) {
            throw new Error('No such message')
        }
    }
}
