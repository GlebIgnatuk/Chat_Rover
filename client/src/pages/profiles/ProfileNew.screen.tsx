import { NavLink } from 'react-router-dom'
import { FormState, ProfileForm } from './ProfileForm'

export const ProfileNewScreen = () => {
    const onSubmit = async (data: FormState) => {
        console.log(data)
    }

    return (
        <>
            <NavLink to="/account/profiles" className="bg-red-400 p-2 block mb-2">
                Back
            </NavLink>
            <ProfileForm onSubmit={onSubmit} />
        </>
    )
}
