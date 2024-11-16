import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext, IIdentity } from './AuthContext'
import { clearTelegramData } from './auth'

interface Props {
    children: React.ReactNode
}

export const AuthContextProvider = ({ children }: Props) => {
    const [user] = useState(useLocation().state?.user as IIdentity | null)

    const logout = () => {
        clearTelegramData()
        // deinit tg context
        window.location.href = '/'
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
