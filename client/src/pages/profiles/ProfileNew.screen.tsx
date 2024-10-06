import { FormState, ProfileForm } from './ProfileForm'

export const ProfileNewScreen = () => {
    const onSubmit = async (data: FormState) => {
        console.log(data)
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="py-2">
                <ProfileForm onSubmit={onSubmit} />
            </div>
        </div>
    )
}
