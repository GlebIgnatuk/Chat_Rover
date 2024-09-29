import { useUser } from '@/context/auth/useUser'
import { CounterContextProvider } from '@/context/counter/CounterContextProvider'
import { ReactNode, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'
// import { LeftNavigation, RightNavigation } from './Navigation'
// import { TopRibbon } from './TopRibbon'

const navigation = [
    { path: '/home', label: 'Profiles' },
    { path: '/home/chats', label: 'Chats' },
    { path: '/home/public-chats', label: 'Public Chats', disabled: true },
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

    useEffect(() => {
        // @ts-expect-error fix ts later
        window.Telegram.WebApp.BackButton.show()
        // @ts-expect-error fix ts later
        window.Telegram.WebView.onEvent('back_button_pressed', () => {
            // navigate(-1)
            // @ts-expect-error fix ts later
            window.Telegram.WebApp.close()
        })
    }, [navigate])

    return (
        <CounterContextProvider>
            <div className="relative h-full bg-[#C3B6A0] flex flex-col">
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

                <div className="relative z-10 grow grid grid-rows-[max-content,minmax(0,1fr)] overflow-hidden">
                    <div className="grid grid-cols-3 items-end bg-[#FFFAE7] pt-32 pb-10">
                        {navigation.map((n) => (
                            <NavLink
                                key={n.path}
                                to={n.path}
                                end
                                className={({ isActive }) =>
                                    cn(
                                        'text-center py-2 transition-all duration-300 font-semibold white rounded-t-xl',
                                        {
                                            'bg-[#57BEFF] pt-3': isActive,
                                            'bg-[#C3B6A0]': !isActive,
                                            'pointer-events-none bg-gray-500': n.disabled,
                                        },
                                    )
                                }
                            >
                                {n.label}
                            </NavLink>
                        ))}
                    </div>

                    <WithTransition key={location.pathname}>
                        <Outlet />
                    </WithTransition>
                </div>
            </div>
        </CounterContextProvider>
    )
}
