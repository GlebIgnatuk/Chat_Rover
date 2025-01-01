import { StateCreator } from 'zustand'
import { IGlobalChatsState } from '../state'
import * as R from 'ramda'
import { ILoading } from '../common'
import { IGlobalChatWithMetadata, IMessageWithStatus } from '../types'

type IState = IGlobalChatsState

export const createGlobalChatsSlice =
    (chats: IGlobalChatWithMetadata[]): StateCreator<IState, [], [], IGlobalChatsState> =>
    (set) => ({
        globalChats: {
            items: chats,
            setItems: (chats) => {
                set((state) => R.assocPath(['globalChats', 'items'], chats, state))
            },
        },

        globalChatsMessages: {
            items: {},
            put: (chatId, item) => {
                set((state) => {
                    const messages = [...(state.globalChatsMessages.items[chatId] ?? [])]

                    const index = messages.findIndex((m) => m.message._id === item.message._id)
                    if (index >= 0) {
                        messages[index] = item
                    } else {
                        messages.push(item)
                    }

                    return R.assocPath(['globalChatsMessages', 'items', chatId], messages, state)
                })
            },
            replace: (chatId, uuid, item) => {
                set((state) => {
                    const messages = [...(state.globalChatsMessages.items[chatId] ?? [])]
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

                        return R.assocPath(
                            ['globalChatsMessages', 'items', chatId],
                            messages,
                            state,
                        )
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
                    const messages = state.globalChatsMessages.items[chatId] ?? []
                    return R.assocPath(
                        ['globalChatsMessages', 'items', chatId],
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
                    const messages = state.globalChatsMessages.items[chatId] ?? []
                    return R.assocPath(
                        ['globalChatsMessages', 'items', chatId],
                        messages.concat(mapped),
                        state,
                    )
                })
            },
            set: (chatId, items) => {
                set((state) => {
                    const mapped = items.map<IMessageWithStatus>((item) => ({
                        message: item,
                        error: null,
                        status: 'sent',
                    }))

                    const updated = R.assocPath(
                        ['globalChatsMessages', 'items', chatId],
                        mapped,
                        state,
                    )

                    return R.assocPath(
                        ['globalChatsMessages', 'lastReadMessages', chatId],
                        items[items.length - 1]?._id,
                        updated,
                    )
                })
            },

            lastReadMessages: {},
            setLastReadMessage: (chatId, messageId) => {
                set((state) =>
                    R.assocPath(
                        ['globalChatsMessages', 'lastReadMessages', chatId],
                        messageId,
                        state,
                    ),
                )
            },

            loading: {
                items: {},
                start: (key) => {
                    if (key === undefined) throw new Error('Key was not provided')

                    set((state) => {
                        return R.assocPath<ILoading, IState>(
                            ['globalChatsMessages', 'loading', 'items', key],
                            { is: true },
                            state,
                        )
                    })
                },
                stop: (key) => {
                    if (key === undefined) throw new Error('Key was not provided')

                    set((state) => {
                        return R.assocPath<ILoading, IState>(
                            ['globalChatsMessages', 'loading', 'items', key],
                            { is: false },
                            state,
                        )
                    })
                },
                stopWithError: (error, key) => {
                    if (key === undefined) throw new Error('Key was not provided')

                    set((state) => {
                        return R.assocPath<ILoading, IState>(
                            ['globalChatsMessages', 'loading', 'items', key],
                            { is: false, error },
                            state,
                        )
                    })
                },
            },
        },
    })
