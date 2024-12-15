import { useEffect } from 'react'
import { useChatsService } from './useChatsService'
import { useStore } from '@/context/app/useStore'

export const useChat = (chatId: string, shouldLoad: boolean = true) => {
    const chats = useStore((state) => state.chats)
    const chatsMessages = useStore((state) => state.chatsMessages)

    const chat = chats.items[chatId]
    const chatLoading = chats.loading.items[chatId]
    const messagesLoading = chatsMessages.loading.items[chatId]
    const messages = chatsMessages.items[chatId]

    const service = useChatsService()

    const load = async (signal?: AbortSignal) => {
        return service.loadById(chatId, signal)
    }

    const sendMessage = async (text: string, signal?: AbortSignal) => {
        return service.sendMessage(chatId, text, signal)
    }

    const loadMessages = async (signal?: AbortSignal) => {
        return service.loadChatMessages(chatId, signal)
    }

    useEffect(() => {
        if (shouldLoad === false) return
        if (chat || chatLoading?.is) return

        const abortController = new AbortController()
        load(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [chat])

    useEffect(() => {
        if (shouldLoad === false) return
        if (!chat || messages) return
        if (messagesLoading && (messagesLoading.is || messagesLoading.error === undefined)) return

        const abortController = new AbortController()
        loadMessages(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [chat])

    return {
        chat: { chat, loading: chatLoading ?? { is: false } },
        messages: {
            messages: messages ?? [],
            loading: messagesLoading ?? { is: false },
        },
        sendMessage,
    }
}
