import { IIdentity } from '@/context/auth/AuthContext'
import { FormState, ProfileForm } from '@/pages/profiles/ProfileForm'
import { api } from '@/services/api'
import { buildUrl } from '@/utils/url'
import { useNavigate } from 'react-router-dom'

export const SignUpProfileScreen = () => {
    const navigate = useNavigate()

    const onSubmit = async (data: FormState) => {
        const response = await api('/profiles', {
            method: 'post',
            body: JSON.stringify(data),
        })

        if (response.success) {
            const response = await api<IIdentity>('/users/me')
            if (response.success) {
                navigate(buildUrl('/home'), { replace: true, state: { user: response.data } })
            } else {
                console.error(response.error)
            }
        } else {
            console.error(response.error)
        }
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="py-2">
                <ProfileForm onSubmit={onSubmit} />
            </div>
        </div>
    )
}
