import { APIResponse } from '@/services/api'
import { createContext } from 'react'

export interface IUser {
    identity: {
        id: number
        username: string
        first_name?: string
        last_name?: string
        language_code: string
        is_premium: boolean
        allows_write_to_pm: boolean
    }
    user: {
        _id: string
        nickname: string
        avatarUrl: string | null
    }
}

export interface IAuthContext {
    user: IUser | null
    signIn: (signal?: AbortSignal) => Promise<APIResponse<IUser>>
    signUp: (nickname: string, signal?: AbortSignal) => Promise<APIResponse<IUser>>
    logout: () => void
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined)
