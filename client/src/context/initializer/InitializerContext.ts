import { IPublicStore } from '@/store/store'
import { createContext } from 'react'

export interface IInitializerContext {
    store: IPublicStore
}

export const InitializerContext = createContext<IInitializerContext | undefined>(undefined)
