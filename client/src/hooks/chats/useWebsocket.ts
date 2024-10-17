import { io } from 'socket.io-client'
import { useChatsService } from './useChatsService'
import { useUser } from '@/context/auth/useUser'
import { useStore } from '@/store/store'
import { useRecomputedRef } from '@/hooks/common/useRecomputedRef'
import { useCallback } from 'react'
import { IMessage } from '@/store/types'

export const useWebsocket = () => {
    const user = useUser()
    const service = useRecomputedRef(useChatsService())
    const chats = useRecomputedRef(useStore((state) => state.chats))
    const chatsMessages = useRecomputedRef(useStore((state) => state.chatsMessages))

    const connect = useCallback(() => {
        const socket = io(`${import.meta.env.VITE_WS_URL}/chats/private`, {
            query: {
                // @ts-expect-error add type definition later
                'x-telegram-init-data': window.Telegram.WebApp.initData,
            },
            transports: ['websocket', 'polling'],
        })

        socket.on('connect', async () => {
            console.log('Connected')
        })

        let abortController = new AbortController()
        socket.on('messages:post', async (message: IMessage) => {
            abortController.abort()
            abortController = new AbortController()

            if (chats.items[message.chatId] !== undefined) {
                chats.setLastMessage(message.chatId, message)
            } else {
                await service.loadById(message.chatId, abortController.signal)
            }

            chatsMessages.put(message.chatId, { message, status: 'sent', error: null })
            if (user.user._id !== message.createdBy._id) {
                chatsMessages.setLastReceivedMessage(message)
            }
        })

        socket.on('connect_error', () => {
            socket.io.opts.transports = ['polling', 'websocket']
        })

        return () => {
            abortController.abort()
            socket.disconnect()
        }
    }, [user.user._id])

    return connect
}
