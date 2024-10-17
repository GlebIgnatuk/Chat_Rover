import { Message } from '@/context/chat/reducer'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const Toast = () => {
    // @todo
    const lastMessage = null as Message | null
    // const lastMessage = useLastMessage()

    const [lastMessageLocal, setLastMessage] = useState<Message | null>(lastMessage)
    const { id: chatId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setLastMessage(null)

        if (chatId === lastMessage?.chatId) return

        setLastMessage(lastMessage)

        const timer = setTimeout(() => {
            setLastMessage(null)
        }, 4000)

        return () => {
            clearTimeout(timer)
        }
    }, [lastMessage])

    if (chatId === lastMessage?.chatId) return null

    return (
        <div
            className={cn(
                'z-[9999] fixed top-4 -right-full w-1/2 opacity-0 px-2 py-2 rounded-l-2xl transition-all duration-300 bg-[#FFFAE7] border-b-[2px] border-l-[8px] border-[#D2AA6C] text-[#E79B46] shadow-xl animate-bounce',
                {
                    '!opacity-100 !right-0': lastMessageLocal !== null,
                    'pointer-events-none': lastMessageLocal === null,
                },
            )}
            onClick={() => {
                if (lastMessageLocal) {
                    navigate(`/chats/${lastMessageLocal.chatId}`)
                    setLastMessage(null)
                }
            }}
        >
            <div className="flex justify-between items-center gap-1">
                <span className="font-semibold grow text-ellipsis whitespace-nowrap overflow-hidden">
                    {lastMessageLocal?.createdBy.nickname}
                </span>
                <span className="text-sm text-black shrink-0">new message!</span>
            </div>
            <div className="text-[#96662f] text-ellipsis whitespace-nowrap overflow-hidden">
                {lastMessageLocal?.text}
            </div>
        </div>
    )
}
