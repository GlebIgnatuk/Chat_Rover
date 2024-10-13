import { api } from '@/services/api'
import { FormState, ProfileForm } from './ProfileForm'

export const ProfileNewScreen = () => {
    const onSubmit = async (data: FormState) => {
        await api('/profiles', {
            method: 'post',
            body: JSON.stringify(data),
        })
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="py-2">
                <ProfileForm onSubmit={onSubmit} />
            </div>
        </div>
    )
}
