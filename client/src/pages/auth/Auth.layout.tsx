import { useAuth } from '@/context/auth/useAuth'
import { buildUrl } from '@/utils/url'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthLayout = () => {
    const { user } = useAuth()

    return user ? <Navigate to={buildUrl('/home')} /> : <Outlet />
}
