import { useAccount } from '@/context/account'
import { useStore } from '@/context/app/useStore'
import { ProfileCard } from '@/features/profiles/components/ProfileCard'
import { buildProtectedUrl } from '@/utils/url'
import { NavLink, useNavigate } from 'react-router-dom'

export const ProfilesScreen = () => {
    const navigate = useNavigate()
    const { profiles, loading } = useAccount()
    const user = useStore((state) => state.identity.user)

    if (loading.is) {
        return <div>Loading...</div>
    } else if (loading.is === false && loading.error) {
        return <div>Failed to load: {loading.error}</div>
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {profiles.map((profile) => (
                    <ProfileCard
                        key={profile._id}
                        profile={profile}
                        user={user}
                        onClick={() => {
                            navigate(buildProtectedUrl(`/account/profiles/${profile._id}`))
                        }}
                    />
                ))}
                <NavLink
                    to={buildProtectedUrl(`/account/profiles/new`)}
                    className="p-4 bg-[#FFFAE7] text-[#E79B46] font-semibold text-center"
                >
                    (+) Create
                </NavLink>
            </div>
        </>
    )
}
