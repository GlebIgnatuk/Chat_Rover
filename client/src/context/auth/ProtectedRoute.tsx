import { buildUrl } from '@/utils/url'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { ReactNode, useEffect } from 'react'
import { api } from '@/services/api'

// export const ProtectedRoute = () => {
//     const auth = useAuth()

//     return auth.user ? <Outlet /> : <Navigate to={buildUrl('/auth/signin')} />
// }

interface Props {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
    const auth = useAuth()

    // @todo move to another place
    useEffect(() => {
        api('/me/activities', { method: 'post' })

        const intervalId = setInterval(() => {
            api('/me/activities', { method: 'post' })
        }, 60 * 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    return auth.user ? children : <Navigate to={buildUrl('/auth/signin')} />
}
