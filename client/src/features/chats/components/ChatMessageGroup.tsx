import { IMessageWithStatus, IUser } from '@/store/types'
import { ChatMessage } from './ChatMessage'
import { cn } from 'tailwind-cn'

export interface ChatMessageGroupProps {
    date: Date
    messages: IMessageWithStatus[]
    user: IUser
}

export const ChatMessageGroup = ({ date, messages, user }: ChatMessageGroupProps) => {
    return (
        <div className="relative flex flex-col gap-2">
            <div className="bg-stone-800/90 text-primary-700 border-primary-700 border self-center px-2 py-1 rounded-xl sticky top-1 text-xs z-10">
                {date.toDateString()}
            </div>

            {messages.map(({ message: m, status, error }) => (
                <div
                    key={m._id}
                    className={cn('flex flex-col', {
                        'items-end': m.createdBy._id === user._id,
                        'items-start': m.createdBy._id !== user._id,
                    })}
                    onClick={() => {
                        if (error) alert(error)
                    }}
                >
                    <ChatMessage
                        senderName={m.createdBy.nickname}
                        isOwner={m.createdBy._id === user._id}
                        sentAt={new Date(m.createdAt)}
                        text={m.text}
                        status={status}
                    />
                </div>
            ))}
        </div>
    )
}
