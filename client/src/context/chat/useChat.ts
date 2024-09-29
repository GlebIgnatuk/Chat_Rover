import { api } from '@/services/api'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUser } from '../auth/useUser'

export type Message = {
    _id: string
    chatId: string
    createdBy: {
        _id: string
        externalId: number
        language: string
        nickname: string
        profile: null
    }
    text: string
    type: string
    createdAt: string
    updatedAt: string
}

export type MessageWithStatus = {
    message: Message
    status: 'pending' | 'sent' | 'errored'
    error?: string
}

const MESSAGES_PER_PAGE = 30

export const useChat = (chatId: string) => {
    const page = useRef(1)
    const { user } = useUser()
    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<MessageWithStatus[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadMessages = async (signal?: AbortSignal) => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await api<Message[]>(
                `/chats/${chatId}/messages?page=${page.current}&limit=${MESSAGES_PER_PAGE}`,
                { signal },
            )
            if (response.success) {
                const wrapped: MessageWithStatus[] = response.data.map((d) => ({
                    message: d,
                    status: 'sent',
                }))
                setMessages(wrapped)
            } else {
                setError(response.error)
            }
        } catch (e) {
            if (e instanceof Error) {
                setError(`Something went wrong: ${e.message}`)
            } else {
                setError('Something went wrong')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const sendMessage = async (text: string) => {
        const id = Math.floor(Date.now() * Math.random()).toString()

        const wrapped: MessageWithStatus = {
            message: {
                _id: id,
                chatId: chatId,
                createdBy: {
                    _id: user._id,
                    externalId: -1,
                    language: 'en',
                    nickname: user.nickname,
                    profile: null,
                },
                text,
                type: 'text',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            status: 'pending',
        }
        setMessages((prev) => [...prev, wrapped])

        try {
            const response = await api<Message>(`/chats/${chatId}/messages`, {
                method: 'POST',
                body: JSON.stringify({
                    text,
                }),
            })

            if (response.success) {
                setMessages((prev) =>
                    prev.map((p) => (p.message._id === id ? { ...p, status: 'sent' } : p)),
                )
            } else {
                setMessages((prev) =>
                    prev.map((p) =>
                        p.message._id === id
                            ? { ...p, status: 'errored', error: response.error }
                            : p,
                    ),
                )
            }
        } catch (e) {
            console.error(e)
            setMessages((prev) =>
                prev.map((p) =>
                    p.message._id === id
                        ? { ...p, status: 'errored', error: 'Something went wrong' }
                        : p,
                ),
            )
        }
    }

    useEffect(() => {
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

        socket.on('messages:post', (message) => {
            if (message.createdBy._id === user._id) return

            setMessages((prev) => [...prev, { message, status: 'sent' }])
        })

        socket.on('connect_error', () => {
            socket.io.opts.transports = ['polling', 'websocket']
        })

        setSocket(socket)

        return () => {
            setSocket(null)
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        const abortController = new AbortController()
        loadMessages(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    return {
        messages,
        isLoading: isLoading || !socket,
        error,
        loadMessages,
        sendMessage,
    }
}
