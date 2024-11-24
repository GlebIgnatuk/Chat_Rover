import { StateCreator } from 'zustand'
import { IAppConfigState, ISettingsState } from '../state'
import * as R from 'ramda'

type IState = ISettingsState & IAppConfigState

export const createSettingsSlice =
    (language: string, fallbackLanguage?: string): StateCreator<IState, [], [], ISettingsState> =>
    (set) => ({
        settings: {
            language,
            fallbackLanguage: fallbackLanguage ?? null,
            setLanguage: (language, fallbackLanguage) => {
                set((state) => {
                    const intls = state.appConfig.intls
                    if (language in intls === false) return state
                    if (fallbackLanguage && fallbackLanguage in intls === false) return state

                    let updated = R.assocPath(['settings', 'language'], language, state)

                    if (fallbackLanguage) {
                        updated = R.assocPath(
                            ['settings', 'fallbackLanguage'],
                            fallbackLanguage,
                            updated,
                        )
                    }

                    return updated
                })
            },
        },
    })
