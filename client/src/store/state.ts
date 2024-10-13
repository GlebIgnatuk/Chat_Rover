import { ILoading } from './common'

type ILoadingState = {
    loading: ILoading
    startLoading: () => void
    stopLoading: () => void
    stopLoadingWithError: (error: string) => void
}

export type IChatsState = {
    chats: {
        items: string[]
        set: (items: string[]) => void
    } & ILoadingState
}

export type IProfilesState = {
    profiles: string[]
    setProfiles: (profiles: string[]) => void
}

export type IGlobalState = IChatsState & IProfilesState
