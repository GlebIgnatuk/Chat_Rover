import { create } from 'zustand'
import { IPublicState, IState } from './state'
import { createChatsSlice } from './slices/chats'
import { createP2PSlice } from './slices/p2p'
import { createOnlineSlice } from './slices/online'
import { createGlobalChatsSlice } from './slices/globalChats'
import { createProfilesSlice } from './slices/profiles'
import { createCommunitySlice } from './slices/community'
import { createAppConfigSlice } from './slices/appConfig'
import { createSettingsSlice } from './slices/settings'
import { IIdentity } from '@/context/auth/AuthContext'
import { createIdentitySlice } from './slices/identity'
import { createWuwaCharactersSlice } from './slices/wuwaCharacters'
import {
    IAppConfig,
    IGlobalChatWithMetadata,
    IIntl,
    IListingExpressGiveaway,
    ISearchedProfile,
    IShopProduct,
    IWuwaCharacter,
} from './types'
import { createExpressGiveawaysSlice } from './slices/expressGiveaways'
import { createShopSlice } from './slices/shop'

export interface CreateStoreOptions {
    identity: IIdentity
    searchedProfiles: ISearchedProfile[]
    globalChats: IGlobalChatWithMetadata[]
    expressGiveaways: IListingExpressGiveaway[]
    products: IShopProduct[]
}

export const createStore = (options: CreateStoreOptions) =>
    create<IState>((...a) => ({
        ...createChatsSlice(...a),
        ...createP2PSlice(...a),
        ...createOnlineSlice(...a),
        ...createGlobalChatsSlice(options.globalChats)(...a),
        ...createProfilesSlice(...a),
        ...createCommunitySlice(options.searchedProfiles)(...a),
        ...createIdentitySlice(options.identity)(...a),
        ...createExpressGiveawaysSlice(options.expressGiveaways)(...a),
        ...createShopSlice(options.products)(...a),
    }))

export interface CreatePublicStoreOptions {
    appConfig: IAppConfig
    wuwaCharacters: IWuwaCharacter[]
    intls: Record<string, IIntl>
    selectedLanguage: string
    fallbackLanguage?: string
}

export const createPublicStore = (options: CreatePublicStoreOptions) =>
    create<IPublicState>((...a) => ({
        ...createAppConfigSlice(options.appConfig, options.intls)(...a),
        ...createSettingsSlice(options.selectedLanguage, options.fallbackLanguage)(...a),
        ...createWuwaCharactersSlice(options.wuwaCharacters)(...a),
    }))

export type IStore = ReturnType<typeof createStore>
export type IPublicStore = ReturnType<typeof createPublicStore>
