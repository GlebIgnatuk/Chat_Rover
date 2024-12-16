import { AuthLayout } from '@/pages/auth/Auth.layout'
import { SignInScreen } from '@/pages/auth/signin/SignIn.screen'
import { SignUpNicknameScreen } from '@/pages/auth/signup/SignUpNickname.screen'
import { RootLayout } from '@/pages/Root.layout'
import { buildPublicUrl } from '@/utils/url'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ChatsScreen } from './pages/chats/Chats.screen'
import { ChatScreen } from './pages/chats/Chat.screen'
import { CommunityScreen } from './pages/community/Community.screen'
import { ChatNewScreen } from './pages/chats/ChatNew.screen'
import { ProfilesScreen } from './pages/profiles/Profiles.screen'
import { ProfileScreen } from './pages/profiles/Profile.screen'
import { ProfileNewScreen } from './pages/profiles/ProfileNew.screen'
import { AccountScreen } from './pages/account/Account.screen'
import { GameChatScreen } from './pages/game_chat/GameChat.screen'
import { GlobalChatScreen } from './pages/game_chat/GlobalChat.screen'
import { RegionalChatScreen } from './pages/game_chat/RegionalChat.screen'
import { SignUpProfileScreen } from './pages/auth/signup/SignUpProfile.screen'
import { ProfileStateRoute } from './context/auth/ProfileStateRoute'
import { AUTH_PATH_PREFIX, PATH_PREFIX, PROTECTED_PATH_PREFIX } from './config/config'
import { PublicStoreProvider } from './PublicStoreProvider'
import { PrivateStoreProvider } from './PrivateStoreProvider'
import { SplashScreen } from './pages/Splash.screen'
import { HomeLayout } from './pages/Home.layout'

const router = createBrowserRouter([
    {
        index: true,
        element: <SplashScreen />,
    },
    {
        path: PATH_PREFIX.substring(1),
        element: <PublicStoreProvider />,
        children: [
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
                path: PROTECTED_PATH_PREFIX.substring(1),
                element: <PrivateStoreProvider />,
                children: [
                    {
                        element: <RootLayout />,
                        children: [
                            {
                                path: 'chats',
                                children: [
                                    {
                                        path: ':id',
                                        element: <ChatScreen />,
                                    },
                                ],
                            },
                            {
                                path: 'game_chat',
                                children: [
                                    {
                                        path: 'global',
                                        element: <GlobalChatScreen />,
                                    },
                                    {
                                        path: ':region',
                                        element: <RegionalChatScreen />,
                                    },
                                ],
                            },
                            {
                                path: '',
                                element: <HomeLayout />,
                                children: [
                                    {
                                        path: '',
                                        element: <CommunityScreen />,
                                    },
                                    {
                                        path: 'game_chat',
                                        index: true,
                                        element: <GameChatScreen />,
                                    },
                                    {
                                        path: 'chats',
                                        children: [
                                            {
                                                path: '',
                                                element: <ChatsScreen />,
                                            },
                                            {
                                                path: 'new',
                                                element: <ChatNewScreen />,
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
        ],
    },
    {
        path: '*',
        element: <Navigate to={buildPublicUrl('/')} replace />,
    },
])

function EntryPoint() {
    return <RouterProvider router={router} />
}

export default EntryPoint
