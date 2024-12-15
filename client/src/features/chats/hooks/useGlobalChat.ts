import { useStore } from '@/context/app/useStore'
import { useRecomputedRef } from '@/hooks/common/useRecomputedRef'
import { api } from '@/services/api'
import { IMessage } from '@/store/types'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

export const useGlobalChat = (slug: string) => {
    const chatId = slug

    const user = useStore((state) => state.identity.user)

    const chatsMessages = useStore((state) => state.globalChatsMessages)
    const chatsMessagesRef = useRecomputedRef(chatsMessages)

    const messages = chatsMessages.items[slug]
    const messagesLoading = chatsMessages.loading.items[slug]

    const loadMessages = async (chatId: string, signal?: AbortSignal) => {
        if (messagesLoading?.is) return

        try {
            chatsMessagesRef.current.loading.start(chatId)
            const response = await api<IMessage[]>(
                `/globalChats/${chatId}/messages/?page=1&limit=15`,
                {
                    signal,
                },
            )

            if (response.success) {
                // chatsMessagesRef.current.append(chatId, response.data)
                chatsMessagesRef.current.set(chatId, response.data)
                chatsMessagesRef.current.loading.stop(chatId)
            } else {
                chatsMessagesRef.current.loading.stopWithError(response.error, chatId)
            }
        } catch (e) {
            console.error(e)
            chatsMessagesRef.current.loading.stopWithError('Something went wrong', chatId)
        }
    }

    const sendMessage = async (text: string, signal?: AbortSignal) => {
        const draft: IMessage = {
            _id: Math.floor(Date.now() * Math.random()).toString(),
            chatId,
            text,
            type: 'text',
            createdBy: {
                _id: user._id,
                externalId: -1,
                language: 'en',
                nickname: user.nickname,
                profile: null,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        try {
            chatsMessagesRef.current.put(chatId, {
                message: draft,
                error: null,
                status: 'pending',
            })

            const response = await api<IMessage>(`/globalChats/${chatId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ text }),
                signal,
            })
            if (response.success) {
                chatsMessagesRef.current.replace(chatId, draft._id, response.data)
            } else {
                chatsMessagesRef.current.put(chatId, {
                    message: draft,
                    error: response.error,
                    status: 'errored',
                })
            }
        } catch {
            chatsMessagesRef.current.put(chatId, {
                message: draft,
                error: 'Something went wrong',
                status: 'errored',
            })
        }
    }

    useEffect(() => {
        const abortController = new AbortController()
        loadMessages(slug, abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [slug])

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_WS_URL}/chats/global`, {
            query: {
                // @ts-expect-error add type definition later
                'x-telegram-init-data': window.Telegram.WebApp.initData,
            },
            transports: ['websocket', 'polling'],
        })

        socket.on('connect', async () => {})

        socket.on('init', async () => {
            socket.emit('subscribe', slug)
        })

        socket.on('messages:post', async (message: IMessage) => {
            // chatsMessagesRef.current.put(message.chatId, { message, status: 'sent', error: null })
            chatsMessagesRef.current.put(slug, { message, status: 'sent', error: null })
        })

        socket.on('connect_error', () => {
            socket.io.opts.transports = ['polling', 'websocket']
        })

        return () => {
            socket.disconnect()
        }
    }, [slug])

    return {
        messages: {
            messages: messages ?? [],
            loading: messagesLoading ?? { is: false },
        },
        sendMessage,
    }
}
