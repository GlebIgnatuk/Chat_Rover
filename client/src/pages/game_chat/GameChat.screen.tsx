import { Card } from '@/components/Card'
import { buildProtectedUrl } from '@/utils/url'
import { faCrown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

const servers = [
    {
        label: 'Global',
        icon: faCrown,
    },
    {
        label: 'SEA',
        icon: faCrown,
    },
    {
        label: 'Asia',
        icon: faCrown,
    },
    {
        label: 'Europe',
        icon: faCrown,
    },
    {
        label: 'HMT',
        icon: faCrown,
    },
    {
        label: 'America',
        icon: faCrown,
    },
]

export const GameChatScreen = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-2 p-1">
            {servers.map((server) => (
                <Card
                    key={server.label}
                    className="cursor-pointer"
                    onClick={() => {
                        navigate(buildProtectedUrl(`/game_chat/${server.label.toLowerCase()}`))
                    }}
                >
                    <div className="grid grid-cols-[max-content,minmax(0,1fr),max-content] items-center p-2">
                        <FontAwesomeIcon icon={server.icon} className="w-6 h-6 text-accent" />

                        <span className="text-lg text-primary-700 ml-2">{server.label}</span>

                        <span className="text-sm text-gray-300">
                            {Math.floor(Math.random() * (9999 - 1000)) + 1000}
                        </span>
                    </div>
                </Card>
            ))}
        </div>
    )
}
