import { buildUrl } from '@/utils/url'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { ReactNode } from 'react'

// export const ProtectedRoute = () => {
//     const auth = useAuth()

//     return auth.user ? <Outlet /> : <Navigate to={buildUrl('/auth/signin')} />
// }

interface Props {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
    const auth = useAuth()

    return auth.user ? children : <Navigate to={buildUrl('/auth/signin')} />
}
