import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { ProfileCard } from '@/features/profiles/components/ProfileCard'
import { useBatchedLoader } from '@/hooks/common/useBatchedLoader'
import { api } from '@/services/api'
import { IPublicUser, ISearchedProfile } from '@/store/types'
import { buildProtectedUrl } from '@/utils/url'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from 'react-router-dom'

export const UserScreen = () => {
    const { userId } = useParams()
    const navigate = useNavigate()

    const search = async () => {
        try {
            const response = await api<ISearchedProfile[]>(`/profiles?userId=${userId}&limit=3`)
            if (response.success) {
                return response.data
            } else {
                return []
            }
        } catch (e) {
            return []
        }
    }

    const getUser = async () => {
        const response = await api<IPublicUser>(`/users/${userId}`)
        if (response.success) {
            return response.data
        } else {
            throw new Error(response.error)
        }
    }

    const loader = useBatchedLoader({
        failFast: true,
        onCancel: () => {},
        values: [() => search(), () => getUser()],
    })

    if (!loader.data) {
        return (
            <div className="flex justify-center items-center h-full">
                <CircularLoaderIndicator size="xl" />
            </div>
        )
    }

    try {
        const [profiles, user] = loader.$unwrap()

        return (
            <div className="h-full p-1 gap-2 grid grid-rows-[max-content,minmax(0,1fr)] overflow-hidden">
                <div className="bg-stone-800/80 border border-primary-700 grid grid-cols-[80px,minmax(0,1fr),80px] rounded-xl py-4">
                    <div></div>
                    <div className="flex flex-col items-center gap-4">
                        <AccountAvatar size="20xl" url={user.avatarUrl} nickname={user.nickname} />
                        <div className="text-primary-700 text-xl font-semibold">
                            {user.nickname}
                        </div>
                    </div>
                    <div className="flex flex-col items-end pr-3">
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className="w-8 h-8 text-primary-700 cursor-pointer"
                            onClick={() =>
                                navigate(buildProtectedUrl(`/chats/new?peerId=${user._id}`))
                            }
                        />
                    </div>
                </div>

                <div className="overflow-y-auto p-1 shadow-inner space-y-2">
                    {profiles.map(({ user, ...profile }) => (
                        <ProfileCard
                            key={profile._id}
                            user={user}
                            profile={profile}
                            onClick={() =>
                                navigate(
                                    buildProtectedUrl(`/u/${user._id}/profiles/${profile._id}`),
                                )
                            }
                        />
                    ))}
                </div>
            </div>
        )
    } catch (e) {
        return <div className="flex justify-center items-center h-full">{(e as Error).message}</div>
    }
}
