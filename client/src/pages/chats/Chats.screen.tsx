import { useChats } from '@/hooks/chats/useChats'
import { NavLink } from 'react-router-dom'

export const ChatsScreen = () => {
    const { chats, loading } = useChats()

    if (loading.is && chats.length === 0) {
        return <>Loading...</>
    }

    return (
        <div className="h-full overflow-hidden">
            <div className="p-1 h-full overflow-y-auto space-y-1">
                {chats.map((chat) => (
                    <NavLink
                        key={chat._id}
                        to={`/chats/${chat._id}`}
                        className="grid grid-cols-[max-content,minmax(0,1fr)] gap-4 p-2 bg-[#FFFAE7]"
                    >
                        {chat.peer.avatarUrl ? (
                            <img
                                src={chat.peer.avatarUrl}
                                className="w-14 h-14 object-cover object-center border-2 border-[#A17DA8] rounded-full shrink-0"
                            />
                        ) : (
                            <div className="flex items-center justify-center border-2 border-[#A17DA8] bg-gradient-to-b from-[#f0c0fb] to-[#A17DA8] rounded-full w-14 h-14 uppercase font-semibold text-xl overflow-hidden shrink-0">
                                {chat.peer.nickname.substring(0, 2)}
                            </div>
                        )}

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
