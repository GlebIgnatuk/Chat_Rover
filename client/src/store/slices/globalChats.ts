import { StateCreator } from 'zustand'
import { IGlobalChatsState } from '../state'
import * as R from 'ramda'
import { ILoading } from '../common'
import { IMessageWithStatus } from '../types'

type IState = IGlobalChatsState

export const createGlobalChatsSlice: StateCreator<IState, [], [], IGlobalChatsState> = (set) => ({
    globalChats: {
        items: {
            global: { _id: '1', slug: 'global' },
            sea: { _id: '2', slug: 'sea' },
            asia: { _id: '3', slug: 'asia' },
            europe: { _id: '4', slug: 'europe' },
            hmt: { _id: '5', slug: 'hmt' },
            america: { _id: '6', slug: 'america' },
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

                    return R.assocPath(['globalChatsMessages', 'items', chatId], messages, state)
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

                return R.assocPath(['globalChatsMessages', 'items', chatId], mapped, state)
            })
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
