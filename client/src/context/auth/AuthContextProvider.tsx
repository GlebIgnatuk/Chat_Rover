import { api } from '@/services/api'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthContext, IAuthContext, IIdentity } from './AuthContext'

export const AuthContextProvider = () => {
    const [user, setUser] = useState<IIdentity | null>(null)

    const signIn = async (signal?: AbortSignal) => {
        const response = await api<IIdentity>('/users/me', { signal })
        if (response.success) {
            setUser(response.data)
        }

        return response
    }

    const signUp = async (nickname: string, signal?: AbortSignal) => {
        const response = await api<IIdentity>('/users', {
            method: 'POST',
            body: JSON.stringify({ nickname }),
            signal,
        })
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
