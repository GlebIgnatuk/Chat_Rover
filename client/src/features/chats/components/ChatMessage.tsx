import { Card } from '@/components/Card'
import { cn } from 'tailwind-cn'

export interface ChatMessageProps {
    id: string
    status: 'sent' | 'pending' | 'errored'
    text: string
    sentAt: Date
    senderName: string
    isOwner: boolean
    onNicknameClick?: () => void
}

export const ChatMessage = ({
    id,
    senderName,
    sentAt,
    status,
    text,
    isOwner,
    onNicknameClick,
}: ChatMessageProps) => {
    return (
        <Card
            data-message-id={id}
            className={cn(
                'px-2 py-1 rounded-md transition-colors duration-500 min-w-24 max-w-4/5',
                {
                    'rounded-br-none': isOwner,
                    'rounded-bl-none': !isOwner,
                    // 'bg-[#FFFAE7]': status === 'sent',
                    // 'bg-black/70': status === 'sent',
                    // 'bg-black/70': status === 'pending',
                    'bg-red-800/70': status === 'errored',
                },
            )}
        >
            <div
                className={cn('font-semibold text-accent', {
                    'cursor-pointer': onNicknameClick !== undefined,
                })}
                onClick={onNicknameClick}
            >
                {senderName}
            </div>
            <div>{text}</div>
            <div className="text-xs text-right text-primary-700">
                {sentAt.toTimeString().substring(0, 5)}
            </div>
        </Card>
    )
}
