import { HomeLayout } from '@/pages/home/Home.layout'
import { HomeScreen } from '@/pages/home/Home.screen'
import { buildUrl } from '@/utils/url'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AccountScreen } from './pages/account/Account.screen'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to={buildUrl('/')} />,
    },
    {
        path: buildUrl('/'),
        element: <HomeLayout />,
        children: [
            {
                path: '',
                element: <HomeScreen />,
            },
            {
                path: 'account',
                element: <AccountScreen />,
            },
        ],
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
