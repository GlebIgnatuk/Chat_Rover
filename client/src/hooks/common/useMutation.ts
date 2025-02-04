import { APIResponse } from '@/services/api'
import { useState } from 'react'

interface UseMutationProps<T, A extends unknown[]> {
    fn: (...args: A) => Promise<APIResponse<T>>
    onSuccess?: (data: T, ...args: A) => void
    onError?: (error: string, ...args: A) => void
    errorTimerMs?: number
}

export const useMutation = <T = void, A extends unknown[] = []>({
    fn,
    onSuccess,
    onError,
    errorTimerMs,
}: UseMutationProps<T, A>) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [data, setData] = useState<T | null>(null)

    const send = async (...args: A) => {
        try {
            setError('')
            setIsLoading(true)

            const response = await fn(...args)
            if (response.success) {
                setData(response.data)
                onSuccess?.(response.data, ...args)
            } else {
                onError?.(response.error, ...args)
                setError(response.error)
                if (errorTimerMs !== undefined) {
                    setTimeout(() => setError(''), errorTimerMs)
                }
            }

            setIsLoading(false)
        } catch {
            const error = 'Something went wrong'
            onError?.(error, ...args)
            setError(error)
            if (errorTimerMs !== undefined) {
                setTimeout(() => setError(''), errorTimerMs)
            }
            setIsLoading(false)
        }
    }

    return { isLoading, error, data, send }
}
