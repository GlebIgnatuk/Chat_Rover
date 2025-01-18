import { useEffect } from 'react'

export const useTick = (action: (stop: () => void) => void, ms: number, deps: unknown[] = []) => {
    useEffect(() => {
        const timer = window.setInterval(() => {
            action(() => window.clearInterval(timer))
        }, ms)

        return () => window.clearInterval(timer)
    }, [...deps, ms])
}
