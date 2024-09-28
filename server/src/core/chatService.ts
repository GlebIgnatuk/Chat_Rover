import { IChatMessageRepository } from "@/repositories/chatMessage";
import { IPrivateChatRepository } from "@/repositories/privateChat";
import { IUserRepository } from "@/repositories/user";
import { ValidatedUserPayload } from "@/services/telegram";
import { Namespace, Server } from "socket.io";


export class ChatService {
    private readonly privateNS: Namespace
    // private readonly publicNS: Server

    private readonly privateChatRepo: IPrivateChatRepository
    private readonly userRepo: IUserRepository
    private readonly chatMessageRepo: IChatMessageRepository

    constructor(
        wss: Server,
        privateChatRepo: IPrivateChatRepository,
        userRepo: IUserRepository,
        chatMessageRepo: IChatMessageRepository
    ) {
        this.privateNS = wss.of('/ws/chats/private')
        this.privateChatRepo = privateChatRepo
        this.userRepo = userRepo
        this.chatMessageRepo = chatMessageRepo
    }

    async sendMessage(chatId: string, text: string, ctx: ValidatedUserPayload) {
        if (text.length === 0) {
            throw new Error('Message can\'t be empty')
        }

        const user = await this.userRepo.getByExternalId(ctx.user.id)
        if (!user) {
            throw new Error('No such user')
        }

        const hasAccess = await this.privateChatRepo.hasMember(chatId, user._id)
        if (!hasAccess) {
            throw new Error('You don\'t have access to this chat')
        }

        const message = await this.chatMessageRepo.create({
            chatId: chatId,
            userId: user._id,
            text: text
        })

        this.privateNS.to(user._id.toString()).emit('messages:post', message)

        return message
    }

}