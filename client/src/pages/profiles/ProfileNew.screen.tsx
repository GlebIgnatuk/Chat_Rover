import { api } from '@/services/api'
// import { FormState, ProfileForm } from './ProfileForm'
import { useNavigate } from 'react-router-dom'
import { buildProtectedUrl } from '@/utils/url'

export const ProfileNewScreen = () => {
    const navigate = useNavigate()
    return null
    // const onSubmit = async (data: FormState) => {
    //     const response = await api('/profiles', {
    //         method: 'post',
    //         body: JSON.stringify(data),
    //     })

    //     if (response.success) {
    //         navigate(buildProtectedUrl('/account/profiles'), { replace: true })
    //     }
    // }

    // return (
    //     <div className="h-full overflow-y-auto">
    //         <div className="py-2">
    //             <ProfileForm onSubmit={onSubmit} />
    //         </div>
    //     </div>
    // )
}
