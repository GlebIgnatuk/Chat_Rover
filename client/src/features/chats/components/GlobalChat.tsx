import { ChatInput } from './ChatInput'
import { UIEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '@/context/app/useStore'
import { IMessageWithStatus } from '@/store/types'
import { ChatMessageGroup } from './ChatMessageGroup'
import { useGlobalChat } from '../hooks/useGlobalChat'
import { buildProtectedUrl } from '@/utils/url'
import { useNavigate } from 'react-router-dom'
import { ChatFloatingButton } from './ChatFloatingButton'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

export interface GlobalChatProps {
    chatId: string
}

export const GlobalChat = ({ chatId }: GlobalChatProps) => {
    const [scrollTop, setScrollTop] = useState(0)

    const user = useStore((state) => state.identity.user)
    const ref = useRef<HTMLInputElement | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate()

    const { messages, sendMessage } = useGlobalChat(chatId || '')

    const groupped = useMemo(() => {
        const object = messages.messages.reduce<Record<string, IMessageWithStatus[]>>((acc, n) => {
            const date = new Date(n.message.createdAt)
            date.setHours(0, 0, 0, 0)

            let group = acc[date.toISOString()]
            if (!group) group = acc[date.toISOString()] = []
            group.push(n)

            return acc
        }, {})

        return Object.entries(object)
            .map<[Date, IMessageWithStatus[]]>(([k, v]) => [new Date(k), v])
            .sort(([a], [b]) => b.getTime() - a.getTime())
    }, [messages.messages])

    const submit = () => {
        if (ref.current && ref.current.value.trim() !== '') {
            sendMessage(ref.current.value)
            ref.current.value = ''
        }
    }

    const onScroll: UIEventHandler = useCallback((e) => {
        setScrollTop(e.currentTarget.scrollTop)
    }, [])

    useEffect(() => {
        if (!scrollRef.current) return

        const hasScrolledEnough = scrollRef.current.scrollTop <= -300
        if (hasScrolledEnough) return

        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        })
    }, [messages.messages])

    useEffect(() => {
        const scrollable = scrollRef.current
        if (!scrollable) return

        let timeout: number | undefined

        const onScroll = () => {
            const scrollTop = scrollable.scrollTop

            window.clearTimeout(timeout)
            timeout = window.setTimeout(() => {
                setScrollTop(scrollTop)
            }, 300)
        }

        scrollable.addEventListener('scroll', onScroll)
        return () => scrollable.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className="relative h-full grid grid-rows-[minmax(0,1fr),max-content]">
            <div className="overflow-hidden relative">
                <div
                    className="h-full flex flex-col-reverse overflow-auto gap-2 px-2 pb-2"
                    ref={scrollRef}
                    onScroll={onScroll}
                >
                    {messages.loading.is && <>Loading...</>}
                    {messages.loading.is === false && messages.loading.error && (
                        <>Failed to load: {messages.loading.error}</>
                    )}
                    {messages.loading.is === false &&
                        messages.loading.error === undefined &&
                        groupped.map(([date, messages]) => (
                            <ChatMessageGroup
                                key={date.toISOString()}
                                date={date}
                                messages={messages}
                                user={user}
                                onNicknameClick={(user) => {
                                    navigate(buildProtectedUrl(`/u/${user._id}`))
                                }}
                            />
                        ))}
                </div>

                {scrollTop <= -200 && (
                    <ChatFloatingButton
                        icon={faArrowDown}
                        className="absolute bottom-2 right-2"
                        onClick={() => {
                            const scrollable = scrollRef.current
                            if (!scrollable) return

                            scrollable.scrollTo({
                                top: scrollable.scrollHeight,
                                behavior: 'instant',
                            })
                        }}
                    />
                )}
            </div>

            <ChatInput
                ref={ref}
                buttonText="Send"
                disabled={messages.messages[messages.messages.length - 1]?.status === 'pending'}
                placeholder="Type something..."
                onSubmit={() => {
                    submit()
                }}
            />
        </div>
    )
}
