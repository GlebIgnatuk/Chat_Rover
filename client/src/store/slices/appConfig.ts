import { StateCreator } from 'zustand'
import { IAppConfigState } from '../state'
import * as R from 'ramda'
import { IAppConfig, IIntl } from '../types'

type IState = IAppConfigState

export const createAppConfigSlice =
    (
        config: IAppConfig,
        intls: Record<string, IIntl>,
    ): StateCreator<IState, [], [], IAppConfigState> =>
    (set) => ({
        appConfig: {
            config,

            intls,
            addIntl: (langugage, intl) => {
                set((state) => R.assocPath(['appConfig', 'intls', langugage], intl, state))
            },
        },
    })
