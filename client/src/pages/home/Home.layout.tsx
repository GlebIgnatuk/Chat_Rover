import backgroundImage from '@/assets/home-bg.webp'
import loadingScreenImage from '@/assets/loading-screen.jpg'
import { CounterContextProvider } from '@/context/counter/CounterContextProvider'
import { IUser } from '@/context/user/UserContext'
import { UserContextProvider } from '@/context/user/UserContextProvider'
import { api } from '@/services/api'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { HomeScreen } from './Home.screen'
import { LeftNavigation, RightNavigation } from './Navigation'
import { TopRibbon } from './TopRibbon'

export const HomeLayout = () => {
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        api<IUser>('/me').then((res) => {
            if (res.success) {
                setUser(res.data)
            } else {
                console.error(`Failed to sign in: ${res.error}`)
            }
        })
    }, [])

    const navigate = useNavigate()

    useEffect(() => {
        // @ts-expect-error fix ts later
        window.Telegram.WebApp.BackButton.show()
        // @ts-expect-error fix ts later
        window.Telegram.WebView.onEvent('back_button_pressed', () => {
            navigate(-1)
        })
    }, [navigate])

    if (!user) {
        return (
            <div className="pointer-events-none relative h-full flex justify-center items-center">
                <div className="z-10 flex flex-col gap-4 items-center">
                    <FontAwesomeIcon icon={faCircleNotch} className="w-20 h-20 animate-spin duration-1000" />
                    <span className="text-lg">Connecting...</span>
                </div>
                <img
                    src={loadingScreenImage}
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom animate-pulse-25-50"
                />
            </div>
        )
    }

    return (
        <UserContextProvider user={user}>
            <CounterContextProvider>
                <div className="relative h-full">
                    <div className="relative z-10 h-full grid grid-rows-[max-content,minmax(0,1fr),max-content]">
                        <TopRibbon />

                        <div className="relative h-full">
                            <HomeScreen />
                            <LeftNavigation />
                            <RightNavigation />

                            <Outlet />
                        </div>
                    </div>

                    <img
                        src={backgroundImage}
                        className="bg-black object-cover object-bottom absolute top-0 left-0 right-0 w-full h-full z-0"
                    />
                </div>
            </CounterContextProvider>
        </UserContextProvider>
    )
}
