import backgroundImage from '@/assets/home-bg.webp'
import { CounterContextProvider } from '@/context/counter/CounterContextProvider'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { HomeScreen } from './Home.screen'
import { LeftNavigation, RightNavigation } from './Navigation'
import { TopRibbon } from './TopRibbon'

export const HomeLayout = () => {
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
    )
}
