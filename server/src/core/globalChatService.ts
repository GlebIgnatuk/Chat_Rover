import { IChatMessageRepository } from '@/repositories/chatMessage'
import { IGlobalChatRepository } from '@/repositories/globalChat'
import { IUserRepository } from '@/repositories/user'
import { ValidatedUserPayload } from '@/services/telegram'
import { Namespace, Server } from 'socket.io'

export class GlobalChatService {
    private readonly NS: Namespace

    private readonly userRepo: IUserRepository
    private readonly chatMessageRepo: IChatMessageRepository

    constructor(
        wss: Server,
        userRepo: IUserRepository,
        chatMessageRepo: IChatMessageRepository,
    ) {
        this.NS = wss.of('/ws/chats/global')
        this.userRepo = userRepo
        this.chatMessageRepo = chatMessageRepo
    }

    async sendMessage(chatId: string, text: string, ctx: ValidatedUserPayload) {
        if (text.length === 0) {
            throw new Error("Message can't be empty")
        }

        const sender = await this.userRepo.getByExternalId(ctx.user.id)
        if (!sender) {
            throw new Error('No such user')
        }

        const message = await this.chatMessageRepo.create({
            chatId: chatId,
            userId: sender._id,
            text: text,
        })

        this.NS.to(chatId).emit('messages:post', message)

        return message
    }   
}
