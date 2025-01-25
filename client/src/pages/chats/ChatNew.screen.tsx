import { buildProtectedPath } from '@/config/path'
import { usePeer } from '@/hooks/chats/usePeer'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const ChatNewScreen = () => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { chat, loading } = usePeer(params.get('peerId') ?? '')

    useEffect(() => {
        if (chat) {
            navigate(buildProtectedPath(`/chats/${chat._id}`), { replace: true })
        } else if (loading) {
            if (loading.is === false && loading.error) {
                if (loading.error.includes('AbortError') === false) {
                    navigate(buildProtectedPath('/'))
                }
            }
        }
    }, [chat, loading])

    return (
        <div className="h-full flex items-center justify-center bg-black/75">
            <div className="w-20 h-20 border-[10px] rounded-[40px] rounded-tr-none rounded-bl-none border-[#57BEFF] bg-[#337197] animate-spin"></div>
        </div>
    )
}
