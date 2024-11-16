import { Outlet } from 'react-router-dom'
import { useWebsocket } from './hooks/chats/useWebsocket'
import { useEffect } from 'react'
import { ACTIVITY_POLLING_INTERVAL } from './config/config'
import { api } from './services/api'
import { ChatToast } from './modules/chats/ChatToast'

export const AppAuthenticated = () => {
    const connect = useWebsocket()
    useEffect(() => connect(), [connect])

    useEffect(() => {
        api('/me/activities', { method: 'post' })

        const intervalId = setInterval(() => {
            api('/me/activities', { method: 'post' })
        }, ACTIVITY_POLLING_INTERVAL)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return (
        <>
            <Outlet />
            <ChatToast />
        </>
    )
}
