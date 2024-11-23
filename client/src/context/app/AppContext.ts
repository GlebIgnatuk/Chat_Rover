import { IStore } from '@/store/store'
import { createContext } from 'react'

export interface IAppContext {
    store: IStore
}

export const AppContext = createContext<IAppContext | undefined>(undefined)
