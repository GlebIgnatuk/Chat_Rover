import { StateCreator } from 'zustand'
import { IAppConfigState } from '../state'
import * as R from 'ramda'

type IState = IAppConfigState

export const createAppConfigSlice: StateCreator<IState, [], [], IAppConfigState> = (set) => ({
    appConfig: {
        config: null,
        setConfig: (config) => {
            set((state) => R.assocPath(['appConfig', 'config'], config, state))
        },

        intls: {},
        addIntl: (langugage, intl) => {
            set((state) => R.assocPath(['appConfig', 'intls', langugage], intl, state))
        },
    },
})
