import { Card } from '@/components/Card'
import { useOnline } from '@/context/online/useOnline'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { useChats } from '@/hooks/chats/useChats'
import { buildProtectedUrl } from '@/utils/url'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const ChatsScreen = () => {
    const navigate = useNavigate()
    const online = useOnline()
    const { chats, loading } = useChats()

    useEffect(() => {
        online.subscribe(...chats.map((chat) => chat.peer._id))

        return () => {
            online.unsubscribe(...chats.map((chat) => chat.peer._id))
        }
    }, [chats])

    if (loading.is && chats.length === 0) {
        return <>Loading...</>
    }

    return (
        <div className="h-full overflow-hidden font-exo2">
            <div className="p-1 h-full overflow-y-auto space-y-1">
                {chats.map((chat) => (
                    <Card
                        key={chat._id}
                        className="grid grid-cols-[max-content,minmax(0,1fr)] gap-4 p-2 cursor-pointer"
                        onClick={() => {
                            navigate(buildProtectedUrl(`/chats/${chat._id}`))
                        }}
                    >
                        <AccountAvatar
                            size="xl"
                            url={chat.peer.avatarUrl}
                            nickname={chat.peer.nickname}
                            online={online.isOnline(chat.peer._id)}
                        />

                        <div className="">
                            <div className="flex items-center justify-between">
                                <div className="font-semibold text-accent">
                                    {chat.peer.nickname}
                                </div>

                                <div className="text-xs text-primary-700">
                                    {new Date(chat.lastMessage.createdAt)
                                        .toTimeString()
                                        .substring(0, 9)}
                                </div>
                            </div>

                            <div className="text-gray-300">
                                <div className="line-clamp-2 leading-5">
                                    {chat.lastMessage.text.repeat(3)}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
