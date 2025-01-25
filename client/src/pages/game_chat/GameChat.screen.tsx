import { Card } from '@/components/Card'
import { buildProtectedPath } from '@/config/path'
import { useStore } from '@/context/app/useStore'
import { api } from '@/services/api'
import { IGlobalChatWithMetadata } from '@/store/types'
import { faCrown, faPerson } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const GameChatScreen = () => {
    const navigate = useNavigate()
    const globalChats = useStore((state) => state.globalChats)

    useEffect(() => {
        const timer = setInterval(async () => {
            const response = await api<IGlobalChatWithMetadata[]>('/globalChats')
            if (response.success) {
                globalChats.setItems(response.data)
            }
        }, 5 * 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="flex flex-col gap-2 p-1">
            {globalChats.items.map((chat) => (
                <Card
                    key={chat.slug}
                    className="cursor-pointer"
                    onClick={() => {
                        navigate(buildProtectedPath(`/game_chat/${chat.slug}`))
                    }}
                >
                    <div className="grid grid-cols-[max-content,minmax(0,1fr),max-content,max-content] items-center p-2">
                        <FontAwesomeIcon icon={faCrown} className="w-6 h-6 text-accent" />

                        <span className="text-lg text-primary-700 ml-2">{chat.title}</span>

                        <span className="text-sm text-gray-300">{chat.activeSubscribers}</span>
                        <FontAwesomeIcon icon={faPerson} className="ml-1 w-4 h-4" />
                    </div>
                </Card>
            ))}
        </div>
    )
}
