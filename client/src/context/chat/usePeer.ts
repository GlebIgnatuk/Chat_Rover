import { useContext, useEffect } from 'react'
import { ChatContext } from './ChatContext'

export const usePeer = (peerId: string) => {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error('ChatContext must be used within provider')
    }

    const { state, loadChatByPeer } = context
    const chat = state.p2p.items[peerId]
    const loading = state.p2p.itemLoading[peerId]

    useEffect(() => {
        console.log('effect')
        if (chat) return

        const abortController = new AbortController()
        loadChatByPeer(peerId, abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [peerId, chat])

    return {
        chat,
        loading: loading ?? { is: false, error: null },
    }
}
