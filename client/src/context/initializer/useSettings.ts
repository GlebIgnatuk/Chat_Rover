import { useContext } from 'react'
import { useStore as _useStore } from 'zustand'
import { InitializerContext } from './InitializerContext'

export const useSettings = () => {
    const context = useContext(InitializerContext)

    if (!context) throw new Error('Missing InitializerContext.Provider in the tree')

    return _useStore(context.store, (state) => state.settings)
}
