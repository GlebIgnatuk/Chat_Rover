import { Reducer } from 'react'

export type IPrivateChatWithMetadata = {
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
    } | null
}

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
    error: string | null
}

export type ILoading = { is: true } | { is: false; error: string | null }

export interface IState {
    chats: {
        items: { [chatId: string]: IPrivateChatWithMetadata }
        itemLoading: { [chatId: string]: ILoading }
        loading: ILoading
    }
    chatsMessages: {
        items: { [chatId: string]: MessageWithStatus[] }
        itemLoading: { [chatId: string]: ILoading }
    }
    p2p: {
        items: { [peerId: string]: IPrivateChatWithMetadata }
        itemLoading: { [peerId: string]: ILoading }
    }
}

export type IAction =
    | { type: '@chats/add_many'; payload: IPrivateChatWithMetadata[] }
    | { type: '@chats/add'; payload: IPrivateChatWithMetadata }
    | {
          type: '@chats/set_loading'
          payload: ILoading
      }
    | { type: '@p2p/set_loading'; payload: { peerId: string; loading: ILoading } }
    | { type: '@p2p/add'; payload: { peerId: string; value: IPrivateChatWithMetadata } }
    | { type: '@chat/set_loading'; payload: { chatId: string; loading: ILoading } }
    | { type: '@chat/set_last_message'; payload: Message }
    | {
          type: '@chat/messages/set_loading'
          payload: { chatId: string; loading: ILoading }
      }
    | { type: '@chat/messages/set'; payload: { chatId: string; items: Message[] } }
    | {
          type: '@chat/messages/put'
          payload: { chatId: string; item: MessageWithStatus }
      }
    | {
          type: '@chat/messages/replace'
          payload: { chatId: string; id: string; item: Message }
      }

export const initialState: IState = {
    chats: {
        items: {},
        itemLoading: {},
        loading: { is: false, error: null },
    },
    chatsMessages: {
        items: {},
        itemLoading: {},
    },
    p2p: {
        items: {},
        itemLoading: {},
    },
}

export const reducer: Reducer<IState, IAction> = (state, action) => {
    console.groupCollapsed(`${action.type}`)
    console.groupCollapsed('prev')
    console.log(state)
    console.groupEnd()
    console.groupCollapsed('action')
    console.log(action.payload)
    console.groupEnd()
    // console.group('next')
    // console.log(state)
    console.groupEnd()

    switch (action.type) {
        case '@chats/add_many': {
            const chats = action.payload.reduce<IState['chats']['items']>((acc, chat) => {
                acc[chat._id] = chat
                return acc
            }, {})

            const chatsMessages = action.payload.reduce<IState['chatsMessages']['items']>(
                (acc, chat) => {
                    acc[chat._id] = []
                    return acc
                },
                {},
            )

            const peers = action.payload.reduce<IState['p2p']['items']>((acc, chat) => {
                acc[chat.peer._id] = chat
                return acc
            }, {})

            return {
                ...state,
                chats: { ...state.chats, items: { ...state.chats.items, ...chats } },
                chatsMessages: {
                    ...state.chatsMessages,
                    items: { ...state.chatsMessages.items, ...chatsMessages },
                },
                p2p: { ...state.p2p, items: { ...state.p2p.items, ...peers } },
            }
        }

        case '@chats/add': {
            return {
                ...state,
                chats: {
                    ...state.chats,
                    items: { ...state.chats.items, [action.payload._id]: action.payload },
                },
                chatsMessages: {
                    ...state.chatsMessages,
                    items: {
                        ...state.chatsMessages.items,
                        [action.payload._id]: [],
                    },
                },
                p2p: {
                    ...state.p2p,
                    items: {
                        ...state.p2p.items,
                        [action.payload.peer._id]: action.payload,
                    },
                },
            }
        }

        case '@chats/set_loading': {
            return {
                ...state,
                chats: { ...state.chats, loading: action.payload },
            }
        }

        case '@p2p/add': {
            const { peerId, value } = action.payload

            return {
                ...state,
                p2p: { ...state.p2p, items: { ...state.p2p.items, [peerId]: value } },
                chats: { ...state.chats, items: { ...state.chats.items, [value._id]: value } },
            }
        }

        case '@p2p/set_loading': {
            const { peerId, loading } = action.payload

            return {
                ...state,
                p2p: { ...state.p2p, itemLoading: { ...state.p2p.itemLoading, [peerId]: loading } },
            }
        }

        case '@chat/set_loading': {
            const { chatId, loading } = action.payload

            return {
                ...state,
                chats: {
                    ...state.chats,
                    itemLoading: { ...state.chats.itemLoading, [chatId]: loading },
                },
            }
        }

        case '@chat/set_last_message': {
            const chat = state.chats.items[action.payload.chatId]
            if (!chat) return state

            const updatedChat: IState['chats']['items'][string] = {
                ...chat,
                lastMessage: {
                    chatId: action.payload.chatId,
                    createdAt: action.payload.createdAt,
                    text: action.payload.text,
                },
            }

            return {
                ...state,
                chats: {
                    ...state.chats,
                    items: { ...state.chats.items, [chat._id]: updatedChat },
                },
            }
        }

        case '@chat/messages/set_loading': {
            const { chatId, loading } = action.payload

            return {
                ...state,
                chatsMessages: {
                    ...state.chatsMessages,
                    itemLoading: {
                        ...state.chatsMessages.itemLoading,
                        [chatId]: loading,
                    },
                },
            }
        }

        case '@chat/messages/set': {
            const { chatId, items } = action.payload

            const wrapped = items.map<MessageWithStatus>((item) => ({
                message: item,
                error: null,
                status: 'sent',
            }))

            return {
                ...state,
                chatsMessages: {
                    ...state.chatsMessages,
                    items: {
                        ...state.chatsMessages.items,
                        [chatId]: wrapped,
                    },
                },
            }
        }

        case '@chat/messages/put': {
            const { chatId, item } = action.payload

            const messages = state.chatsMessages.items[chatId] ?? []
            const copy = [...messages]

            const index = copy.findIndex((m) => m.message._id === item.message._id)
            if (index >= 0) {
                copy[index] = item
            } else {
                copy.push(item)
            }

            return {
                ...state,
                chatsMessages: {
                    ...state.chatsMessages,
                    items: {
                        ...state.chatsMessages.items,
                        [chatId]: copy,
                    },
                },
            }
        }

        case '@chat/messages/replace': {
            const { chatId, id, item } = action.payload

            const messages = state.chatsMessages.items[chatId] ?? []
            const copy = [...messages]
            const draftIndex = copy.findIndex((m) => m.message._id === id)

            if (draftIndex >= 0) {
                copy[draftIndex] = {
                    message: item,
                    error: null,
                    status: 'sent',
                }

                const realIndex = messages.findIndex((m) => m.message._id === item._id)
                if (realIndex >= 0) {
                    copy.splice(realIndex, 1)
                }

                return {
                    ...state,
                    chatsMessages: {
                        ...state.chatsMessages,
                        items: {
                            ...state.chatsMessages.items,
                            [chatId]: copy,
                        },
                    },
                }
            } else {
                return state
            }
        }

        default: {
            return state
        }
    }
}
