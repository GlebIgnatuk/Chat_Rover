import { buildProtectedPath } from '@/config/path'
import { useStore } from '@/context/app/useStore'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const ChatToast = () => {
    const resetLastReceivedMessage = useStore(
        (state) => state.chatsMessages.resetLastReceivedMessage,
    )
    const lastReceivedMessage = useStore((state) => state.chatsMessages.lastReceivedMessage)
    const { id: chatId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (lastReceivedMessage === null) return
        if (chatId === lastReceivedMessage?.chatId) {
            return resetLastReceivedMessage()
        }

        const timer = setTimeout(() => {
            resetLastReceivedMessage()
        }, 4000)

        return () => {
            resetLastReceivedMessage()
            clearTimeout(timer)
        }
    }, [lastReceivedMessage])

    if (chatId === lastReceivedMessage?.chatId) return null

    return (
        <div
            className={cn(
                'z-[9999] fixed top-4 -right-full w-1/2 opacity-0 px-2 py-2 rounded-l-2xl transition-all duration-300 bg-[#FFFAE7] border-b-[2px] border-l-[8px] border-[#D2AA6C] text-[#E79B46] shadow-xl animate-bounce',
                {
                    '!opacity-100 !right-0': lastReceivedMessage !== null,
                    'pointer-events-none': lastReceivedMessage === null,
                },
            )}
            onClick={() => {
                if (lastReceivedMessage) {
                    navigate(buildProtectedPath(`/chats/${lastReceivedMessage.chatId}`))
                    resetLastReceivedMessage()
                }
            }}
        >
            <div className="flex justify-between items-center gap-1">
                <span className="font-semibold grow text-ellipsis whitespace-nowrap overflow-hidden">
                    {lastReceivedMessage?.createdBy.nickname}
                </span>
                <span className="text-sm text-black shrink-0">new message!</span>
            </div>
            <div className="text-[#96662f] text-ellipsis whitespace-nowrap overflow-hidden">
                {lastReceivedMessage?.text}
            </div>
        </div>
    )
}
