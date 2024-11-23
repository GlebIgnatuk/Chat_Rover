import { create } from 'zustand'
import { IState } from './state'
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

export interface CreateStoreOptions {
    identity: IIdentity
}

export const createStore = (options: CreateStoreOptions) =>
    create<IState>((...a) => ({
        ...createChatsSlice(...a),
        ...createP2PSlice(...a),
        ...createOnlineSlice(...a),
        ...createGlobalChatsSlice(...a),
        ...createProfilesSlice(...a),
        ...createCommunitySlice(...a),
        ...createAppConfigSlice(...a),
        ...createSettingsSlice(...a),
        ...createIdentitySlice(options.identity)(...a),
    }))

export type IStore = ReturnType<typeof createStore>
