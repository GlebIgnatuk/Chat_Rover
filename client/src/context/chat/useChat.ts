import { useContext, useEffect } from 'react'
import { ChatContext } from './ChatContext'

export const useChat = (chatId: string) => {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('ChatContext must be used within provider')
    }

    const { state, sendChatMessage, loadChatMessages, loadChat } = context

    const chat = state.chats.items[chatId]
    const chatLoading = state.chats.itemLoading[chatId]
    const messagesLoading = state.chatsMessages.itemLoading[chatId]
    const messages = state.chatsMessages.items[chatId]

    const sendMessage = async (text: string) => {
        sendChatMessage(chatId, text)
    }

    const loadMessages = (signal?: AbortSignal) => {
        loadChatMessages(chatId, signal)
    }

    useEffect(() => {
        if (chat) return

        const abortController = new AbortController()
        loadChat(chatId, abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [chat])

    useEffect(() => {
        if (!chat) return
        if (messagesLoading && messagesLoading.is) return
        if (messagesLoading && messagesLoading.error === null) return

        const abortController = new AbortController()
        loadMessages(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [chat])

    return {
        chat: { chat, loading: chatLoading ?? { is: false, error: null } },
        messages: {
            messages: messages ?? [],
            loading: messagesLoading ?? { is: false, error: null },
        },
        sendMessage,
    }
}
