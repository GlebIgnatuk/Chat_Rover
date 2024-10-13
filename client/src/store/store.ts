import { create } from 'zustand'
import { IGlobalState } from './state'
import { createChatsSlice } from './slices/chats'
import { createProfilesSlice } from './slices/profiles'

export const useStore = create<IGlobalState>((...a) => ({
    ...createChatsSlice(...a),
    ...createProfilesSlice(...a),
}))
