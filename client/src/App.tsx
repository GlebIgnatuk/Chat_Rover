import { AuthLayout } from '@/pages/auth/Auth.layout'
import { SignInScreen } from '@/pages/auth/signin/SignIn.screen'
import { SignUpNicknameScreen } from '@/pages/auth/signup/SignUpNickname.screen'
import { HomeLayout } from '@/pages/home/Home.layout'
import { buildUrl } from '@/utils/url'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/auth/AuthContextProvider'
import { ChatsScreen } from './pages/chats/Chats.screen'
import { ChatScreen } from './pages/chats/Chat.screen'
import { HomeScreen } from './pages/home/Home.screen'
import { ChatNewScreen } from './pages/chats/ChatNew.screen'
import { ProfilesScreen } from './pages/profiles/Profiles.screen'
import { ProfileScreen } from './pages/profiles/Profile.screen'
import { ProfilesContextProvider } from './context/profiles'
import { AccountContextProvider } from './context/account'
import { CharactersContextProvider } from './context/characters/CharactersContextProvider'
import { ProfileNewScreen } from './pages/profiles/ProfileNew.screen'
import { AccountScreen } from './pages/account/Account.screen'
import { OnlineContextProvider } from './context/online/OnlineContextProvider'
import { AppAuthenticated } from './AppAuthenticated'
import { GameChatScreen } from './pages/game_chat/GameChat.screen'
import { GlobalChatScreen } from './pages/game_chat/GlobalChat.screen'
import { RegionalChatScreen } from './pages/game_chat/RegionalChat.screen'
import { SignUpProfileScreen } from './pages/auth/signup/SignUpProfile.screen'
import { ProfileStateRoute } from './context/auth/ProfileStateRoute'
import { ProtectedRoute } from './context/auth/ProtectedRoute'

const router = createBrowserRouter([
    {
        path: buildUrl('/'),
        element: (
            <CharactersContextProvider>
                <Outlet />
            </CharactersContextProvider>
        ),
        children: [
            {
                path: '',
                element: <Navigate to={buildUrl('/auth/signin')} replace />,
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'signin',
                        element: (
                            <ProfileStateRoute state="unauthenticated">
                                <SignInScreen />
                            </ProfileStateRoute>
                        ),
                    },
                    {
                        path: 'signup/nickname',
                        element: (
                            <ProfileStateRoute state="unauthenticated">
                                <SignUpNicknameScreen />
                            </ProfileStateRoute>
                        ),
                    },
                    {
                        path: 'signup/profile',
                        element: (
                            <ProfileStateRoute state="created">
                                <SignUpProfileScreen />
                            </ProfileStateRoute>
                        ),
                    },
                ],
            },
            {
                path: '*',
                element: (
                    <AuthContextProvider>
                        <ProtectedRoute>
                            <OnlineContextProvider>
                                <ProfilesContextProvider>
                                    <AccountContextProvider>
                                        <AppAuthenticated />
                                    </AccountContextProvider>
                                </ProfilesContextProvider>
                            </OnlineContextProvider>
                        </ProtectedRoute>
                    </AuthContextProvider>
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
                                path: 'game_chat',
                                element: <GameChatScreen />,
                                children: [
                                    {
                                        path: 'global',
                                        element: <GlobalChatScreen />,
                                    },
                                    {
                                        path: 'regional',
                                        element: <RegionalChatScreen />,
                                    },
                                    {
                                        path: '*',
                                        element: (
                                            <Navigate
                                                to="/home/game_chat/global"
                                                state={{ animate: false }}
                                            />
                                        ),
                                    },
                                ],
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
