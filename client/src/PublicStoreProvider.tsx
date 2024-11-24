import { useRef } from 'react'
import { createPublicStore, IPublicStore } from './store/store'
import { InitializerContext } from './context/initializer/InitializerContext'
import { Navigate, Outlet } from 'react-router-dom'
import { useLocation } from './hooks/common/useLocation'
import { IAppConfig, IIntl, IWuwaCharacter } from './store/types'
import { buildPublicUrl } from './utils/url'

export const PublicStoreProvider = () => {
    const { state } = useLocation<{
        __splash?: {
            appConfig: IAppConfig
            wuwaCharacters: IWuwaCharacter[]
            intls: Record<string, IIntl>
            selectedLanguage: string
            fallbackLanguage: string
        }
    }>()

    const store = useRef<IPublicStore>()
    if (!store.current) {
        if (state && state.__splash) {
            store.current = createPublicStore(state.__splash)
        } else {
            return <Navigate to={buildPublicUrl('__splash')} replace />
        }
    }

    return (
        <InitializerContext.Provider
            value={{
                store: store.current,
            }}
        >
            <Outlet />
        </InitializerContext.Provider>
    )
}
