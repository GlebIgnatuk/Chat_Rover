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
import { IGlobalChatWithMetadata, IListingExpressGiveaway, ISearchedProfile } from './store/types'
import { ITEMS_PER_PAGE } from './features/search/hooks/useSearch'

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

// This component loads everything before showing main app screen showing a loader animation
const DataLoader = ({ identity }: DataLoaderProps) => {
    const [loaded, setLoaded] = useState(false)

    const searchProfiles = async () => {
        const response = await api<ISearchedProfile[]>(`/profiles?limit=${ITEMS_PER_PAGE}`)
        if (response.success) {
            return response.data
        } else {
            return []
        }
    }

    const loadGlobalChats = async () => {
        const response = await api<IGlobalChatWithMetadata[]>(`/globalChats`)
        if (response.success) {
            return response.data
        } else {
            return []
        }
    }

    const loadExpressGiveaways = async () => {
        const response = await api<IListingExpressGiveaway[]>(`/expressGiveaways`)
        if (response.success) {
            return response.data
        } else {
            return []
        }
    }

    const loader = useBatchedLoader({
        values: [
            () => searchProfiles(),
            () => loadGlobalChats(),
            () => loadExpressGiveaways(),
            // mock loading
            () => new Promise((res) => setTimeout(res, 300)),
            () => new Promise((res) => setTimeout(res, 1000)),
            () => new Promise((res) => setTimeout(res, 900)),
        ],
        onCancel: () => {
            // abortController.current?.abort()
        },
    })

    useEffect(() => {
        if (loader.data) {
            setTimeout(() => setLoaded(true), 500)
        }
    }, [loader.data])

    if (loader.data && loaded) {
        const [searchedProfiles, globalChats, expressGiveaways] = loader.$unwrap()

        return (
            <StoreProvider
                identity={identity}
                searchedProfiles={searchedProfiles}
                globalChats={globalChats}
                expressGiveaways={expressGiveaways}
            />
        )
    } else {
        return (
            <div className="pointer-events-none relative h-full flex justify-center items-center bg-[#131313]">
                <div className="relative w-full flex flex-col items-center">
                    <div
                        className="text-primary py-1 px-2 rounded-xl text-4xl"
                        style={{
                            textShadow: `0 0 7px #c9ac67,
                                    0 0 10px #c9ac67,
                                    0 0 31px #c9ac67,
                                    0 0 62px #c9ac67,
                                    0 0 102px #c9ac67`,
                        }}
                    >
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
    searchedProfiles: ISearchedProfile[]
    globalChats: IGlobalChatWithMetadata[]
    expressGiveaways: IListingExpressGiveaway[]
}

// This component initializes store with initial data like user
const StoreProvider = ({
    identity,
    searchedProfiles,
    globalChats,
    expressGiveaways,
}: StoreProviderProps) => {
    const store = useRef<IStore>()
    if (!store.current) {
        store.current = createStore({
            identity,
            searchedProfiles,
            globalChats,
            expressGiveaways,
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
