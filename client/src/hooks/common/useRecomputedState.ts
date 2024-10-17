import { useEffect, useState } from 'react'

export const useRecomputedState = <T>(value: T) => {
    const [state, setState] = useState(value)

    useEffect(() => {
        setState(value)
    }, [value])

    return state
}
