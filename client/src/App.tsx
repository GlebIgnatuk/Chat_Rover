import { AuthLayout } from '@/pages/auth/Auth.layout'
import { SignInScreen } from '@/pages/auth/signin/SignIn.screen'
import { SignUpNicknameScreen } from '@/pages/auth/signup/SignUpNickname.screen'
import { HomeLayout } from '@/pages/home/Home.layout'
import { buildAuthUrl, buildProtectedUrl, buildPublicUrl } from '@/utils/url'
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
import { AUTH_PATH_PREFIX, PATH_PREFIX, PROTECTED_PATH_PREFIX } from './config/config'

const router = createBrowserRouter([
    {
        path: PATH_PREFIX.substring(1),
        element: (
            <CharactersContextProvider>
                <Outlet />
            </CharactersContextProvider>
        ),
        children: [
            {
                path: '',
                element: <Navigate to={buildAuthUrl('/signin')} replace />,
            },
            {
                path: AUTH_PATH_PREFIX.substring(1),
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
                        path: PROTECTED_PATH_PREFIX.substring(1),
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
                                                to={buildProtectedUrl('/game_chat/global')}
                                                state={{ animate: false }}
                                            />
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'chats',
                                // element: <Outlet />,
                                children: [
                                    {
                                        path: '',
                                        element: <ChatsScreen />,
                                    },
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
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to={buildPublicUrl('/')} />,
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App
