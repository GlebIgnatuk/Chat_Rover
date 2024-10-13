import { StateCreator } from 'zustand'
import { IProfilesState } from '../state'

export const createProfilesSlice: StateCreator<IProfilesState> = (set) => ({
    profiles: [],
    setProfiles: (profiles) => set(() => ({ profiles })),
})
