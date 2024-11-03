import { config } from '@/config/config'
import { IChatMessageRepository } from '@/repositories/chatMessage'
import { IPrivateChatRepository } from '@/repositories/privateChat'
import { IUserRepository } from '@/repositories/user'
import { ValidatedUserPayload } from '@/services/telegram'
import { Namespace, Server } from 'socket.io'

export class PrivateChatService {
    private readonly NS: Namespace

    private readonly privateChatRepo: IPrivateChatRepository
    private readonly userRepo: IUserRepository
    private readonly chatMessageRepo: IChatMessageRepository

    constructor(
        wss: Server,
        privateChatRepo: IPrivateChatRepository,
        userRepo: IUserRepository,
        chatMessageRepo: IChatMessageRepository,
    ) {
        this.NS = wss.of('/ws/chats/private')
        this.privateChatRepo = privateChatRepo
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

        const chat = await this.privateChatRepo.get(chatId)
        if (!chat || chat.members.some((m) => m._id.equals(sender._id)) === false) {
            throw new Error("You don't have access to this chat")
        }

        const message = await this.chatMessageRepo.create({
            chatId: chatId,
            userId: sender._id,
            text: text,
        })
        await this.privateChatRepo.patch(chat._id, {
            lastMessageSentAt: new Date(),
        })

        {
            const receiver = chat.members.find((m) => m._id.equals(sender._id) === false)
            if (receiver) {
                if (receiver && Date.now() - receiver.lastActivityAt.getTime() >= 1 * 60 * 1000) {
                    try {
                        const r = await fetch(
                            `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/sendMessage`,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                method: 'POST',
                                body: JSON.stringify({
                                    chat_id: receiver.externalId,
                                    text: `New message from ${sender.nickname}:\n\n${message.text}`,
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                {
                                                    text: 'Go to chat',
                                                    url: `tg://resolve?domain=wuthering_waves_ml_dev_bot&appname=roverchat`,
                                                },
                                            ],
                                        ],
                                    },
                                }),
                            },
                        )
                        console.log(r.status, await r.text())
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        }
        this.NS.to(chat.members.map((m) => m._id.toString())).emit('messages:post', message)

        return message
    }
}
