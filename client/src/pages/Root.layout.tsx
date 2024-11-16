import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'

import PlayLessonIcon from '@mui/icons-material/PlayLesson'
import PlayLessonOutlinedIcon from '@mui/icons-material/PlayLessonOutlined'
import GroupIcon from '@mui/icons-material/Group'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import ChatIcon from '@mui/icons-material/Chat'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { useChatsService } from '@/hooks/chats/useChatsService'
import wuwaIcon from '@/assets/wuwa_icon.png'
import { buildProtectedUrl } from '@/utils/url'
import { DEBUG } from '@/config/config'
import { DebugPanel } from '@/modules/root/Debug'

const navigation = [
    {
        path: buildProtectedUrl('/game_chat'),
        label: 'Chat',
        IconActive: () => <img src={wuwaIcon} className="w-full h-full rounded-full" />,
        IconInactive: () => (
            <img src={wuwaIcon} className="w-6 h-6 rounded-full object-cover object-center" />
        ),
    },
    {
        path: buildProtectedUrl('/guides'),
        label: 'Guides',
        IconActive: PlayLessonIcon,
        IconInactive: PlayLessonOutlinedIcon,
        disabled: true,
    },
    {
        path: buildProtectedUrl('/'),
        label: 'Community',
        end: true,
        IconActive: GroupIcon,
        IconInactive: GroupOutlinedIcon,
    },
    {
        path: buildProtectedUrl('/chats'),
        label: 'Messages',
        IconActive: ChatIcon,
        IconInactive: ChatOutlinedIcon,
    },
    {
        path: buildProtectedUrl('/account/profiles'),
        label: 'Account',
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

export const RootLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [transitioned, setTransitioned] = useState(false)

    // @todo factor out initial fetching
    const chatsService = useChatsService()
    useEffect(() => {
        const abortController = new AbortController()
        chatsService.load(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            setTransitioned(true)
        }, 0)

        return () => {
            clearTimeout(timer)
            setTransitioned(false)
        }
    }, [location])

    useEffect(() => {
        // @ts-expect-error fix ts later
        window.Telegram.WebApp.BackButton.show()
        // @ts-expect-error fix ts later
        window.Telegram.WebView.onEvent('back_button_pressed', () => {
            navigate(-1)

            if (window.history.state.idx === 0) {
                // @ts-expect-error fix ts later
                window.Telegram.WebApp.close()
            }
        })
    }, [navigate])

    return (
        <>
            <div className="relative h-full bg-[#252323] flex flex-col">
                {DEBUG && <DebugPanel />}

                <div className="relative grow grid grid-rows-[minmax(0,1fr),max-content] overflow-hidden">
                    <WithTransition
                        key={location.pathname}
                        ignore={location.state?.animate === false}
                    >
                        <Outlet />
                    </WithTransition>

                    <div
                        className="grid bg-[#FFFAE7] border-t border-t-[#F18F01] shadow-md relative z-20"
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
                                        'text-[#F18F01]': isActive,
                                        'text-[hsl(36,99%,43%)]': !isActive,
                                        'text-gray-300 pointer-events-none': n.disabled,
                                        // 'pointer-events-none text-gray-700': n.disabled,
                                    })
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <span
                                                className={cn(
                                                    'transition-all duration-300 w-6 h-6 box-content absolute left-1/2 -translate-x-1/2 shadow-md bg-[#FFFAE7] rounded-full',
                                                    {
                                                        'top-0 opacity-0': !transitioned,
                                                        '!-top-5 p-3 opacity-100':
                                                            isActive && transitioned,
                                                    },
                                                )}
                                            >
                                                <n.IconActive />
                                            </span>
                                        )}
                                        {/* {isActive && <n.IconInactive />} */}
                                        {!isActive && <n.IconInactive />}

                                        <span className="text-xs">{n.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
