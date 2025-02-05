import { APIErrorResponse, APIResponse } from '@/services/api'
import { useState } from 'react'

interface UseMutationProps<T, A extends unknown[]> {
    fn: (...args: A) => Promise<APIResponse<T>>
    onSuccess?: (data: T, ...args: A) => void
    onError?: (error: APIErrorResponse | string, ...args: A) => string | void
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
                const message = onError ? onError?.(response, ...args) : response.error
                if (message) {
                    setError(message)
                }
                if (errorTimerMs !== undefined) {
                    setTimeout(() => setError(''), errorTimerMs)
                }
            }

            setIsLoading(false)
        } catch (e) {
            const message = onError
                ? onError?.((e as Error).message, ...args)
                : 'Something went wrong'
            if (message) {
                setError(message)
            }
            if (errorTimerMs !== undefined) {
                setTimeout(() => setError(''), errorTimerMs)
            }
            setIsLoading(false)
        }
    }

    return { isLoading, error, data, send }
}
