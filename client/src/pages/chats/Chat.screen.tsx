import { useStore } from '@/context/app/useStore'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { PrivateChat } from '@/features/chats/components/PrivateChat'
import { useChat } from '@/hooks/chats/useChat'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from 'tailwind-cn'

const formatLastActivity = (date: Date): string => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000 / 60)

    if (diff < 1) return `online`
    if (diff < 60) return `${diff} minutes ago`
    if (diff < 60 * 12) return `${Math.floor(diff / 60)} hours ago`
    return `${Math.floor(diff / 60 / 24)} days ago`
}

export const ChatScreen = () => {
    const { id: chatId } = useParams()
    const navigate = useNavigate()

    const { chat } = useChat(chatId || '')
    const onlineUsers = useStore((state) => state.online.items)

    if (!chat.chat || chat.loading.is) {
        return <>Loading...</>
    } else if (chat.loading.error) {
        return <>Failed to load chat: {chat.loading.error}</>
    }

    const onlineActivity = formatLastActivity(
        onlineUsers[chat.chat.peer._id] ?? new Date(chat.chat.peer.lastActivityAt),
    )

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr)]">
            <div className="bg-stone-800 px-1 py-2 flex items-center">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="w-10 h-4 cursor-pointer text-primary-700"
                    onClick={() => navigate(-1)}
                />

                <div className="relative w-12 h-12 shrink-0">
                    <AccountAvatar
                        size="md"
                        url={chat.chat.peer.avatarUrl}
                        nickname={chat.chat.peer.nickname}
                    />
                </div>

                <div className="ml-4">
                    <div className="font-semibold text-accent text-sm">
                        {chat.chat.peer.nickname}
                    </div>
                    <div
                        className={cn('text-sm', {
                            'text-primary-700': onlineActivity === 'online',
                            'text-gray-300': onlineActivity !== 'online',
                        })}
                    >
                        {onlineActivity}
                    </div>
                </div>
            </div>

            <PrivateChat chatId={chatId || ''} shouldLoad={false} />
        </div>
    )
}
