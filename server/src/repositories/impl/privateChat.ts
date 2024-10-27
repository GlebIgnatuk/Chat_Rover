import { ChatModel, ChatType, IPrivateChatDTO } from '@/models/chat'
import {
    IPrivateChatCreate,
    IPrivateChatPatch,
    IPrivateChatRepository,
    IPrivateChatWithMetadataDTO,
} from '../privateChat'
import { ID } from '../types'
import { Types } from 'mongoose'
import { UserModel } from '@/models/user'
import { ChatMessageModel } from '@/models/chatMessage'

export class PrivateChatRepository implements IPrivateChatRepository {
    private static CHAT_TYPE: ChatType = 'private'

    async get(id: ID): Promise<IPrivateChatDTO | null> {
        const chats = await ChatModel.getCollection()
            .aggregate<IPrivateChatDTO>([
                { $match: { _id: new Types.ObjectId(id) } },
                { $limit: 1 },
                {
                    $lookup: {
                        from: UserModel.getCollection().name,
                        localField: 'members',
                        foreignField: '_id',
                        as: 'members',
                    },
                },
            ])
            .toArray()

        return chats[0] ?? null
    }

    async getWithMetadata(id: ID, userId: ID): Promise<IPrivateChatWithMetadataDTO | null> {
        const chats = await ChatModel.getCollection()
            .aggregate<IPrivateChatWithMetadataDTO>([
                {
                    $match: { _id: new Types.ObjectId(id) },
                },
                {
                    $limit: 1,
                },
                {
                    $project: {
                        members: {
                            $filter: {
                                input: '$members',
                                as: 'member',
                                cond: { $ne: ['$$member', new Types.ObjectId(userId)] },
                                limit: 1,
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: UserModel.getCollection().name,
                        localField: 'members',
                        foreignField: '_id',
                        as: 'peer',
                    },
                },
                {
                    $unwind: {
                        path: '$peer',
                        // @todo display missing/deleted chats?
                        // preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup: {
                        from: ChatMessageModel.getCollection().name,
                        localField: '_id',
                        foreignField: 'chatId',
                        as: 'lastMessage',
                        pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
                    },
                },
                {
                    $unwind: {
                        path: '$lastMessage',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        members: 0,
                    },
                },
            ])
            .toArray()

        return chats[0] ?? null
    }

    async list(userId: ID): Promise<IPrivateChatWithMetadataDTO[]> {
        const chats = await ChatModel.getCollection()
            .aggregate<IPrivateChatWithMetadataDTO>([
                { $match: { members: new Types.ObjectId(userId) } },
                {
                    $project: {
                        lastMessageSentAt: 1,
                        members: {
                            $filter: {
                                input: '$members',
                                as: 'member',
                                cond: { $ne: ['$$member', new Types.ObjectId(userId)] },
                                limit: 1,
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: UserModel.getCollection().name,
                        localField: 'members',
                        foreignField: '_id',
                        as: 'peer',
                    },
                },
                {
                    $unwind: {
                        path: '$peer',
                        // @todo display missing/deleted chats?
                        // preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup: {
                        from: ChatMessageModel.getCollection().name,
                        localField: '_id',
                        foreignField: 'chatId',
                        as: 'lastMessage',
                        pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
                    },
                },
                {
                    $unwind: {
                        path: '$lastMessage',
                        // preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $sort: {
                        lastMessageSentAt: -1,
                    },
                },
                {
                    $project: {
                        lastMessageSentAt: 0,
                        members: 0,
                    },
                },
            ])
            .toArray()

        return chats
    }

    async findByPeer(userId: ID, peerId: ID): Promise<IPrivateChatWithMetadataDTO | null> {
        const chats = await ChatModel.getCollection()
            .aggregate<IPrivateChatWithMetadataDTO>([
                {
                    $match: {
                        members: { $all: [userId, peerId].map((id) => new Types.ObjectId(id)) },
                    },
                },
                {
                    $limit: 1,
                },
                {
                    $project: {
                        members: {
                            $filter: {
                                input: '$members',
                                as: 'member',
                                cond: { $ne: ['$$member', new Types.ObjectId(userId)] },
                                limit: 1,
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: UserModel.getCollection().name,
                        localField: 'members',
                        foreignField: '_id',
                        as: 'peer',
                    },
                },
                {
                    $unwind: {
                        path: '$peer',
                        // @todo display missing/deleted chats?
                        // preserveNullAndEmptyArrays: true
                    },
                },
                {
                    $lookup: {
                        from: ChatMessageModel.getCollection().name,
                        localField: '_id',
                        foreignField: 'chatId',
                        as: 'lastMessage',
                        pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
                    },
                },
                {
                    $unwind: {
                        path: '$lastMessage',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        members: 0,
                    },
                },
            ])
            .toArray()

        return chats[0] ?? null
    }

    async hasMember(chatId: ID, memberId: ID): Promise<boolean> {
        const chat = await ChatModel.getCollection().findOne(
            {
                _id: new Types.ObjectId(chatId),
                members: new Types.ObjectId(memberId),
            },
            { projection: { _id: 1 } },
        )

        return chat !== null
    }

    async create(payload: IPrivateChatCreate): Promise<IPrivateChatDTO> {
        const now = new Date()

        const inserted = await ChatModel.getCollection().insertOne({
            type: PrivateChatRepository.CHAT_TYPE,
            members: [payload.userId, payload.peerId].map((id) => new Types.ObjectId(id)),
            lastMessageSentAt: now,
            createdAt: now,
            updatedAt: now,
        })

        const chat = await this.get(inserted.insertedId)
        if (!chat) {
            throw new Error('Failed to create chat')
        }

        return chat
    }

    async patch(id: ID, payload: IPrivateChatPatch): Promise<IPrivateChatDTO | null> {
        const now = new Date()

        const update: Record<string, any> = {}
        if (payload.lastMessageSentAt) {
            update.lastMessageSentAt = payload.lastMessageSentAt
        }
        update.updatedAt = now

        const updated = await ChatModel.getCollection().findOneAndUpdate(
            { _id: new Types.ObjectId(id) },
            { $set: update },
            { returnDocument: 'after' },
        )
        if (!updated) return null

        return this.get(updated._id)
    }

    async delete(id: ID): Promise<void> {
        const chat = await ChatModel.getCollection().findOneAndDelete({
            _id: new Types.ObjectId(id),
        })
        if (!chat) {
            throw new Error('Chat does not exist')
        }
    }
}
