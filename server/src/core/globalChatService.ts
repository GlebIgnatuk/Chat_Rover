import { IChatMessageRepository } from '@/repositories/chatMessage'
import { IGlobalChatRepository } from '@/repositories/globalChat'
import { IUserRepository } from '@/repositories/user'
import { ValidatedUserPayload } from '@/services/telegram'
import { Namespace, Server } from 'socket.io'

export class GlobalChatService {
    private readonly NS: Namespace

    private readonly userRepo: IUserRepository
    private readonly chatMessageRepo: IChatMessageRepository
    private readonly chatRepo: IGlobalChatRepository

    constructor(
        wss: Server,
        userRepo: IUserRepository,
        chatMessageRepo: IChatMessageRepository,
        chatRepo: IGlobalChatRepository,
    ) {
        this.NS = wss.of('/ws/chats/global')
        this.userRepo = userRepo
        this.chatMessageRepo = chatMessageRepo
        this.chatRepo = chatRepo
    }

    getSubscribersCount(slug: string) {
        return this.NS.adapter.rooms.get(slug)?.size ?? 0
    }

    async sendMessage(slug: string, text: string, ctx: ValidatedUserPayload) {
        if (text.length === 0) {
            throw new Error("Message can't be empty")
        }

        const sender = await this.userRepo.getByExternalId(ctx.user.id)
        if (!sender) {
            throw new Error('No such user')
        }

        const chat = await this.chatRepo.getBySlug(slug)
        if (!chat) {
            throw new Error('No such chat')
        }

        const message = await this.chatMessageRepo.create({
            chatId: chat._id,
            userId: sender._id,
            text: text,
        })

        this.NS.to(slug).emit('messages:post', message)
        // this.NS.emit('messages:post', message)

        return message
    }
}
