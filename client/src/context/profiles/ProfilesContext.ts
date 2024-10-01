import { createContext } from 'react'
import { IState } from './reducer'

export interface IProfilesContext {
    state: IState
    toggleLanguage: (language: string) => void
    searchProfiles: (signal?: AbortSignal) => void
}

export const ProfilesContext = createContext<IProfilesContext | undefined>(undefined)
