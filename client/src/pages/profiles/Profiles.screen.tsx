import { useAccount } from '@/context/account'
import { NavLink } from 'react-router-dom'

export const ProfilesScreen = () => {
    const { profiles, loading } = useAccount()

    if (loading.is) {
        return <div>Loading...</div>
    } else if (loading.is === false && loading.error) {
        return <div>Failed to load: {loading.error}</div>
    }

    return (
        <div className="flex flex-col gap-3">
            {profiles.map((profile) => (
                <NavLink
                    key={profile._id}
                    to={`/home/profiles/${profile._id}`}
                    className="p-4 bg-[#FFFAE7] text-[#E79B46] font-semibold"
                >
                    {profile.nickname} | {profile.server}
                </NavLink>
            ))}
        </div>
    )
}
