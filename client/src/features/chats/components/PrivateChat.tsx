import { useChat } from '@/hooks/chats/useChat'
import { ChatInput } from './ChatInput'
import { useEffect, useMemo, useRef } from 'react'
import { useStore } from '@/context/app/useStore'
import { IMessageWithStatus } from '@/store/types'
import { ChatMessageGroup } from './ChatMessageGroup'
import bgAnimation from '@/assets/bg_animation.mp4'
import { BackgroundVideo } from '@/components/BackgroundVideo'

export interface PrivateChatProps {
    chatId: string
    shouldLoad?: boolean
}

export const PrivateChat = ({ chatId, shouldLoad }: PrivateChatProps) => {
    const user = useStore((state) => state.identity.user)
    const ref = useRef<HTMLInputElement | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)

    const { messages, sendMessage } = useChat(chatId || '', shouldLoad)

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

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [messages.messages])

    return (
        <div className="h-full grid grid-rows-[minmax(0,1fr),max-content] relative">
            <BackgroundVideo src={bgAnimation} speed={0.5} />

            <div className="overflow-hidden">
                <div
                    className="h-full flex flex-col-reverse overflow-auto gap-2 px-2 pb-2"
                    ref={scrollRef}
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
                            />
                        ))}
                </div>
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
