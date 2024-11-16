import { IUser } from '@/store/types'
import { createContext } from 'react'

export interface IIdentity {
    identity: {
        id: number
        username: string
        first_name?: string
        last_name?: string
        language_code: string
        is_premium: boolean
        allows_write_to_pm: boolean
    }
    user: IUser
}

export interface IAuthContext {
    user: IIdentity | null
    logout: () => void
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined)
