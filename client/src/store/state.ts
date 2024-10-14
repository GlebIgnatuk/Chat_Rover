import { ILoading } from './common'
import { IMessage, IMessageWithStatus, IPrivateChatWithMetadata } from './types'

type ILoadingState = {
    startLoading: () => void
    stopLoading: () => void
    stopLoadingWithError: (error: string) => void
} & ({ is: true } | { is: false; error?: string })

export type IChatsState = {
    chats: {
        items: { [chatId: string]: IPrivateChatWithMetadata }
        add: (item: IPrivateChatWithMetadata) => void
        addMany: (items: IPrivateChatWithMetadata[]) => void

        loading: ILoadingState
        itemsLoading: { [chatId: string]: ILoading }
    }
}

export type IChatsMessagesState = {
    chatsMessages: {
        lastReceivedMessage: IMessage | null
        setLastReceivedMessage: (message: IMessage) => void

        items: { [chatId: string]: IMessageWithStatus[] }

        itemLoading: { [chatId: string]: ILoading }
        startLoading: (chatId: string) => void
        stopLoading: (chatId: string) => void
        stopLoadingWithError: (chatId: string, error: string) => void
    }
}

export type IP2PState = {
    p2p: {
        items: { [peerId: string]: IPrivateChatWithMetadata }
        add: (item: IPrivateChatWithMetadata[]) => void
        addMany: (items: IPrivateChatWithMetadata[]) => void

        itemLoading: { [peerId: string]: ILoading }
        startLoading: (peerId: string) => void
        stopLoading: (peerId: string) => void
        stopLoadingWithError: (peerId: string, error: string) => void
    }
}

export type IGlobalState = IChatsState & IP2PState
