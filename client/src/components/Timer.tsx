import { memo, ReactNode, useEffect, useState } from 'react'

export interface TimerProps {
    end: Date
    children?: ReactNode
    onComplete?: () => void
}

const COMPLETED_TIME = '00:00:00'

const formatTime = (end: Date) => {
    if (end.getTime() <= Date.now()) return COMPLETED_TIME

    const timeLeftInSeconds = Math.floor((end.getTime() - Date.now()) / 1000)

    const hours = Math.floor(timeLeftInSeconds / 60 / 60)
    const minutes = Math.abs(Math.floor(timeLeftInSeconds / 60) % 60)
    const seconds = Math.abs(timeLeftInSeconds % 60)

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export const Timer = memo(({ end, children, onComplete }: TimerProps) => {
    const [event, setEvent] = useState({})
    void event

    const time = formatTime(end)
    const completed = time === COMPLETED_TIME

    useEffect(() => {
        const timer = window.setInterval(() => {
            setEvent({})
        }, 1000)

        return () => window.clearInterval(timer)
    }, [])

    useEffect(() => {
        if (!completed) return

        onComplete?.()
    }, [onComplete, completed])

    if (completed) {
        return children ?? COMPLETED_TIME
    } else {
        return formatTime(end)
    }
})
