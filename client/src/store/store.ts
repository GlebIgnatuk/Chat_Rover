import { create } from 'zustand'
import { IGlobalState } from './state'
import { createChatsSlice } from './slices/chats'
import { createP2PSlice } from './slices/p2p'

export const useStore = create<IGlobalState>((...a) => ({
    ...createChatsSlice(...a),
    ...createP2PSlice(...a),
    // ...createProfilesSlice(...a),
}))
