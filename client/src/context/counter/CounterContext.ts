import { createContext, Dispatch, SetStateAction } from 'react'

export interface ICounterContext {
    count: number
    increaseBy: Dispatch<SetStateAction<number>>
}

export const CounterContext = createContext<ICounterContext | undefined>(undefined)
