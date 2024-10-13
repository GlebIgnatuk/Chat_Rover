import { StateCreator } from 'zustand'
import { IChatsState } from '../state'

export const createChatsSlice: StateCreator<IChatsState> = (set) => ({
    chats: {
        items: [],
        set: (items) => set((state) => ({ chats: { ...state.chats, items } })),

        loading: { is: false },
        startLoading: () => set((state) => ({ chats: { ...state.chats, loading: { is: true } } })),
        stopLoading: () => set((state) => ({ chats: { ...state.chats, loading: { is: false } } })),
        stopLoadingWithError: (error) =>
            set((state) => ({ chats: { ...state.chats, loading: { is: false, error } } })),
    },
})
