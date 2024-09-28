import { PrivateChat } from '@/context/chat/useChats'
import { api } from '@/services/api'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const ChatNewScreen = () => {
    const navigate = useNavigate()
    const [params] = useSearchParams()

    const load = async (signal?: AbortSignal) => {
        try {
            const peerId = params.get('peerId')

            const response = await api<PrivateChat[]>(`/privateChats?peerId=${peerId}`, { signal })
            if (response.success) {
                const chat = response.data[0]
                if (chat) {
                    return navigate(`/home/chats/${chat._id}`, { replace: true })
                } else {
                    const response = await api<PrivateChat>('/privateChats', {
                        method: 'POST',
                        body: JSON.stringify({
                            peerId: peerId,
                        }),
                        signal,
                    })
                    if (response.success) {
                        const chat = response.data
                        return navigate(`/home/chats/${chat._id}`, { replace: true })
                    }
                }
            }

            navigate('/home')
        } catch (e) {
            if (e instanceof Error && e.name === 'AbortError') {
                return
            }

            navigate('/home')
        }
    }

    useEffect(() => {
        const abortController = new AbortController()
        load(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    return (
        <div className="h-full flex items-center justify-center bg-black/75">
            <div className="w-20 h-20 border-[10px] rounded-[40px] rounded-tr-none rounded-bl-none border-[#57BEFF] bg-[#337197] animate-spin"></div>
        </div>
    )
}
