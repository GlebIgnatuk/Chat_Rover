import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useChatsService } from '@/hooks/chats/useChatsService'
import { DEBUG } from '@/config/config'
import { DebugPanel } from '@/modules/root/Debug'
import bgAnimation from '@/assets/bg_animation.mp4'
import { BackgroundVideo } from '@/components/BackgroundVideo'
import { cn } from 'tailwind-cn'

export const RootLayout = () => {
    const [rendered, setRendered] = useState(false)
    const navigate = useNavigate()

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

    useEffect(() => {
        setRendered(true)
    }, [])

    return (
        <div className="relative h-full flex flex-col">
            <BackgroundVideo
                src={bgAnimation}
                speed={0.5}
                className={cn('opacity-0 transition-opacity duration-500 bg-[#131313]', {
                    'opacity-100': rendered,
                })}
            />

            {DEBUG && <DebugPanel />}

            <div className="grow overflow-hidden">
                <Outlet />
            </div>
        </div>
    )
}
