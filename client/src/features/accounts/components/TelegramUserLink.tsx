import { api } from '@/services/api'

interface Props {
    userId: string
    nickname: string
    className?: string
}

export const TelegramUserLink = ({ nickname, userId, className }: Props) => {
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault()

                api<{ user: { username: string } }[]>(`/admin/users/${userId}/telegramUsers`).then(
                    (r) => {
                        if (!r.success || r.data.length === 0) return

                        window.open(`https://t.me/${r.data[0]!.user.username}`, '_blank')
                    },
                )
            }}
            className={className}
        >
            {nickname}
        </a>
    )
}
