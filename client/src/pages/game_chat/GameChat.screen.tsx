import { useAccount } from '@/context/account'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const GameChatScreen = () => {
    const { loading, profiles } = useAccount()
    const navigate = useNavigate()

    return (
        <div className="h-full overflow-hidden grid grid-rows-[max-content,minmax(0,1fr)]">
            <div className="bg-[#131313] grid grid-cols-11">
                <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="w-4 h-4 cursor-pointer text-white col-span-1 self-center place-self-center"
                    onClick={() => navigate(-2)}
                />
                <NavLink
                    to="/home/game_chat/global"
                    state={{ animate: false }}
                    className={({ isActive }) =>
                        cn('text-center py-2 col-span-5', {
                            'font-bold': isActive,
                        })
                    }
                >
                    Global
                </NavLink>
                <NavLink
                    to="/home/game_chat/regional"
                    state={{ animate: false, chatId: profiles[0]?.server.toLowerCase() }}
                    className={({ isActive }) =>
                        cn('text-center py-2 col-span-5', {
                            'font-bold': isActive,
                            'text-gray-300 pointer-events-none':
                                loading.is || loading.error || profiles.length === 0,
                        })
                    }
                >
                    Regional {profiles.length > 0 ? `(${profiles[0]?.server})` : ''}
                </NavLink>
            </div>

            <div className="">
                <Outlet />
            </div>
        </div>
    )
}
