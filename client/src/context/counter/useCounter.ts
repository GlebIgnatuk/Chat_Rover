import { useContext } from 'react'
import { CounterContext } from './CounterContext'

export const useCounter = () => {
    const context = useContext(CounterContext)

    if (context === undefined) {
        throw new Error('useUser must be used within UserContext')
    }

    return context
}
