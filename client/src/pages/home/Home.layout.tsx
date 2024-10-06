import { useUser } from '@/context/auth/useUser'
import { ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'
import { Toast } from './Toast'

import HomeIcon from '@material-ui/icons/Home'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import ChatIcon from '@material-ui/icons/Chat'
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import PeopleIcon from '@material-ui/icons/People'
import PeopleOutlinedIcon from '@material-ui/icons/PeopleOutlined'

const navigation = [
    {
        path: '/home',
        label: 'Home',
        end: true,
        IconActive: HomeIcon,
        IconInactive: HomeOutlinedIcon,
    },
    { path: '/home/chats', label: 'Chats', IconActive: ChatIcon, IconInactive: ChatOutlinedIcon },
    {
        path: '/home/characters',
        label: 'Characters',
        IconActive: PeopleIcon,
        IconInactive: PeopleOutlinedIcon,
    },
    {
        path: '/home/account/profiles',
        label: 'Account',
        IconActive: AccountCircleIcon,
        IconInactive: AccountCircleOutlinedIcon,
    },
    // {
    //     path: '/home/public-chats',
    //     label: 'Public Chats',
    //     disabled: true,
    //     IconActive: HomeIcon,
    //     IconInactive: HomeOutlinedIcon,
    // },
]

const WithTransition = ({ children }: { children: ReactNode }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    return (
        <div
            className={cn('opacity-0 transition-opacity duration-500', {
                '!opacity-100': isLoaded,
            })}
        >
            {children}
        </div>
    )
}

export const HomeLayout = () => {
    const user = useUser()
    const location = useLocation()
    const navigate = useNavigate()

    const [transitioned, setTransitioned] = useState(false)

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

            if (window.history.state.idx <= 2) {
                // @ts-expect-error fix ts later
                window.Telegram.WebApp.close()
            }
        })
    }, [navigate])

    return (
        <>
            <Toast />
            <div className="relative h-full bg-[#252323] flex flex-col">
                {import.meta.env.DEV && (
                    <div className="bg-black relative z-10 p-2 opacity-50 hover:opacity-100 transition-opacity shrink-0">
                        <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                            {user.user.nickname} | {location.pathname}
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="p-1 rounded-md bg-red-900"
                                onClick={() => {
                                    sessionStorage.removeItem('__telegram__initParams')
                                    window.location.reload()
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative grow grid grid-rows-[minmax(0,1fr),max-content] overflow-hidden">
                    <WithTransition key={location.pathname}>
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
                                replace
                                end={n.end}
                                className={({ isActive }) =>
                                    cn('py-2 flex flex-col items-center justify-end relative', {
                                        'text-[#F18F01]': isActive,
                                        'text-[hsl(36,99%,43%)] s': !isActive,
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
