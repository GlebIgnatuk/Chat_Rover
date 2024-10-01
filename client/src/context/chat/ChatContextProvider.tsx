import { ReactNode, Reducer, useEffect, useReducer, useRef } from 'react'
import { ChatContext, IChatContext } from './ChatContext'
import {
    IAction,
    initialState,
    IPrivateChatWithMetadata,
    IState,
    Message,
    reducer,
} from './reducer'
import { api } from '@/services/api'
import { io } from 'socket.io-client'
import { useUser } from '../auth/useUser'

interface Props {
    children: ReactNode
}

export const ChatContextProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer<Reducer<IState, IAction>, null>(
        reducer,
        null,
        () => initialState,
    )
    const ref = useRef(state)
    useEffect(() => {
        ref.current = state
    }, [state])

    const user = useUser()

    const loadChat = async (chatId: string, signal?: AbortSignal) => {
        if (state.chats.itemLoading[chatId]?.is) return

        try {
            dispatch({ type: '@chat/set_loading', payload: { chatId, loading: { is: true } } })
            const response = await api<IPrivateChatWithMetadata>(`/privateChats/${chatId}`, {
                signal,
            })
            if (response.success) {
                dispatch({ type: '@chats/add', payload: response.data })
                dispatch({
                    type: '@chat/set_loading',
                    payload: { chatId, loading: { is: false, error: null } },
                })
            } else {
                dispatch({
                    type: '@chat/set_loading',
                    payload: { chatId, loading: { is: false, error: response.error } },
                })
            }
        } catch (e) {
            console.error(e)
            dispatch({
                type: '@chat/set_loading',
                payload: { chatId, loading: { is: false, error: 'Something went wrong' } },
            })
        }
    }

    const loadChatByPeer = async (peerId: string, signal?: AbortSignal) => {
        if (state.p2p.itemLoading[peerId]?.is) return

        try {
            dispatch({ type: '@p2p/set_loading', payload: { peerId, loading: { is: true } } })
            const response = await api<IPrivateChatWithMetadata[]>(
                `/privateChats?peerId=${peerId}`,
                { signal },
            )
            if (response.success) {
                const chat = response.data[0]
                if (chat) {
                    dispatch({ type: '@p2p/add', payload: { peerId, value: chat } })
                    dispatch({
                        type: '@p2p/set_loading',
                        payload: { peerId, loading: { is: false, error: null } },
                    })
                    return
                } else {
                    const response = await api<IPrivateChatWithMetadata>('/privateChats', {
                        method: 'POST',
                        body: JSON.stringify({
                            peerId: peerId,
                        }),
                        signal,
                    })
                    if (response.success) {
                        dispatch({
                            type: '@p2p/add',
                            payload: { peerId, value: response.data },
                        })
                        dispatch({
                            type: '@p2p/set_loading',
                            payload: { peerId, loading: { is: false, error: null } },
                        })
                        return
                    } else {
                        dispatch({
                            type: '@p2p/set_loading',
                            payload: { peerId, loading: { is: false, error: response.error } },
                        })
                    }
                }
            } else {
                dispatch({
                    type: '@p2p/set_loading',
                    payload: { peerId, loading: { is: false, error: response.error } },
                })
            }
        } catch (e) {
            console.error(e)
            dispatch({
                type: '@p2p/set_loading',
                payload: { peerId, loading: { is: false, error: 'Something went wrong' } },
            })
        }
    }

    const loadChats = async (signal?: AbortSignal) => {
        if (state.chats.loading.is) return

        try {
            dispatch({ type: '@chats/set_loading', payload: { is: true } })
            const response = await api<IPrivateChatWithMetadata[]>('/privateChats', { signal })
            if (response.success) {
                dispatch({ type: '@chats/add_many', payload: response.data })
                dispatch({ type: '@chats/set_loading', payload: { is: false, error: null } })
            } else {
                dispatch({
                    type: '@chats/set_loading',
                    payload: { is: false, error: response.error },
                })
            }
        } catch (e) {
            if (e instanceof Error && e.name !== 'AbortError') {
                console.error(e)
            }

            dispatch({
                type: '@chats/set_loading',
                payload: { is: false, error: 'Something went wrong' },
            })
        }
    }

    const loadChatMessages = async (chatId: string, signal?: AbortSignal) => {
        if (state.chatsMessages.itemLoading[chatId]?.is) return

        try {
            dispatch({
                type: '@chat/messages/set_loading',
                payload: { chatId, loading: { is: true } },
            })

            const response = await api<Message[]>(`/chats/${chatId}/messages/?page=1&limit=15`, {
                signal,
            })
            if (response.success) {
                dispatch({ type: '@chat/messages/set', payload: { chatId, items: response.data } })
                dispatch({
                    type: '@chat/messages/set_loading',
                    payload: { chatId, loading: { is: false, error: null } },
                })
            } else {
                dispatch({
                    type: '@chat/messages/set_loading',
                    payload: { chatId, loading: { is: false, error: response.error } },
                })
            }
        } catch (e) {
            console.error(e)
            dispatch({
                type: '@chat/messages/set_loading',
                payload: { chatId, loading: { is: false, error: 'Something went wrong' } },
            })
        }
    }

    const sendChatMessage = async (chatId: string, text: string, signal?: AbortSignal) => {
        const draft: Message = {
            _id: Math.floor(Date.now() * Math.random()).toString(),
            chatId,
            text,
            type: 'text',
            createdBy: {
                _id: user.user._id,
                externalId: -1,
                language: 'en',
                nickname: user.user.nickname,
                profile: null,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        try {
            dispatch({
                type: '@chat/messages/put',
                payload: {
                    chatId,
                    item: {
                        message: draft,
                        status: 'pending',
                        error: null,
                    },
                },
            })
            const response = await api<Message>(`/chats/${chatId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ text }),
                signal,
            })
            if (response.success) {
                dispatch({
                    type: '@chat/messages/replace',
                    payload: {
                        chatId,
                        id: draft._id,
                        item: response.data,
                    },
                })
            } else {
                dispatch({
                    type: '@chat/messages/put',
                    payload: {
                        chatId,
                        item: {
                            message: draft,
                            status: 'errored',
                            error: response.error,
                        },
                    },
                })
            }
        } catch {
            dispatch({
                type: '@chat/messages/put',
                payload: {
                    chatId,
                    item: {
                        message: draft,
                        status: 'errored',
                        error: 'Something went wrong',
                    },
                },
            })
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
        socket.on('messages:post', async (message: Message) => {
            abortController.abort()
            abortController = new AbortController()

            const state = ref.current
            const hasChat = state.chats.items[message.chatId] !== undefined
            if (hasChat) {
                dispatch({ type: '@chat/set_last_message', payload: message })
            } else {
                await loadChat(message.chatId, abortController.signal)
            }

            dispatch({
                type: '@chat/messages/put',
                payload: { chatId: message.chatId, item: { message, status: 'sent', error: null } },
            })

            if (user.user._id !== message.createdBy._id) {
                dispatch({
                    type: '@chats/set_last_received_message',
                    payload: message,
                })
            }
        })

        socket.on('connect_error', () => {
            socket.io.opts.transports = ['polling', 'websocket']
        })

        return () => {
            abortController.abort()
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

    const context: IChatContext = {
        state,
        loadChats,
        loadChat,
        loadChatByPeer,
        loadChatMessages,
        sendChatMessage,
    }

    return <ChatContext.Provider value={context}>{children}</ChatContext.Provider>
}
