import { useRef } from 'react'
import { createPublicStore, IPublicStore } from './store/store'
import { InitializerContext } from './context/initializer/InitializerContext'
import { CharactersContextProvider } from './context/characters'
import { Outlet } from 'react-router-dom'

export const PublicStoreProvider = () => {
    const store = useRef<IPublicStore>()
    if (!store.current) {
        store.current = createPublicStore()
    }

    return (
        <InitializerContext.Provider
            value={{
                store: store.current,
            }}
        >
            <CharactersContextProvider>
                <Outlet />
            </CharactersContextProvider>
        </InitializerContext.Provider>
    )
}
