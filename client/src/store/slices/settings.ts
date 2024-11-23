import { StateCreator } from 'zustand'
import { IAppConfigState, ISettingsState } from '../state'
import * as R from 'ramda'

type IState = ISettingsState & IAppConfigState

export const createSettingsSlice: StateCreator<IState, [], [], ISettingsState> = (set) => ({
    settings: {
        language: null,
        intl: null,
        fallbackIntl: null,
        setIntl: (language, fallbackLanguage) => {
            set((state) => {
                const intls = state.appConfig.intls
                if (!intls) return state
                if (language in intls === false) return state
                if (fallbackLanguage && fallbackLanguage in intls === false) return state

                const intl = intls[language]
                let updated = R.assocPath(['settings', 'intl'], intl, state)

                if (fallbackLanguage) {
                    const intl = intls[fallbackLanguage]
                    updated = R.assocPath(['settings', 'fallbackIntl'], intl, updated)
                }

                return R.assocPath(['settings', 'language'], language, updated)
            })
        },
    },
})
