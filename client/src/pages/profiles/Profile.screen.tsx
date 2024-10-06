import { FormState, ProfileForm } from './ProfileForm'
import { useMemo } from 'react'
import { useAccount } from '@/context/account'
import { Navigate, useParams } from 'react-router-dom'

export const ProfileScreen = () => {
    const { id: profileId } = useParams()

    const { profiles } = useAccount()
    const profile = useMemo(() => profiles.find((p) => p._id === profileId), [profiles, profileId])

    const onSubmit = async (data: FormState) => {
        console.log(data)
    }

    return profile ? (
        <div className="h-full overflow-y-auto">
            <div className="py-2">
                <ProfileForm initialState={profile} onSubmit={onSubmit} />
            </div>
        </div>
    ) : (
        <Navigate to="/profiles" />
    )
}
