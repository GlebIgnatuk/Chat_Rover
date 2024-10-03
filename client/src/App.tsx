// import { AccountScreen } from '@/pages/account/Account.screen'
import { AuthLayout } from '@/pages/auth/Auth.layout'
import { SignInScreen } from '@/pages/auth/signin/SignIn.screen'
import { SignUpScreen } from '@/pages/auth/signup/SignUp.screen'
import { HomeLayout } from '@/pages/home/Home.layout'
import { buildUrl } from '@/utils/url'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/auth/AuthContextProvider'
import { ProtectedRoute } from './context/auth/ProtectedRoute'
import { ChatsScreen } from './pages/chats/Chats.screen'
import { ChatScreen } from './pages/chats/Chat.screen'
import { HomeScreen } from './pages/home/Home.screen'
import { ChatNewScreen } from './pages/chats/ChatNew.screen'
import { ProfilesScreen } from './pages/profiles/Profiles.screen'
import { ProfileScreen } from './pages/profiles/Profile.screen'

const router = createBrowserRouter([
    {
        path: buildUrl('/'),
        element: <AuthContextProvider />,
        children: [
            {
                path: '',
                element: <Navigate to={buildUrl('/auth/signin')} />,
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'signin',
                        element: <SignInScreen />,
                    },
                    {
                        path: 'signup',
                        element: <SignUpScreen />,
                    },
                ],
            },
            {
                path: '*',
                element: <ProtectedRoute />,
                children: [
                    {
                        path: 'home',
                        element: <HomeLayout />,
                        children: [
                            {
                                path: '',
                                element: <HomeScreen />,
                            },
                            // {
                            //     path: 'account',
                            //     element: <AccountScreen />,
                            // },
                            {
                                path: 'profiles',
                                element: <ProfilesScreen />,
                            },
                            {
                                path: 'profiles/:id',
                                element: <ProfileScreen />,
                            },
                            {
                                path: 'chats',
                                element: <ChatsScreen />,
                            },
                            {
                                path: 'chats/new',
                                element: <ChatNewScreen />,
                            },
                            {
                                path: 'chats/:id',
                                element: <ChatScreen />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to={buildUrl('/')} />,
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
