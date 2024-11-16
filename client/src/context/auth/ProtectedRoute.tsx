import { ReactNode, useEffect } from 'react'
import { inferProfileState } from './auth'
import { useAuth } from './useAuth'

interface Props {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
    const { user, logout } = useAuth()
    const state = inferProfileState(user)

    useEffect(() => {
        if (state === 'complete') return

        logout()
    }, [state])

    return state === 'complete' ? children : null
}
