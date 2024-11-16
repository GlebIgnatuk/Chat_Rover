import { useOnline } from '@/context/online/useOnline'
import { useChats } from '@/hooks/chats/useChats'
import { buildProtectedUrl } from '@/utils/url'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const ChatsScreen = () => {
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
        <div className="h-full overflow-hidden">
            <div className="p-1 h-full overflow-y-auto space-y-1">
                {chats.map((chat) => (
                    <NavLink
                        key={chat._id}
                        to={buildProtectedUrl(`/chats/${chat._id}`)}
                        className="grid grid-cols-[max-content,minmax(0,1fr)] gap-4 p-2 bg-[#FFFAE7]"
                    >
                        <div className="relative w-14 h-14 shrink-0">
                            {chat.peer.avatarUrl ? (
                                <img
                                    src={chat.peer.avatarUrl}
                                    className="w-full h-full object-cover object-center border-2 border-[#A17DA8] rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center border-2 border-[#A17DA8] bg-gradient-to-b from-[#f0c0fb] to-[#A17DA8] rounded-full uppercase font-semibold text-xl overflow-hidden">
                                    {chat.peer.nickname.substring(0, 2)}
                                </div>
                            )}

                            <div
                                className={cn(
                                    'absolute bottom-[3px] right-[3px] w-3 h-3 border border-green-600 rounded-full',
                                    {
                                        'bg-green-400': online.isOnline(chat.peer._id),
                                        'bg-gray-50': !online.isOnline(chat.peer._id),
                                    },
                                )}
                            ></div>
                        </div>

                        <div className="grow flex flex-col justify-center">
                            <div className="flex items-center justify-between">
                                <div className="font-semibold text-[#E79B46]">
                                    {chat.peer.nickname}
                                </div>

                                <div className="text-xs text-[#8b673e]">
                                    {new Date(chat.lastMessage.createdAt)
                                        .toTimeString()
                                        .substring(0, 9)}
                                </div>
                            </div>

                            <div className="text-[#8b673e]">
                                <div className="whitespace-nowrap text-ellipsis overflow-hidden">
                                    {chat.lastMessage.text}
                                </div>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}
