import { Navigate, Outlet } from 'react-router-dom'
import { buildAppPath } from '@/config/path'
import { useStore } from '@/context/app/useStore'

export const AdminRoute = () => {
    const user = useStore((state) => state.identity.user)

    return user.role === 'admin' ? <Outlet /> : <Navigate to={buildAppPath('/')} />
}
