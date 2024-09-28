import { Server } from "socket.io";
import { ValidatedUserPayload, validateUserPayload } from "@/services/telegram";
import { config } from "@/config/config";
import { IRepositories } from "@/repositories/repositories";
import { IServices } from "@/core/types";

export const setupWsRouter = (wss: Server, repositories: IRepositories, services: IServices) => {
    const chats = wss.of('/ws/chats/private')

    chats.on('connection', async (socket) => {
        let identity: ValidatedUserPayload
        try {
            const initData = socket.handshake.query['x-telegram-init-data']
            const validated = validateUserPayload(initData?.toString() ?? '', config.TELEGRAM_BOT_TOKEN)
            identity = validated
        } catch (e) {
            return socket.disconnect(true)
        }

        const user = await repositories.user.getByExternalId(identity.user.id)
        if (!user) {
            return socket.disconnect(true)
        }

        console.log(`${user._id} connected`)

        // socket.leave(socket.id)
        socket.join(user._id.toString())

        socket.on('messages:post', async (body) => {
            console.log(body, typeof body)

            // const { chatId, text } = body

            // await services.chat.sendMessage(chatId, text, identity)
        })

        socket.on('disconnect', () => {
            console.log(`${user._id} disconnected`)
        })
    })
}