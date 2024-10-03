import { FormState, ProfileForm } from './ProfileForm'

export const ProfileNewScreen = () => {
    const onSubmit = async (data: FormState) => {
        console.log(data)
    }

    return <ProfileForm onSubmit={onSubmit} />
}
