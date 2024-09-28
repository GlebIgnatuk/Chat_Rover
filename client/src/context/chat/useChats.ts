import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export type PrivateChat = {
    _id: string
    peer: {
        _id: string
        nickname: string
        avatarUrl: string | null
    }
    lastMessage: {
        chatId: string
        text: string
        createdAt: string
    }
}

export const useChats = () => {
    const [chats, setChats] = useState<PrivateChat[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadChats = async (signal?: AbortSignal) => {
        try {
            setError(null)
            setIsLoading(true)

            const response = await api<PrivateChat[]>('/privateChats', { signal })
            if (response.success) {
                setChats(response.data)
            } else {
                setError(response.error)
            }
        } catch (e) {
            console.error(e)
            setError('Something went wrong')
        } finally {
            setIsLoading(false)
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

        let abortController = new AbortController()
        socket.on('messages:post', async () => {
            abortController.abort()
            abortController = new AbortController()

            // const hasChat = chats.find((c) => c._id === message.chatId)
            // if (!hasChat) {
            //     loadChats(abortController.signal)
            // }
            loadChats(abortController.signal)
        })

        socket.on('connect_error', () => {
            socket.io.opts.transports = ['polling', 'websocket']
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        const abortController = new AbortController()
        loadChats(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    return {
        chats,
        isLoading,
        error,
        loadChats,
    }
}
