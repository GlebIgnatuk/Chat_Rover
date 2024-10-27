import { useEffect, useRef } from 'react'

export const useRecomputedRef = <T>(value: T) => {
    const ref = useRef(value)

    useEffect(() => {
        ref.current = value
    }, [value])

    return ref
}
