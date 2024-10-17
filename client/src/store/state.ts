import { ILoading } from './common'
import { IMessage, IMessageWithStatus, IPrivateChatWithMetadata } from './types'

type ILoadingState = {
    items: { [key: string]: ILoading }
    start: (key?: string) => void
    stop: (key?: string) => void
    stopWithError: (error: string, key?: string) => void
}

export type IChatsState = {
    chats: {
        items: { [chatId: string]: IPrivateChatWithMetadata }
        add: (item: IPrivateChatWithMetadata) => void
        addMany: (items: IPrivateChatWithMetadata[]) => void
        setLastMessage: (chatId: string, message: IMessage) => void

        loading: ILoadingState
    }
    chatsMessages: {
        items: { [chatId: string]: IMessageWithStatus[] }
        put: (chatId: string, item: IMessageWithStatus) => void
        replace: (chatId: string, uuid: string, item: IMessage) => void
        prepend: (chatId: string, items: IMessage[]) => void
        append: (chatId: string, items: IMessage[]) => void

        loading: ILoadingState

        lastReceivedMessage: IMessage | null
        setLastReceivedMessage: (item: IMessage) => void
    }
}

export type IP2PState = {
    p2p: {
        items: { [peerId: string]: IPrivateChatWithMetadata }
        add: (item: IPrivateChatWithMetadata) => void
        addMany: (items: IPrivateChatWithMetadata[]) => void

        loading: ILoadingState
    }
}

export type IGlobalState = IChatsState & IP2PState
