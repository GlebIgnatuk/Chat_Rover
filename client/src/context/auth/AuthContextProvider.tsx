import { api } from '@/services/api'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthContext, IAuthContext, IUser } from './AuthContext'

export const AuthContextProvider = () => {
    const [user, setUser] = useState<IUser | null>(null)

    const signIn = async () => {
        const response = await api<IUser>('/users/me')
        if (response.success) {
            setUser(response.data)
        }

        return response
    }

    const signUp = async (displayName: string) => {
        const response = await api<IUser>('/users', { method: 'POST', body: JSON.stringify({ displayName }) })
        if (response.success) {
            setUser(response.data)
        }

        return response
    }

    const logout = () => {
        setUser(null)
    }

    const context: IAuthContext = {
        user,
        signIn,
        signUp,
        logout,
    }

    return (
        <AuthContext.Provider value={context}>
            <Outlet />
        </AuthContext.Provider>
    )
}
