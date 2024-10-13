import { AuthLayout } from '@/pages/auth/Auth.layout'
import { SignInScreen } from '@/pages/auth/signin/SignIn.screen'
import { SignUpScreen } from '@/pages/auth/signup/SignUp.screen'
import { HomeLayout } from '@/pages/home/Home.layout'
import { buildUrl } from '@/utils/url'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/auth/AuthContextProvider'
import { ProtectedRoute } from './context/auth/ProtectedRoute'
import { ChatsScreen } from './pages/chats/Chats.screen'
import { ChatScreen } from './pages/chats/Chat.screen'
import { HomeScreen } from './pages/home/Home.screen'
import { ChatNewScreen } from './pages/chats/ChatNew.screen'
import { ProfilesScreen } from './pages/profiles/Profiles.screen'
import { ProfileScreen } from './pages/profiles/Profile.screen'
import { ProfilesContextProvider } from './context/profiles'
import { ChatContextProvider } from './context/chat'
import { AccountContextProvider } from './context/account'
import { CharactersContextProvider } from './context/characters/CharactersContextProvider'
import { ProfileNewScreen } from './pages/profiles/ProfileNew.screen'
import { AccountScreen } from './pages/account/Account.screen'

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
                element: (
                    <ProtectedRoute>
                        <ProfilesContextProvider>
                            <ChatContextProvider>
                                <CharactersContextProvider>
                                    <AccountContextProvider>
                                        <Outlet />
                                    </AccountContextProvider>
                                </CharactersContextProvider>
                            </ChatContextProvider>
                        </ProfilesContextProvider>
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: 'home',
                        element: <HomeLayout />,
                        children: [
                            {
                                path: '',
                                element: <HomeScreen />,
                            },
                            {
                                path: 'chats',
                                element: <ChatsScreen />,
                            },
                            {
                                path: 'account',
                                element: <AccountScreen />,
                            },
                            {
                                path: 'account/profiles',
                                element: <ProfilesScreen />,
                            },
                            {
                                path: 'account/profiles/new',
                                element: <ProfileNewScreen />,
                            },
                            {
                                path: 'account/profiles/:id',
                                element: <ProfileScreen />,
                            },
                        ],
                    },
                    {
                        path: 'chats',
                        element: <Outlet />,
                        children: [
                            {
                                path: 'new',
                                element: <ChatNewScreen />,
                            },
                            {
                                path: ':id',
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
