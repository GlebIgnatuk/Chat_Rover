import { StateCreator } from 'zustand'
import { IChatsState, IP2PState } from '../state'
import * as R from 'ramda'
import { ILoading } from '../common'
import { IMessageWithStatus } from '../types'

type IState = IChatsState & IP2PState

export const createChatsSlice: StateCreator<IState, [], [], IChatsState> = (set, get) => ({
    chats: {
        items: {},
        add: (item) => {
            get().p2p.add(item)

            return set((state) => R.assocPath(['chats', 'items', item._id], item, state))
        },
        addMany: (items) => {
            get().p2p.addMany(items)

            set((state) => {
                const indexed = R.indexBy(R.prop('_id'), items)
                const merged = R.mergeRight(state.chats.items, indexed)
                return R.assocPath(['chats', 'items'], merged, state)
            })
        },
        setLastMessage: (chatId, message) => {
            set((state) => {
                const chat = state.chats.items[chatId]
                if (!chat) {
                    console.warn(`No such chat "${chatId}"`)
                    return state
                }

                if (chatId !== message.chatId) {
                    throw new Error(
                        `Tried to set last message "${message._id}" on wrong chat: ${chatId}`,
                    )
                }

                const updated: typeof chat = {
                    ...chat,
                    lastMessage: {
                        chatId,
                        text: message.text,
                        createdAt: message.createdAt,
                    },
                }

                return R.assocPath(['chats', 'items', chatId], updated, state)
            })
        },

        loading: {
            items: {},
            start: (key) => {
                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chats', 'loading', 'items', key ?? '$'],
                        { is: true },
                        state,
                    )
                })
            },
            stop: (key) => {
                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chats', 'loading', 'items', key ?? '$'],
                        { is: false },
                        state,
                    )
                })
            },
            stopWithError: (error, key) => {
                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chats', 'loading', 'items', key ?? '$'],
                        { is: false, error },
                        state,
                    )
                })
            },
        },
    },

    chatsMessages: {
        items: {},
        put: (chatId, item) => {
            set((state) => {
                const messages = [...(state.chatsMessages.items[chatId] ?? [])]

                const index = messages.findIndex((m) => m.message._id === item.message._id)
                if (index >= 0) {
                    messages[index] = item
                } else {
                    messages.push(item)
                }

                return R.assocPath(['chatsMessages', 'items', chatId], messages, state)
            })
        },
        replace: (chatId, uuid, item) => {
            set((state) => {
                const messages = [...(state.chatsMessages.items[chatId] ?? [])]
                const indexOfPending = messages.findIndex((m) => m.message._id === uuid)

                if (indexOfPending >= 0) {
                    messages[indexOfPending] = {
                        message: item,
                        error: null,
                        status: 'sent',
                    }

                    const indexOfSent = messages.findIndex(
                        (m, idx) => m.message._id === item._id && idx !== indexOfPending,
                    )
                    if (indexOfSent >= 0) {
                        messages.splice(indexOfSent, 1)
                    }

                    return R.assocPath(['chatsMessages', 'items', chatId], messages, state)
                } else {
                    return state
                }
            })
        },
        prepend: (chatId, items) => {
            set((state) => {
                const mapped = items.map<IMessageWithStatus>((item) => ({
                    message: item,
                    error: null,
                    status: 'sent',
                }))
                const messages = state.chatsMessages.items[chatId] ?? []
                return R.assocPath(
                    ['chatsMessages', 'items', chatId],
                    mapped.concat(messages),
                    state,
                )
            })
        },
        append: (chatId, items) => {
            set((state) => {
                const mapped = items.map<IMessageWithStatus>((item) => ({
                    message: item,
                    error: null,
                    status: 'sent',
                }))
                const messages = state.chatsMessages.items[chatId] ?? []
                return R.assocPath(
                    ['chatsMessages', 'items', chatId],
                    messages.concat(mapped),
                    state,
                )
            })
        },

        lastReceivedMessage: null,
        setLastReceivedMessage: (item) => {
            set((state) => {
                return R.assocPath(['chatsMessages', 'lastReceivedMessage'], item, state)
            })
        },
        resetLastReceivedMessage: () => {
            set((state) => {
                return R.assocPath(['chatsMessages', 'lastReceivedMessage'], null, state)
            })
        },

        loading: {
            items: {},
            start: (key) => {
                if (key === undefined) throw new Error('Key was not provided')

                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chatsMessages', 'loading', 'items', key],
                        { is: true },
                        state,
                    )
                })
            },
            stop: (key) => {
                if (key === undefined) throw new Error('Key was not provided')

                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chatsMessages', 'loading', 'items', key],
                        { is: false },
                        state,
                    )
                })
            },
            stopWithError: (error, key) => {
                if (key === undefined) throw new Error('Key was not provided')

                set((state) => {
                    return R.assocPath<ILoading, IState>(
                        ['chatsMessages', 'loading', 'items', key],
                        { is: false, error },
                        state,
                    )
                })
            },
        },
    },
})
