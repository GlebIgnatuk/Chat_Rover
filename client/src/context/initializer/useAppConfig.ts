import { useContext } from 'react'
import { useStore as _useStore } from 'zustand'
import { InitializerContext } from './InitializerContext'
import { IAppConfigState } from '@/store/state'

export const useAppConfig = <T>(selector: (state: IAppConfigState['appConfig']) => T) => {
    const context = useContext(InitializerContext)

    if (!context) throw new Error('Missing InitializerContext.Provider in the tree')

    return _useStore(context.store, (state) => selector(state.appConfig))
}
