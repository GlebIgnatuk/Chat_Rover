import { useAuth } from '@/context/auth/useAuth'
import { useUser } from '@/context/auth/useUser'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const DebugPanel = () => {
    const user = useUser()
    const auth = useAuth()

    return (
        <div className="bg-[#131313] relative z-10 opacity-50 hover:opacity-100 transition-opacity shrink-0">
            <div className="flex items-center">
                <div className="text-sm text-white bg-amber-600 p-1 shrink-0 w-28 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.user.nickname}
                </div>

                <div className="text-sm text-black bg-white grow whitespace-nowrap overflow-hidden text-ellipsis p-1">
                    {location.pathname}
                </div>
            </div>

            <div className="flex justify-between p-2">
                <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="text-red-500 cursor-pointer"
                    title="Sign Out"
                    onClick={() => {
                        auth.logout()
                    }}
                />
            </div>
        </div>
    )
}
