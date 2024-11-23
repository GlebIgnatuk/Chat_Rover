import { useContext } from 'react'
import { AppContext } from './AppContext'
import { IState } from '@/store/state'
import { useStore as _useStore } from 'zustand'

export const useStore = <T>(selector: (state: IState) => T) => {
    const context = useContext(AppContext)

    if (!context) throw new Error('Missing AppContext.Provider in the tree')

    return _useStore(context.store, selector)
}
