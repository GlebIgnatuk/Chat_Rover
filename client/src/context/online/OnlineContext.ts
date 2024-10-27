import { createContext } from 'react'

export interface IOnlineContext {
    isOnline: (id: string) => boolean
    subscribe: (...to: string[]) => void
    unsubscribe: (...from: string[]) => void
}

export const OnlineContext = createContext<IOnlineContext | undefined>(undefined)
