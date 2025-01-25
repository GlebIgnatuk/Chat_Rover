import { ChatInput } from './ChatInput'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '@/context/app/useStore'
import { IMessageWithStatus } from '@/store/types'
import { ChatMessageGroup } from './ChatMessageGroup'
import { useGlobalChat } from '../hooks/useGlobalChat'
import { useNavigate } from 'react-router-dom'
import { ChatFloatingButton } from './ChatFloatingButton'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { buildProtectedPath } from '@/config/path'

export interface GlobalChatProps {
    chatId: string
}

export const GlobalChat = ({ chatId }: GlobalChatProps) => {
    const [showFloatingButton, setShowFloatingButton] = useState(false)
    const [isFirstLoad, setIsFirstLoad] = useState(true)

    const user = useStore((state) => state.identity.user)
    const ref = useRef<HTMLInputElement | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate()

    const {
        lastReadMessageId,
        lastReadMessageIndex,
        notReadMessagesCount,
        messages,
        sendMessage,
        markMessageAsRead,
        loadPreviousPage,
    } = useGlobalChat(chatId || '')

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
            .sort(([a], [b]) => a.getTime() - b.getTime())
    }, [messages.messages])

    const submit = () => {
        if (ref.current && ref.current.value.trim() !== '') {
            sendMessage(ref.current.value)
            ref.current.value = ''

            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'instant',
                })
            }
        }
    }

    useEffect(() => {
        if (messages.messages && messages.messages.length !== 0) {
            setIsFirstLoad(false)
        }
    }, [messages.messages])

    // scroll to down on new message (ignore if scrolled to top manually)
    useEffect(() => {
        const scrollable = scrollRef.current
        if (!scrollable) return

        if (isFirstLoad) {
            scrollable.scrollTo({
                top: scrollable.scrollHeight,
                behavior: 'instant',
            })
        } else {
            const hasScrolledEnough =
                scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight >= 200

            if (hasScrolledEnough) return

            scrollable.scrollTo({
                top: scrollable.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [messages.messages, isFirstLoad])

    // display floating button depending on scroll
    useEffect(() => {
        const scrollable = scrollRef.current
        if (!scrollable) return

        let timeout: number | undefined

        const onScroll = () => {
            const showFloatingButton =
                scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight >= 200

            window.clearTimeout(timeout)
            timeout = window.setTimeout(() => {
                setShowFloatingButton(showFloatingButton)
            }, 50)
        }

        scrollable.addEventListener('scroll', onScroll)
        return () => scrollable.removeEventListener('scroll', onScroll)
    }, [])

    // display floating button depending on new messages
    useEffect(() => {
        const scrollable = scrollRef.current
        if (!scrollable) return
        const showFloatingButton =
            scrollable.scrollHeight - scrollable.scrollTop - scrollable.clientHeight >= 200
        setShowFloatingButton(showFloatingButton)
    }, [messages.messages])

    // load chat history as you scroll to top
    useEffect(() => {
        const scrollable = scrollRef.current
        if (!scrollable || messages.loading.is || isFirstLoad) return

        const onScroll = () => {
            const avgMessageHeight = 80
            const messagesLeft = Math.floor(scrollable.scrollTop / avgMessageHeight)

            if (messagesLeft <= 3 && !messages.loading.is && !messages.loading.error) {
                const scrollHeight = scrollable.scrollHeight

                loadPreviousPage().then(() => {
                    const newScrollTop = scrollable.scrollHeight - scrollHeight - 80
                    scrollable.scrollTo({ top: newScrollTop, behavior: 'instant' })
                })
            }
        }

        scrollable.addEventListener('scroll', onScroll)
        return () => scrollable.removeEventListener('scroll', onScroll)
    }, [loadPreviousPage, messages.loading, isFirstLoad])

    // mark messages as read as you scroll
    useEffect(() => {
        const scrollable = scrollRef.current
        if (!scrollable || lastReadMessageIndex === messages.messages.length - 1) return

        const observer = new IntersectionObserver(
            (targets) => {
                for (const target of targets) {
                    if (target.intersectionRatio < 0.5) continue

                    observer.unobserve(target.target)

                    const messageId = (target.target as HTMLElement).dataset['messageId']
                    if (!messageId) continue

                    markMessageAsRead(messageId)
                }
            },
            {
                root: scrollable,
                rootMargin: '0px',
                threshold: [0, 0.5, 1.0],
            },
        )

        const elements = Array.from(scrollable.querySelectorAll('[data-message-id]')).slice(
            lastReadMessageIndex + 1,
        )
        elements.forEach((e) => observer.observe(e))

        return () => observer.disconnect()
    }, [messages.messages, lastReadMessageIndex, markMessageAsRead])

    return (
        <div className="relative h-full grid grid-rows-[minmax(0,1fr),max-content]">
            <div className="overflow-hidden relative">
                <div className="h-full flex flex-col overflow-auto gap-2 px-2 pb-2" ref={scrollRef}>
                    {messages.loading.is && (
                        <div className="flex justify-center py-2">
                            <CircularLoaderIndicator size="lg" />
                        </div>
                    )}
                    {messages.messages.length === 0 &&
                        messages.loading.is === false &&
                        messages.loading.error && <>Failed to load: {messages.loading.error}</>}
                    {messages.messages.length !== 0 &&
                        groupped.map(([date, messages]) => (
                            <ChatMessageGroup
                                key={date.toISOString()}
                                date={date}
                                messages={messages}
                                user={user}
                                onNicknameClick={(user) => {
                                    navigate(buildProtectedPath(`/u/${user._id}`))
                                }}
                            />
                        ))}
                </div>

                {showFloatingButton && (
                    <ChatFloatingButton
                        icon={faArrowDown}
                        className="absolute bottom-2 right-2"
                        onClick={() => {
                            const scrollable = scrollRef.current
                            if (!scrollable) return

                            const target = scrollable.querySelector(
                                `[data-message-id="${lastReadMessageId}"]`,
                            )

                            if (target) {
                                target.scrollIntoView({
                                    behavior: 'instant',
                                    block: 'center',
                                })
                            } else {
                                scrollable.scrollTo({
                                    top: scrollable.scrollHeight,
                                    behavior: 'instant',
                                })
                            }
                        }}
                    >
                        {notReadMessagesCount !== 0 && (
                            <div className="w-5 h-5 text-sm absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-primary-700 text-stone-800">
                                {notReadMessagesCount}
                            </div>
                        )}
                    </ChatFloatingButton>
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
