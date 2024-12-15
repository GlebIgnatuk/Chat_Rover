import { useNavigate, useParams } from 'react-router-dom'
import { GlobalChat } from '@/features/chats/components/GlobalChat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faCrown } from '@fortawesome/free-solid-svg-icons'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { SUPPORTED_SERVERS } from '@/config/config'

export const RegionalChatScreen = () => {
    const navigate = useNavigate()
    const { region: chatId } = useParams()

    if (!chatId) {
        throw new Error('Invalid chat id')
    }

    const server = SUPPORTED_SERVERS.find((s) => s.toLowerCase() === chatId)

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr)]">
            <div className="bg-stone-800 px-1 py-2 flex items-center">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="w-10 h-4 cursor-pointer text-primary-700"
                    onClick={() => navigate(-1)}
                />

                <div className="relative w-12 h-12 shrink-0">
                    <AccountAvatar size="md">
                        <FontAwesomeIcon icon={faCrown} className="w-6 h-6" />
                    </AccountAvatar>
                </div>

                <div className="ml-4 font-semibold text-accent text-md">{server ?? '-'}</div>
            </div>

            <GlobalChat chatId={chatId} />
        </div>
    )
}
