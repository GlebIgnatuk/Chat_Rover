import { ChatModel, ChatType, IPrivateChatDTO } from "@/models/chat";
import { IMyPrivateChatDTO, IPrivateChatCreate, IPrivateChatRepository } from "../privateChat";
import { ID } from "../types";
import { Types } from "mongoose";
import { UserModel } from "@/models/user";

export class PrivateChatRepository implements IPrivateChatRepository {
    private static CHAT_TYPE: ChatType = 'private'

    async get(id: ID): Promise<IPrivateChatDTO | null> {
        const chats = await ChatModel.getCollection().aggregate<IPrivateChatDTO>([
            { $match: { _id: new Types.ObjectId(id) } },
            { $limit: 1 },
            {
                $lookup: {
                    from: UserModel.getCollection().name,
                    localField: 'members',
                    foreignField: '_id',
                    as: 'members'
                }
            }
        ]).toArray()

        return chats[0] ?? null
    }

    async listMyChats(userId: ID): Promise<IMyPrivateChatDTO[]> {
        const chats = await ChatModel.getCollection().aggregate<IMyPrivateChatDTO>([
            { $match: { members: new Types.ObjectId(userId) } },
            {
                $project: {
                    members: {
                        $filter: {
                            input: '$members',
                            as: 'member',
                            cond: { $ne: ['$$member', userId] },
                            limit: 1
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: UserModel.getCollection().name,
                    localField: 'members',
                    foreignField: '_id',
                    as: 'peer'
                }
            },
            {
                $unwind: {
                    path: '$peer',
                    // @todo display missing/deleted chats?
                    // preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    members: 0
                }
            }
        ]).toArray()

        return chats
    }

    async findByPeer(userId: ID, peerId: ID): Promise<IPrivateChatDTO | null> {
        const chats = await ChatModel.getCollection().aggregate<IPrivateChatDTO>([
            { $match: { members: [userId, peerId].map(id => new Types.ObjectId(id)) } },
            { $limit: 1 },
            {
                $lookup: {
                    from: UserModel.getCollection().name,
                    localField: 'members',
                    foreignField: '_id',
                    as: 'members'
                }
            }
        ]).toArray()

        return chats[0] ?? null
    }

    async hasMember(chatId: ID, memberId: ID): Promise<boolean> {
        const chat = await ChatModel.getCollection().findOne({
            _id: new Types.ObjectId(chatId),
            members: new Types.ObjectId(memberId)
        }, { projection: { _id: 1 } })

        return chat !== null
    }

    async create(payload: IPrivateChatCreate): Promise<IPrivateChatDTO> {
        const now = new Date()

        const inserted = await ChatModel.getCollection().insertOne({
            type: PrivateChatRepository.CHAT_TYPE,
            members: [payload.userId, payload.peerId].map(id => new Types.ObjectId(id)),
            createdAt: now,
            updatedAt: now
        })

        const chat = await this.get(inserted.insertedId)
        if (!chat) {
            throw new Error('Failed to create chat')
        }

        return chat
    }

    async delete(id: ID): Promise<void> {
        const chat = await ChatModel.getCollection().findOneAndDelete({
            _id: new Types.ObjectId(id)
        })
        if (!chat) {
            throw new Error('Chat does not exist')
        }
    }
}