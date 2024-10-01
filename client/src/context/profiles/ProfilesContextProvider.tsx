import { ReactNode, useReducer } from 'react'
import { IProfilesContext, ProfilesContext } from './ProfilesContext'
import { initialState, reducer } from './reducer'
import { api } from '@/services/api'
import { IUser } from '../auth/AuthContext'

interface Props {
    children: ReactNode
}

export const ProfilesContextProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(reducer, null, () => initialState)

    const searchProfiles = async (signal?: AbortSignal) => {
        try {
            dispatch({ type: '@profiles/set_loading', payload: { is: true } })
            const response = await api<IUser['user'][]>('/users?', { signal })
            if (response.success) {
                dispatch({ type: '@profiles/set', payload: response.data })
                dispatch({ type: '@profiles/set_loading', payload: { is: false, error: null } })
            } else {
                dispatch({
                    type: '@profiles/set_loading',
                    payload: { is: false, error: response.error },
                })
            }
        } catch (e) {
            console.error(e)
            dispatch({
                type: '@profiles/set_loading',
                payload: { is: false, error: 'Something went wrong' },
            })
        }
    }

    const toggleLanguage = (language: string) => {
        dispatch({ type: '@filters/toggle_language', payload: language })
    }

    const context: IProfilesContext = {
        state,
        toggleLanguage,
        searchProfiles,
    }

    return <ProfilesContext.Provider value={context}>{children}</ProfilesContext.Provider>
}
