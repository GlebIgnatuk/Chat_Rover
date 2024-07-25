import { ReactNode, useEffect, useState } from 'react'
import { CounterContext, ICounterContext } from './CounterContext'

interface Props {
    children: ReactNode
}

export const CounterContextProvider = ({ children }: Props) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const tick = 100

        setInterval(() => {
            setCount((prev) => prev + Math.ceil((prev / 1000) * (tick / 1000)))
        }, tick)
    }, [])

    const context: ICounterContext = {
        count,
        increaseBy: setCount,
    }

    return <CounterContext.Provider value={context}>{children}</CounterContext.Provider>
}
