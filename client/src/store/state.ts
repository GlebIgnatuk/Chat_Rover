import { ILoading } from './common'
import {
    IAppConfig,
    IGlobalChatWithMetadata,
    IIntl,
    IListingExpressGiveaway,
    IMessage,
    IMessageWithStatus,
    IPrivateChatWithMetadata,
    ISearchedProfile,
    IUser,
    IWuwaCharacter,
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
        items: IGlobalChatWithMetadata[]
        setItems: (chats: IGlobalChatWithMetadata[]) => void
    }
    globalChatsMessages: {
        items: { [chatId: string]: IMessageWithStatus[] }
        put: (chatId: string, item: IMessageWithStatus) => void
        replace: (chatId: string, uuid: string, item: IMessage) => void
        prepend: (chatId: string, items: IMessage[]) => void
        append: (chatId: string, items: IMessage[]) => void
        set: (chatId: string, items: IMessage[]) => void

        lastReadMessages: { [chatId: string]: string }
        setLastReadMessage: (chatId: string, messageId: string) => void

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
        appendSearchedItems: (items: ISearchedProfile[]) => void
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
            removeTeamMember: (at: number) => void
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

            reset: () => void
        }
    }
}

export type IIdentityState = {
    identity: {
        identity: {
            id: number
            username: string
            first_name?: string
            last_name?: string
            language_code: string
            is_premium: boolean
            allows_write_to_pm: boolean
        }
        user: IUser
        setUser: (user: IUser) => void
    }
}

export type IExpressGiveawaysState = {
    expressGiveaways: {
        items: IListingExpressGiveaway[]
        setItems: (items: IListingExpressGiveaway[]) => void
    }
}

export type IState = IChatsState &
    IGlobalChatsState &
    IP2PState &
    IOnlineState &
    IProfilesState &
    ICommunityState &
    IIdentityState &
    IExpressGiveawaysState

export type IAppConfigState = {
    appConfig: {
        config: IAppConfig

        intls: Record<string, Record<string, string>>
        addIntl: (language: string, intls: IIntl) => void
    }
}

export type ISettingsState = {
    settings: {
        language: string
        fallbackLanguage: string | null
        setLanguage: (language: string, fallbackLanguage?: string) => void
    }
}

export type IWuwaCharactersState = {
    wuwaCharacters: {
        items: Record<string, IWuwaCharacter>
    }
}

export type IPublicState = IAppConfigState & ISettingsState & IWuwaCharactersState
