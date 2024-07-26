import { useUser } from '@/context/user/useUser'

export const AccountScreen = () => {
    const user = useUser()

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-slate-800/10 backdrop-blur-sm p-2">
            <p className="font-bold text-3xl">{user.username}</p>
            <p className="font-medium text-xl">
                {user.first_name} {user.last_name}
            </p>
        </div>
    )
}
