import { create } from 'zustand'
import { IGlobalState } from './state'
import { createChatsSlice } from './slices/chats'
import { createP2PSlice } from './slices/p2p'
import { createOnlineSlice } from './slices/online'
import { createGlobalChatsSlice } from './slices/globalChats'
import { createProfilesSlice } from './slices/profiles'
import { createCommunitySlice } from './slices/community'

export const useStore = create<IGlobalState>((...a) => ({
    ...createChatsSlice(...a),
    ...createP2PSlice(...a),
    ...createOnlineSlice(...a),
    ...createGlobalChatsSlice(...a),
    ...createProfilesSlice(...a),
    ...createCommunitySlice(...a),
}))
