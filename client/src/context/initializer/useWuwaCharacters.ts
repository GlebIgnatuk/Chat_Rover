import { useContext } from 'react'
import { useStore as _useStore } from 'zustand'
import { InitializerContext } from './InitializerContext'
import { IWuwaCharactersState } from '@/store/state'

export const useWuwaCharacters = <T>(
    selector: (state: IWuwaCharactersState['wuwaCharacters']) => T,
) => {
    const context = useContext(InitializerContext)

    if (!context) throw new Error('Missing InitializerContext.Provider in the tree')

    return _useStore(context.store, (state) => selector(state.wuwaCharacters))
}
