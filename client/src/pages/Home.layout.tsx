import { ReactNode, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from 'tailwind-cn'

import PlayLessonIcon from '@mui/icons-material/PlayLesson'
import PlayLessonOutlinedIcon from '@mui/icons-material/PlayLessonOutlined'
import GroupIcon from '@mui/icons-material/Group'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import ChatIcon from '@mui/icons-material/Chat'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import wuwaIcon from '@/assets/wuwa_icon.png'
import { buildProtectedUrl } from '@/utils/url'
import { useLocalize } from '@/hooks/intl/useLocalize'

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
        path: buildProtectedUrl('/guides'),
        label: 'nav__guides',
        IconActive: PlayLessonIcon,
        IconInactive: PlayLessonOutlinedIcon,
        disabled: true,
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
        path: buildProtectedUrl('/account/profiles'),
        label: 'nav__account',
        IconActive: AccountCircleIcon,
        IconInactive: AccountCircleOutlinedIcon,
    },
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

    return (
        <div className="h-full grid grid-rows-[minmax(0,1fr),max-content]">
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
