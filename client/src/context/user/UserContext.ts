import { createContext } from 'react'

export interface IUser {
    id: number
    username: string
    first_name?: string
    last_name?: string
    language_code: string
    is_premium: boolean
    allows_write_to_pm: boolean
}

export interface IUserContext {
    user: IUser
}

export const UserContext = createContext<IUserContext | undefined>(undefined)
