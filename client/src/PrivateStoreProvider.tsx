import backgroundImage from '@/assets/auth.jpeg'
import { IIdentity } from './context/auth/AuthContext'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from './hooks/common/useLocation'
import { createStore, IStore } from './store/store'
import { AppContext } from './context/app/AppContext'
import { Outlet } from 'react-router-dom'
import { clearTelegramData, inferProfileState } from './context/auth/auth'
import { OnlineContextProvider } from './context/online/OnlineContextProvider'
import { ProfilesContextProvider } from './context/profiles'
import { AccountContextProvider } from './context/account'
import { ChatToast } from './modules/chats/ChatToast'
import { useWebsocket } from './hooks/chats/useWebsocket'
import { api } from './services/api'
import { ACTIVITY_POLLING_INTERVAL } from './config/config'
import { useBatchedLoader } from './hooks/common/useBatchedLoader'

// This component makes sure that we have a user authenticated, so we can initialize store
export const PrivateStoreProvider = () => {
    // get user from the auth screen
    const [identity] = useState(useLocation<{ user?: IIdentity }>().state?.user)
    const state = inferProfileState(identity)
    const isAuthenticated = identity && state === 'complete'

    useEffect(() => {
        if (isAuthenticated) return

        clearTelegramData()
        window.location.href = '/'
    }, [isAuthenticated])

    return isAuthenticated ? <DataLoader identity={identity} /> : null
}

interface DataLoaderProps {
    identity: IIdentity
}

const promises = Array.from(
    { length: Math.floor(Math.random() * (10 - 5)) + 5 },
    () => () =>
        new Promise((res) => setTimeout(res, Math.floor(Math.random() * (6000 - 1000)) + 1000)),
)

// This component loads everything before showing main app screen showing a loader animation
const DataLoader = ({ identity }: DataLoaderProps) => {
    const [loaded, setLoaded] = useState(false)

    const abortController = useRef<AbortController>()
    if (!abortController.current) {
        abortController.current = new AbortController()
    }

    const loader = useBatchedLoader({
        values: promises,
        failFast: true,
        onCancel: () => {
            abortController.current?.abort()
        },
    })

    useEffect(() => {
        if (loader.data) {
            setTimeout(() => setLoaded(true), 500)
        }
    }, [loader.data])

    if (loader.data && loaded) {
        return <StoreProvider identity={identity} />
    } else {
        return (
            <div className="pointer-events-none relative h-full flex justify-center items-center">
                <img
                    src={backgroundImage}
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom"
                />

                <div className="bg-black animate-pulse-25-50 absolute top-0 left-0 w-full h-full"></div>

                <div className="relative w-full flex flex-col items-center">
                    <div className="bg-black text-primary py-1 px-2 rounded-xl text-4xl">
                        Rover Chat
                    </div>

                    <div className="h-[2px] w-4/5 mt-3 bg-black">
                        <div
                            className="bg-primary h-full transition-all duration-500 w-0"
                            style={{
                                width: `${(loader.nLoaded / loader.nLoad) * 100}%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        )
    }
}

interface StoreProviderProps {
    identity: IIdentity
}

// This component initializes store with initial data like user
const StoreProvider = ({ identity }: StoreProviderProps) => {
    const store = useRef<IStore>()
    if (!store.current) {
        store.current = createStore({
            identity,
        })
    }

    return (
        <AppContext.Provider
            value={{
                store: store.current,
            }}
        >
            <OnlineContextProvider>
                <ProfilesContextProvider>
                    <AccountContextProvider>
                        <Initialized />
                    </AccountContextProvider>
                </ProfilesContextProvider>
            </OnlineContextProvider>
        </AppContext.Provider>
    )
}

// This component is used as an entry point to the authenticated app, having store and user initialized.
// Can be used to set up global things.
const Initialized = () => {
    const connect = useWebsocket()
    useEffect(() => connect(), [connect])

    // track online status
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
