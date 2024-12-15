import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { GlobalChat } from '@/features/chats/components/GlobalChat'
import { faChevronLeft, faCrown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom'

export const GlobalChatScreen = () => {
    const navigate = useNavigate()

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

                <div className="ml-4 font-semibold text-accent text-md">Global</div>
            </div>

            <GlobalChat chatId="global" />
        </div>
    )
}
