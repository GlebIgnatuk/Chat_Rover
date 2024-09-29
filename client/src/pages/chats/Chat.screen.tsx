import { useUser } from '@/context/auth/useUser'
import { useChat } from '@/context/chat'
import { MessageWithStatus } from '@/context/chat/useChat'
import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const ChatScreen = () => {
    const { user } = useUser()
    const { id: chatId } = useParams()
    const ref = useRef<HTMLInputElement | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const { messages, sendMessage, isLoading } = useChat(chatId || '')

    const groupped = useMemo(() => {
        return messages.reduce<Record<string, MessageWithStatus[]>>((acc, n) => {
            const date = new Date(n.message.createdAt)
            date.setHours(0, 0, 0, 0)

            if (!acc[date.toISOString()]) acc[date.toISOString()] = []
            acc[date.toISOString()].push(n)

            return acc
        }, {})
    }, [messages])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [messages])

    if (isLoading) {
        return <>Loading...</>
    }

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr),max-content]">
            <div className=""></div>

            <div className="grow overflow-hidden pb-1">
                <div className="h-full overflow-auto" ref={scrollRef}>
                    <div className="h-full flex flex-col gap-2 px-2">
                        {Object.entries(groupped).map(([date, messages]) => (
                            <div className="relative flex flex-col gap-2">
                                {
                                    <p
                                        key={`indicator_${date}`}
                                        className="bg-black/75 self-center px-2 py-1 rounded-xl sticky top-1 text-xs"
                                    >
                                        {new Date(date).toDateString()}
                                    </p>
                                }
                                {messages.map(({ message: m, status, error }) => (
                                    <div
                                        key={m._id}
                                        className={cn('flex flex-col', {
                                            'items-end': m.createdBy._id === user._id,
                                            'items-start': m.createdBy._id !== user._id,
                                        })}
                                    >
                                        <div
                                            className={cn(
                                                'px-2 py-1 rounded-md transition-colors duration-500 text-[#232323] min-w-24 max-w-4/5',
                                                {
                                                    'rounded-br-none': m.createdBy._id === user._id,
                                                    'rounded-bl-none': m.createdBy._id !== user._id,
                                                    'bg-[#FFFAE7]': status === 'sent',
                                                    'bg-amber-600': status === 'pending',
                                                    'bg-red-800': status === 'errored',
                                                },
                                            )}
                                            onClick={() => {
                                                if (error) alert(error)
                                            }}
                                        >
                                            {/* {m.createdBy._id !== user._id && (
                                                <div className="">{m.createdBy.nickname}</div>
                                                )} */}
                                            <div className="font-semibold">
                                                {m.createdBy.nickname}
                                            </div>
                                            <div>{m.text}</div>
                                            <div className="text-xs text-right">
                                                {new Date(m.createdAt)
                                                    .toTimeString()
                                                    .substring(0, 9)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-stretch">
                <input
                    type="text"
                    className="grow px-3 py-2 outline-none text-black text-md"
                    ref={ref}
                />
                <button
                    className="shrink-0 px-3 py-2 bg-[#E79B46] text-[#FFFAE7] font-medium disabled:bg-gray-500"
                    disabled={
                        messages.length !== 0 && messages[messages.length - 1].status === 'pending'
                    }
                    onClick={() => {
                        if (ref.current && ref.current.value.trim() !== '') {
                            sendMessage(ref.current.value)
                            ref.current.value = ''
                        }
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    )
}
