import { api } from '@/services/api'
import { IMessage, IPrivateChat, IPrivateChatWithMetadata } from '@/store/types'
import { useCallback, useMemo } from 'react'
import { useStore } from '@/context/app/useStore'

export const useChatsService = () => {
    const user = useStore((state) => state.identity.user)
    const chats = useStore((state) => state.chats)
    const p2p = useStore((state) => state.p2p)
    const chatsMessages = useStore((state) => state.chatsMessages)

    const load = useCallback(
        async (signal?: AbortSignal) => {
            if (chats.loading.items['$']?.is) return

            try {
                chats.loading.start()
                const response = await api<IPrivateChatWithMetadata[]>('/privateChats', { signal })

                if (response.success) {
                    chats.addMany(response.data)
                    chats.loading.stop()
                } else {
                    chats.loading.stopWithError(response.error)
                }
            } catch (e) {
                if (e instanceof Error && e.name !== 'AbortError') {
                    console.error(e)
                    chats.loading.stopWithError('Something went wrong')
                }
            }
        },
        [chats.loading.items['$']?.is],
    )

    const loadById = useCallback(
        async (chatId: string, signal?: AbortSignal) => {
            if (chats.loading.items[chatId]?.is) return

            try {
                chats.loading.start(chatId)
                const response = await api<IPrivateChatWithMetadata>(`/privateChats/${chatId}`, {
                    signal,
                })

                if (response.success) {
                    chats.add(response.data)
                    chats.loading.stop(chatId)
                } else {
                    chats.loading.stopWithError(response.error, chatId)
                }
            } catch (e) {
                console.error(e)
                chats.loading.stopWithError('Something went wrong', chatId)
            }
        },
        [chats.loading.items],
    )

    const loadByPeerId = useCallback(
        async (peerId: string, signal?: AbortSignal) => {
            if (p2p.loading.items[peerId]?.is) return

            try {
                p2p.loading.start(peerId)
                const response = await api<IPrivateChatWithMetadata[]>(
                    `/privateChats?peerId=${peerId}`,
                    { signal },
                )

                if (response.success) {
                    const chat = response.data[0]
                    if (chat) {
                        chats.add(chat)
                        p2p.loading.stop(peerId)
                        return
                    } else {
                        const response = await api<IPrivateChat>('/privateChats', {
                            method: 'POST',
                            body: JSON.stringify({
                                peerId: peerId,
                            }),
                            signal,
                        })

                        if (response.success) {
                            const response = await api<IPrivateChatWithMetadata[]>(
                                `/privateChats?peerId=${peerId}`,
                                { signal },
                            )
                            if (response.success) {
                                const chat = response.data[0]
                                if (chat) {
                                    chats.add(chat)
                                    p2p.loading.stop(peerId)
                                } else {
                                    p2p.loading.stopWithError('Failed to load chat', peerId)
                                }
                            } else {
                                p2p.loading.stopWithError(response.error, peerId)
                            }
                        } else {
                            p2p.loading.stopWithError(response.error, peerId)
                        }
                    }
                } else {
                    p2p.loading.stopWithError(response.error, peerId)
                }
            } catch (e) {
                console.error(e)
                p2p.loading.stopWithError('Something went wrong', peerId)
            }
        },
        [p2p.loading.items],
    )

    const loadChatMessages = useCallback(
        async (chatId: string, signal?: AbortSignal) => {
            if (chatsMessages.loading.items[chatId]?.is) return

            try {
                chatsMessages.loading.start(chatId)
                const response = await api<IMessage[]>(
                    `/privateChats/${chatId}/messages/?page=1&limit=15`,
                    {
                        signal,
                    },
                )

                if (response.success) {
                    chatsMessages.append(chatId, response.data)
                    chatsMessages.loading.stop(chatId)
                } else {
                    chatsMessages.loading.stopWithError(response.error, chatId)
                }
            } catch (e) {
                console.error(e)
                chatsMessages.loading.stopWithError('Something went wrong', chatId)
            }
        },
        [chatsMessages.loading.items],
    )

    const sendMessage = useCallback(
        async (chatId: string, text: string, signal?: AbortSignal) => {
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
                chatsMessages.put(chatId, {
                    message: draft,
                    error: null,
                    status: 'pending',
                })

                const response = await api<IMessage>(`/privateChats/${chatId}/messages`, {
                    method: 'POST',
                    body: JSON.stringify({ text }),
                    signal,
                })
                if (response.success) {
                    chatsMessages.replace(chatId, draft._id, response.data)
                } else {
                    chatsMessages.put(chatId, {
                        message: draft,
                        error: response.error,
                        status: 'errored',
                    })
                }
            } catch {
                chatsMessages.put(chatId, {
                    message: draft,
                    error: 'Something went wrong',
                    status: 'errored',
                })
            }
        },
        [user],
    )

    return useMemo(
        () => ({
            load,
            loadById,
            loadByPeerId,
            loadChatMessages,
            sendMessage,
        }),
        [load, loadById, loadByPeerId, loadChatMessages, sendMessage],
    )
}
