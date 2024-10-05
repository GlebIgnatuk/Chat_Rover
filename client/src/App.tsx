// import { AccountScreen } from '@/pages/account/Account.screen'
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
import { CharactersScreen } from './pages/characters/Characters.screen'
import { ProfileNewScreen } from './pages/profiles/ProfileNew.screen'

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
                                path: 'characters',
                                element: <CharactersScreen />,
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
                    {
                        path: 'account',
                        element: <Outlet />,
                        children: [
                            {
                                path: 'profiles',
                                element: <ProfilesScreen />,
                            },
                            {
                                path: 'profiles/new',
                                element: <ProfileNewScreen />,
                            },
                            {
                                path: 'profiles/:id',
                                element: <ProfileScreen />,
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
