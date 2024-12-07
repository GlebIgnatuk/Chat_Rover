// import { FormState, ProfileForm } from './ProfileForm'
import { useMemo } from 'react'
import { useAccount } from '@/context/account'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { api } from '@/services/api'
import { buildProtectedUrl } from '@/utils/url'

export const ProfileScreen = () => {
    return null
    // const { id: profileId } = useParams()
    // const navigate = useNavigate()

    // const { profiles } = useAccount()
    // const profile = useMemo(() => profiles.find((p) => p._id === profileId), [profiles, profileId])

    // const onSubmit = async (data: FormState) => {
    //     console.log(data)
    //     const response = await api(`/profiles/${profileId}`, {
    //         method: 'PUT',
    //         body: JSON.stringify(data),
    //     })
    //     if (response.success) {
    //         navigate(buildProtectedUrl('/account/profiles'))
    //     }
    // }

    // if (!profile) return <Navigate to={buildProtectedUrl('/account/profiles')} />

    // const { _id, ...initialState } = profile
    // void _id

    // return (
    //     <div className="h-full overflow-y-auto">
    //         <div className="py-2">
    //             <ProfileForm initialState={initialState} onSubmit={onSubmit} />
    //         </div>
    //     </div>
    // )
}
