import { useAccount } from '@/context/account'
import { buildProtectedUrl } from '@/utils/url'
import { NavLink } from 'react-router-dom'

export const ProfilesScreen = () => {
    const { profiles, loading } = useAccount()

    if (loading.is) {
        return <div>Loading...</div>
    } else if (loading.is === false && loading.error) {
        return <div>Failed to load: {loading.error}</div>
    }

    return (
        <>
            <NavLink to={buildProtectedUrl('/')} className="p-2 bg-red-400 mb-2 block text-center">
                Back
            </NavLink>

            <div className="flex flex-col gap-3">
                {profiles.map((profile) => (
                    <NavLink
                        key={profile._id}
                        to={buildProtectedUrl(`/account/profiles/${profile._id}`)}
                        className="p-4 bg-[#FFFAE7] text-[#E79B46] font-semibold"
                    >
                        {profile.nickname} | {profile.server}
                    </NavLink>
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
