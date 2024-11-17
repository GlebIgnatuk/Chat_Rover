import { ILoading } from './common'
import {
    IGlobalChat,
    IMessage,
    IMessageWithStatus,
    IPrivateChatWithMetadata,
    ISearchedProfile,
    IUser,
} from './types'

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
        resetLastReceivedMessage: () => void
    }
}

export type IGlobalChatsState = {
    globalChats: {
        items: { [chatId: string]: IGlobalChat }
    }
    globalChatsMessages: {
        items: { [chatId: string]: IMessageWithStatus[] }
        put: (chatId: string, item: IMessageWithStatus) => void
        replace: (chatId: string, uuid: string, item: IMessage) => void
        prepend: (chatId: string, items: IMessage[]) => void
        append: (chatId: string, items: IMessage[]) => void
        set: (chatId: string, items: IMessage[]) => void

        loading: ILoadingState
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

export type IOnlineState = {
    online: {
        items: { [userId: string]: Date }
        add: (item: IUser) => void
        addMany: (items: IUser[]) => void
        remove: (userId: string) => void
        invalidate: () => void
    }
}

export type IProfilesState = {
    profiles: {
        // items: { [profileId: string]: Date }
        // add: (item: IUser) => void
        // addMany: (items: IUser[]) => void
        // remove: (userId: string) => void
        // invalidate: () => void
    }
}

export type ICommunityState = {
    community: {
        searchedItems: ISearchedProfile[]
        setSearchedItems: (items: ISearchedProfile[]) => void
        invalidateSearchedItems: () => void

        loading: ILoadingState

        filters: {
            team: ({
                characterId: string
                minLevel: number
                maxLevel: number
                minConstellation: number
                maxConstellation: number
            } | null)[]
            addTeamMember: (at: number, characterId: string) => void
            setTeamMemberMinLevel: (at: number, level: number) => void
            setTeamMemberMaxLevel: (at: number, level: number) => void
            setTeamMemberMinConstellation: (at: number, constellation: number) => void
            setTeamMemberMaxConstellation: (at: number, constellation: number) => void

            server?: string
            setServer: (server: string) => void
            unsetServer: () => void

            usesVoice: boolean | undefined
            setVoice: (value: boolean) => void
            unsetVoice: () => void

            languages: string[]
            addLanguage: (language: string) => void
            removeLanguage: (language: string) => void

            minWorldLevel: number
            setMinWorldLevel: (level: number) => void

            maxWorldLevel: number
            setMaxWorldLevel: (level: number) => void
        }
    }
}

export type IGlobalState = IChatsState &
    IGlobalChatsState &
    IP2PState &
    IOnlineState &
    IProfilesState &
    ICommunityState
