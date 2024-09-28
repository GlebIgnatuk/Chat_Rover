import { api } from '@/services/api'
import { useEffect, useState } from 'react'

export type PrivateChat = {
    _id: string
    peer: {
        _id: string
        nickname: string
        avatarUrl: string | null
    }
}

export const useChats = () => {
    const [chats, setChats] = useState<PrivateChat[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const loadChats = async (signal?: AbortSignal) => {
        try {
            setError(null)
            setIsLoading(true)

            const response = await api<PrivateChat[]>('/privateChats', { signal })
            if (response.success) {
                setChats(response.data)
            } else {
                setError(response.error)
            }
        } catch (e) {
            console.error(e)
            setError('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const abortController = new AbortController()
        loadChats(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    return {
        chats,
        isLoading,
        error,
        loadChats,
    }
}
