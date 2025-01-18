import { ReactNode, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from 'tailwind-cn'

// import PlayLessonIcon from '@mui/icons-material/PlayLesson'
// import PlayLessonOutlinedIcon from '@mui/icons-material/PlayLessonOutlined'
import GroupIcon from '@mui/icons-material/Group'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import ChatIcon from '@mui/icons-material/Chat'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import RedeemIcon from '@mui/icons-material/Redeem'
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import PlayLessonIcon from '@mui/icons-material/PlayLesson'
import PlayLessonOutlinedIcon from '@mui/icons-material/PlayLessonOutlined'
import wuwaIcon from '@/assets/wuwa_icon.png'
import { buildImageUrl, buildProtectedUrl } from '@/utils/url'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDharmachakra } from '@fortawesome/free-solid-svg-icons'
import { useStore } from '@/context/app/useStore'

const navigation = [
    {
        path: buildProtectedUrl('/game_chat'),
        label: 'nav__chat',
        IconActive: () => (
            <img
                src={wuwaIcon}
                className="w-6 h-6 rounded-full object-cover object-center border-primary-700 border"
            />
        ),
        IconInactive: () => (
            <img src={wuwaIcon} className="w-6 h-6 rounded-full object-cover object-center" />
        ),
    },
    {
        path: buildProtectedUrl('/giveaway'),
        label: 'nav__giveaway',
        IconActive: () => (
            <FontAwesomeIcon
                icon={faDharmachakra}
                className="w-6 h-6 animate-spin"
                style={{ animationDuration: '2s' }}
            />
        ),
        IconInactive: () => (
            <FontAwesomeIcon
                icon={faDharmachakra}
                className="w-6 h-6 animate-spin"
                style={{ animationDuration: '3s' }}
            />
        ),
        disabled: false,
    },
    {
        path: buildProtectedUrl('/'),
        label: 'nav__search',
        end: true,
        IconActive: GroupIcon,
        IconInactive: GroupOutlinedIcon,
    },
    {
        path: buildProtectedUrl('/chats'),
        label: 'nav__messages',
        IconActive: ChatIcon,
        IconInactive: ChatOutlinedIcon,
    },
    {
        path: buildProtectedUrl('/guides'),
        label: 'nav__guides',
        IconActive: PlayLessonIcon,
        IconInactive: PlayLessonOutlinedIcon,
        disabled: true,
    },
    // {
    //     path: buildProtectedUrl('/account/profiles'),
    //     label: 'nav__account',
    //     IconActive: AccountCircleIcon,
    //     IconInactive: AccountCircleOutlinedIcon,
    // },
]

const WithTransition = ({ children, ignore }: { children: ReactNode; ignore?: boolean }) => {
    const [isLoaded, setIsLoaded] = useState(ignore === true)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div
            className={cn('relative opacity-0 transition-opacity duration-500', {
                '!opacity-100': isLoaded,
            })}
        >
            {children}
        </div>
    )
}

export const HomeLayout = () => {
    const location = useLocation()
    const localize = useLocalize()
    const { user } = useStore((state) => state.identity)

    const [hasAvailableGift, setHasAvailableGift] = useState(false)

    useEffect(() => {
        const nextBonusAt = new Date(user.dailyBonusCollectedAt).getTime() + 12 * 60 * 60 * 1000
        const timeLeft = nextBonusAt - Date.now()

        if (timeLeft > 0) {
            setHasAvailableGift(false)
        }

        const timer = window.setTimeout(() => {
            setHasAvailableGift(true)
        }, timeLeft)

        return () => window.clearTimeout(timer)
    }, [user])

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr),max-content]">
            <div className="bg-stone-800 border-b border-primary-700 grid grid-cols-[max-content,minmax(0,1fr),max-content,max-content] items-center p-2 gap-3">
                <div className="font-bold">Rover Chat</div>

                <div className="flex gap-1 items-center justify-end">
                    <img
                        src={buildImageUrl(import.meta.env.BASE_URL + '/currency/lunite.png')}
                        className="w-6 h-6"
                    />
                    <span className="font-medium text-sm">{user.balance}</span>
                </div>

                <NavLink
                    to={buildProtectedUrl('/gifts')}
                    className={({ isActive }) =>
                        cn('py-2 flex flex-col items-center justify-end relative', {
                            'text-primary-700': isActive,
                            'text-gray-300': !isActive,
                        })
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && <RedeemIcon />}
                            {!isActive && <RedeemOutlinedIcon />}
                            {hasAvailableGift && (
                                <div className="w-2 h-2 rounded-full bg-red-600 absolute top-2 -right-1"></div>
                            )}
                        </>
                    )}
                </NavLink>
                <NavLink
                    to={buildProtectedUrl('/account/profiles')}
                    className={({ isActive }) =>
                        cn('py-2 flex flex-col items-center justify-end relative', {
                            'text-primary-700': isActive,
                            'text-gray-300': !isActive,
                        })
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && <AccountCircleIcon />}
                            {!isActive && <AccountCircleOutlinedIcon />}
                        </>
                    )}
                </NavLink>
            </div>

            <WithTransition
                key={location.pathname}
                ignore
                // ignore={location.state?.animate === false}
            >
                <Outlet />
            </WithTransition>

            <div
                className="grid w-full sm:w-[460px] bg-gradient-to-t from-black/60 to-transparent"
                style={{
                    gridTemplateColumns: `repeat(${navigation.length}, minmax(0, 1fr))`,
                }}
            >
                {navigation.map((n) => (
                    <NavLink
                        key={n.path}
                        to={n.path}
                        end={n.end}
                        className={({ isActive }) =>
                            cn('py-2 flex flex-col items-center justify-end relative', {
                                'text-primary-700': isActive,
                                'text-gray-300': !isActive,
                                'text-gray-500 pointer-events-none': n.disabled,
                            })
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && <n.IconActive />}
                                {!isActive && <n.IconInactive />}

                                <span className="text-xs">{localize(n.label)}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}
