import { Reducer } from 'react'
import { IUser } from '../auth/AuthContext'

export type ILoading = { is: true } | { is: false; error: string | null }

export type IAction =
    | { type: '@profiles/set'; payload: IUser['user'][] }
    | { type: '@profiles/set_loading'; payload: ILoading }
    | { type: '@filters/toggle_language'; payload: string }

export type IState = {
    profiles: { items: IUser['user'][]; loading: ILoading }
    filters: {
        languages: { [lang: string]: boolean }
    }
}

export const initialState: IState = {
    profiles: { items: [], loading: { is: false, error: null } },
    filters: { languages: {} },
}

export const reducer: Reducer<IState, IAction> = (state, action) => {
    switch (action.type) {
        case '@profiles/set': {
            return { ...state, profiles: { ...state.profiles, items: action.payload } }
        }

        case '@filters/toggle_language': {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    languages: {
                        ...state.filters.languages,
                        [action.payload]: !state.filters.languages[action.payload],
                    },
                },
            }
        }

        default: {
            return state
        }
    }
}
