import { buildProtectedPath } from '@/config/path'
import { useAccount } from '@/context/account'
import { useStore } from '@/context/app/useStore'
import { ProfileCard } from '@/features/profiles/components/ProfileCard'
import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const ProfilesScreen = () => {
    const navigate = useNavigate()
    const { profiles, loading } = useAccount()
    const user = useStore((state) => state.identity.user)

    const canCreate = profiles.length < 1

    if (loading.is) {
        return <div>Loading...</div>
    } else if (loading.is === false && loading.error) {
        return <div>Failed to load: {loading.error}</div>
    }

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr)] px-1 pt-1">
            <NavLink
                to={buildProtectedPath(`/account/profiles/new`)}
                className={cn(
                    'p-2 rounded-xl bg-stone-800 text-primary-700 border border-primary-700 font-semibold text-center text-lg',
                    {
                        'text-gray-400 border-gray-400 cursor-not-allowed': !canCreate,
                    },
                )}
                onClick={(e) => {
                    if (!canCreate) e.preventDefault()
                }}
            >
                (+) Create
            </NavLink>

            <div className="overflow-auto py-1 space-y-1">
                {profiles.map((profile) => (
                    <ProfileCard
                        key={profile._id}
                        profile={profile}
                        user={user}
                        onClick={() => {
                            navigate(buildProtectedPath(`/account/profiles/${profile._id}`))
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
