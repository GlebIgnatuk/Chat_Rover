import { useUser } from '@/context/auth/useUser'
import { useChat } from '@/hooks/chats/useChat'
import { useStore } from '@/store/store'
import { IMessageWithStatus } from '@/store/types'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const ChatScreen = () => {
    const { user } = useUser()
    const { id: chatId } = useParams()
    const navigate = useNavigate()
    const ref = useRef<HTMLInputElement | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const { chat, messages, sendMessage } = useChat(chatId || '')
    const onlineUsers = useStore((state) => state.online.items)

    const groupped = useMemo(() => {
        return messages.messages.reduce<Record<string, IMessageWithStatus[]>>((acc, n) => {
            const date = new Date(n.message.createdAt)
            date.setHours(0, 0, 0, 0)

            let group = acc[date.toISOString()]
            if (!group) group = acc[date.toISOString()] = []
            group.push(n)

            return acc
        }, {})
    }, [messages])

    const submit = () => {
        if (ref.current && ref.current.value.trim() !== '') {
            sendMessage(ref.current.value)
            ref.current.value = ''
        }
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [messages])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'Enter') return

            submit()
        }

        window.addEventListener('keypress', handler)

        return () => {
            window.removeEventListener('keypress', handler)
        }
    }, [chatId])

    const formatLastActivity = (date: Date): string => {
        const diff = Math.floor((Date.now() - date.getTime()) / 1000 / 60)

        if (diff < 1) return `online`
        if (diff < 60) return `${diff} minutes ago`
        if (diff < 60 * 12) return `${Math.floor(diff / 60)} hours ago`
        return `${Math.floor(diff / 60 / 24)} days ago`
    }

    if (!chat.chat || chat.loading.is) {
        return <>Loading...</>
    } else if (chat.loading.error) {
        return <>Failed to load chat: {chat.loading.error}</>
    }

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr),max-content]">
            <div className="bg-[#FFFAE7] px-1 py-2 flex items-center">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="w-10 h-4 cursor-pointer text-black"
                    onClick={() => navigate(-1)}
                />
                <div className="relative w-12 h-12 shrink-0">
                    {chat.chat.peer.avatarUrl ? (
                        <img
                            src={chat.chat.peer.avatarUrl}
                            className="w-full h-full object-cover object-center border-2 border-[#A17DA8] rounded-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center border-2 border-[#A17DA8] bg-gradient-to-b from-[#f0c0fb] to-[#A17DA8] rounded-full uppercase font-semibold text-md overflow-hidden">
                            {chat.chat.peer.nickname.substring(0, 2)}
                        </div>
                    )}
                </div>
                <div className="ml-4">
                    <div className="font-semibold text-black text-sm">
                        {chat.chat.peer.nickname}
                    </div>
                    <div className="text-sm text-gray-500">
                        {formatLastActivity(
                            onlineUsers[chat.chat.peer._id] ??
                                new Date(chat.chat.peer.lastActivityAt),
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-hidden">
                <div
                    className="h-full overflow-auto flex flex-col-reverse gap-2 px-2 pb-2"
                    ref={scrollRef}
                >
                    <div className="h-full flex flex-col-reverse gap-2 px-2">
                        {messages.loading.is && <>Loading...</>}
                        {messages.loading.is === false && messages.loading.error && (
                            <>Failed to load: {messages.loading.error}</>
                        )}
                        {messages.loading.is === false &&
                            messages.loading.error === undefined &&
                            Object.entries(groupped).map(([date, messages]) => (
                                <div className="relative flex flex-col gap-2" key={date}>
                                    {
                                        <p className="bg-black/75 self-center px-2 py-1 rounded-xl sticky top-1 text-xs">
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
                                                        'rounded-br-none':
                                                            m.createdBy._id === user._id,
                                                        'rounded-bl-none':
                                                            m.createdBy._id !== user._id,
                                                        'bg-[#FFFAE7]': status === 'sent',
                                                        'bg-amber-600': status === 'pending',
                                                        'bg-red-800': status === 'errored',
                                                    },
                                                )}
                                                onClick={() => {
                                                    if (error) alert(error)
                                                }}
                                            >
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
                    disabled={messages.messages[messages.messages.length - 1]?.status === 'pending'}
                    onClick={(e) => {
                        e.preventDefault()
                        ref.current?.focus()
                        submit()
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    )
}
