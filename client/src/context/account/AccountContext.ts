import { createContext } from 'react'

export interface IProfile {
    _id: string
    uid: number
    about: string
    nickname: string
    server: string
    usesVoice: boolean
    languages: string[]
    worldLevel: number
    team: Array<{
        characterId: string
        level: number
        constellation: number
    } | null>
}

export interface IAccountContext {
    profiles: IProfile[]
    loading: { is: true } | { is: false; error: string | null }
}

export const AccountContext = createContext<IAccountContext | undefined>(undefined)
