import { buildUrl } from '@/utils/url'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export const ProtectedRoute = () => {
    const auth = useAuth()

    return auth.user ? <Outlet /> : <Navigate to={buildUrl('/auth/signin')} />
}
