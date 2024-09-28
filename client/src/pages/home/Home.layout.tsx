import backgroundImage from '@/assets/home-bg.webp'
import { CounterContextProvider } from '@/context/counter/CounterContextProvider'
import { ReactNode, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'
// import { LeftNavigation, RightNavigation } from './Navigation'
// import { TopRibbon } from './TopRibbon'

const navigation = [
    { path: '/home', label: 'Profiles' },
    { path: '/home/chats', label: 'Chats' },
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
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {}, [])

    useEffect(() => {
        // @ts-expect-error fix ts later
        window.Telegram.WebApp.BackButton.show()
        // @ts-expect-error fix ts later
        window.Telegram.WebView.onEvent('back_button_pressed', () => {
            navigate(-1)
        })
    }, [navigate])

    return (
        <CounterContextProvider>
            <div className="relative h-full">
                <div className="relative z-10 h-full grid grid-rows-[max-content,minmax(0,1fr)]">
                    <div className="grid grid-cols-2">
                        {navigation.map((n) => (
                            <NavLink
                                key={n.path}
                                to={n.path}
                                end
                                className={({ isActive }) =>
                                    cn('text-center py-2 transition-colors duration-300 font-semibold', {
                                        'bg-[#57BEFF] text-white': isActive,
                                        'bg-[#4d8bb2] text-[#c3c3c3]': !isActive,
                                    })
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

                <img
                    src={backgroundImage}
                    className="bg-black object-cover object-bottom absolute top-0 left-0 right-0 w-full h-full z-0"
                />
            </div>
        </CounterContextProvider>
    )
}
