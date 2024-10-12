// import { FormState, ProfileForm } from './ProfileForm'
import { ScrollableNumericInput } from './ScrollableNumericInput'

export const ProfileNewScreen = () => {
    // const onSubmit = async (data: FormState) => {
    //     console.log(data)
    // }

    return (
        <div className="h-full overflow-y-auto">
            <div className="py-2">
                {/* <ProfileForm onSubmit={onSubmit} /> */}
                <ScrollableNumericInput min={0} max={90} step={1} />
            </div>
        </div>
    )
}
