import { ReactNode, useEffect, useRef, useState } from 'react'
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
import { useLocalize } from '@/hooks/intl/useLocalize'
import bgAnimation from '@/assets/bg_animation.mp4'

const navigation = [
    {
        path: buildProtectedUrl('/game_chat'),
        label: 'nav__chat',
        IconActive: () => (
            <img
                src={wuwaIcon}
                className="w-6 h-6 rounded-full object-cover object-center border-white border"
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

export const RootLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const localize = useLocalize()

    // @todo factor out initial fetching
    const chatsService = useChatsService()
    useEffect(() => {
        const abortController = new AbortController()
        chatsService.load(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

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

    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        const video = videoRef.current
        if (video) video.playbackRate = 0.5
    }, [])

    return (
        <>
            <div className="relative h-full flex flex-col">
                <video
                    ref={videoRef}
                    src={bgAnimation}
                    className="absolute top-0 left-0 w-full h-full object-cover object-center pointer-events-none"
                    muted
                    controls={false}
                    autoPlay
                    loop
                ></video>

                {DEBUG && <DebugPanel />}

                <div className="relative grow grid grid-rows-[minmax(0,1fr),max-content] overflow-hidden">
                    <WithTransition
                        key={location.pathname}
                        ignore={location.state?.animate === false}
                    >
                        <Outlet />
                    </WithTransition>

                    <div
                        className="grid relative z-20 bg-gradient-to-t from-black/60 to-transparent"
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
                                        'text-white s': isActive,
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
            </div>
        </>
    )
}
