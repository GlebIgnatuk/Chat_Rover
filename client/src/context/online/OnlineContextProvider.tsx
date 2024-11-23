import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { IOnlineContext, OnlineContext } from './OnlineContext'
import { io, Socket } from 'socket.io-client'
import { useRecomputedRef } from '@/hooks/common/useRecomputedRef'
import { IUser } from '@/store/types'
import { ACTIVITY_POLLING_INTERVAL } from '@/config/config'
import { useStore } from '../app/useStore'

interface Props {
    children: ReactNode
}

export const OnlineContextProvider = ({ children }: Props) => {
    const user = useStore((state) => state.identity.user)
    const socketRef = useRef<Socket | null>(null)
    const onlineUsers = useStore((state) => state.online.items)
    const online = useRecomputedRef(useStore((state) => state.online))

    const isOnline = useCallback(
        (id: string) => {
            const lastActivityAt = onlineUsers[id]
            if (!lastActivityAt) return false

            return Date.now() - lastActivityAt.getTime() <= ACTIVITY_POLLING_INTERVAL + 5 * 1000
        },
        [onlineUsers],
    )

    const subscribe = useCallback((...to: string[]) => {
        socketRef.current?.emit('subscribe', to)
    }, [])

    const unsubscribe = useCallback((...from: string[]) => {
        socketRef.current?.emit('unsubscribe', from)
    }, [])

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_WS_URL}/users/activities`, {
            query: {
                // @ts-expect-error add type definition later
                'x-telegram-init-data': window.Telegram.WebApp.initData,
            },
            transports: ['websocket', 'polling'],
        })
        socketRef.current = socket

        socket.on('connect', async () => {
            console.log('Connected')
        })

        socket.on('online', async (user: IUser) => {
            online.current.add(user)
        })

        socket.on('offline', async (userId: string) => {
            online.current.remove(userId)
        })

        socket.on('connect_error', () => {
            socket.io.opts.transports = ['polling', 'websocket']
        })

        return () => {
            socket.disconnect()
        }
    }, [user._id])

    useEffect(() => {
        const timer = setInterval(() => {
            online.current.invalidate()
        }, 5 * 1000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    const context: IOnlineContext = {
        isOnline,
        subscribe,
        unsubscribe,
    }

    return <OnlineContext.Provider value={context}>{children}</OnlineContext.Provider>
}
