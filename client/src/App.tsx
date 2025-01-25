import { ErrorBoundary } from 'react-error-boundary'
import { AuthLayout } from '@/pages/auth/Auth.layout'
import { SignInScreen } from '@/pages/auth/signin/SignIn.screen'
import { SignUpNicknameScreen } from '@/pages/auth/signup/SignUpNickname.screen'
import { RootLayout } from '@/pages/Root.layout'
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
import { PublicStoreProvider } from './PublicStoreProvider'
import { PrivateStoreProvider } from './PrivateStoreProvider'
import { SplashScreen } from './pages/Splash.screen'
import { HomeLayout } from './pages/Home.layout'
import { UserScreen } from './pages/user/User.screen'
import { RenderedProfileScreen } from './pages/profiles/RenderedProfile.screen'
import { ErrorBoundaryScreen } from './pages/ErrorBoundary.screen'
import { GiveawayScreen } from './pages/giveaways/Giveaway.screen'
import { GiftsScreen } from './pages/gifts/Gifts.screen'
import { AdminScreen } from './pages/admin/Admin.screen'
import { AdminGiveawaysScreen } from './pages/admin/giveaways/AdminGiveaways.screen'
import {
    APP_ADMIN_PATH,
    APP_AUTH_PATH,
    APP_PATH,
    APP_PROTECTED_PATH,
    buildPublicPath,
} from './config/path'
import { AdminRoute } from './context/auth/AdminRoute'

const router = createBrowserRouter([
    {
        index: true,
        element: <SplashScreen />,
        errorElement: <ErrorBoundaryScreen />,
    },
    {
        path: APP_PATH,
        element: <PublicStoreProvider />,
        errorElement: <ErrorBoundaryScreen />,
        children: [
            {
                path: APP_AUTH_PATH,
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
                path: APP_PROTECTED_PATH,
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
                                        path: 'u/:userId',
                                        element: <UserScreen />,
                                    },
                                    {
                                        path: 'u/:userId/profiles/:profileId',
                                        element: <RenderedProfileScreen />,
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
                                    {
                                        path: 'giveaway',
                                        element: <GiveawayScreen />,
                                    },
                                    {
                                        path: 'gifts',
                                        element: <GiftsScreen />,
                                    },
                                    {
                                        path: APP_ADMIN_PATH,
                                        element: <AdminRoute />,
                                        children: [
                                            {
                                                path: '',
                                                element: <AdminScreen />,
                                            },
                                            {
                                                path: 'giveaways',
                                                element: <AdminGiveawaysScreen />,
                                            },
                                        ],
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
        element: <Navigate to={buildPublicPath('/')} replace />,
        errorElement: <ErrorBoundaryScreen />,
    },
])

function EntryPoint() {
    return (
        <ErrorBoundary fallbackRender={ErrorBoundaryScreen}>
            <RouterProvider router={router} />
        </ErrorBoundary>
    )
}

export default EntryPoint
