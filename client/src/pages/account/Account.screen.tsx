import { useUser } from '@/context/user/useUser'

export const AccountScreen = () => {
    const user = useUser()

    return (
        <div className="bg-slate-800 p-2">
            <p className="font-bold text-3xl">{user.username}</p>
            <p className="font-medium text-xl">
                {user.first_name} {user.last_name}
            </p>
        </div>
    )
}
