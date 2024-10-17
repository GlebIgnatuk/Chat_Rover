import { useStore } from '@/store/store'
import { useEffect } from 'react'
import { useChatsService } from './useChatsService'

export const usePeer = (peerId: string) => {
    const p2p = useStore((state) => state.p2p)
    const service = useChatsService()

    const chat = p2p.items[peerId]
    const loading = p2p.loading.items[peerId]

    const load = async (signal?: AbortSignal) => {
        return service.loadByPeerId(peerId, signal)
    }

    useEffect(() => {
        if (chat || loading?.is) return

        const abortController = new AbortController()
        load(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [chat])

    return {
        chat,
        loading: loading ?? { is: false },
    }
}
