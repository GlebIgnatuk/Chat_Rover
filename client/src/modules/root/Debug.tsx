import { useStore } from '@/context/app/useStore'
import { clearTelegramData } from '@/context/auth/auth'
import { buildPublicUrl } from '@/utils/url'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useNavigate } from 'react-router-dom'

export const DebugPanel = () => {
    const user = useStore((state) => state.identity.user)
    const navigate = useNavigate()
    const location = useLocation()

    const onUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            const value = e.currentTarget.value
            navigate(buildPublicUrl(value))
        }
    }

    return (
        <div className="bg-[#131313] relative z-10 opacity-50 hover:opacity-100 transition-opacity shrink-0">
            <div className="flex items-center">
                <div className="text-sm text-white bg-amber-600 p-1 shrink-0 w-28 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.nickname}
                </div>

                <input
                    key={location.pathname}
                    defaultValue={location.pathname}
                    type="text"
                    onKeyDown={onUrlKeyDown}
                    className="text-sm text-black bg-white grow p-1"
                    list="routes"
                />
            </div>

            <div className="flex justify-between p-2">
                <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="text-red-500 cursor-pointer"
                    title="Sign Out"
                    onClick={() => {
                        clearTelegramData()
                        window.location.href = '/'
                    }}
                />
            </div>
        </div>
    )
}
