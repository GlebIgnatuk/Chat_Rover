import loadingScreenImage from '@/assets/loading-screen.jpg'
import { FAKE_PROFILES } from '@/config/config'

import { useAuth } from '@/context/auth/useAuth'
import { buildUrl } from '@/utils/url'
import { faCircleNotch, faHeartPulse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

export const SignInScreen = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const auth = useAuth()

    const signIn = async () => {
        try {
            setError('')
            setIsLoading(true)

            const response = await auth.signIn()
            if (!response.success) {
                setError(response.error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        signIn()
    }, [])

    if (isLoading) {
        return (
            <div className="pointer-events-none relative h-full flex justify-center items-center">
                <div className="z-10 flex flex-col gap-4 items-center">
                    <FontAwesomeIcon
                        icon={faCircleNotch}
                        className="w-20 h-20 animate-spin duration-1000"
                    />
                    <span className="text-lg">Connecting...</span>
                </div>
                <img
                    src={loadingScreenImage}
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom animate-pulse-25-50"
                />
            </div>
        )
    }

    if (error === 'NOT_FOUND') {
        return <Navigate to={buildUrl('/auth/signup')} replace />
    }

    if (error) {
        return (
            <div className="relative h-full flex justify-center items-center">
                <div className="z-10 flex flex-col gap-2 items-center">
                    <FontAwesomeIcon
                        icon={faHeartPulse}
                        className="w-20 h-20 animate-bounce duration-1000"
                    />
                    <span className="text-lg">Error: {error}</span>
                    <button
                        className="bg-primary-100 text-gray-700 font-medium px-4 py-2 rounded-md cursor-pointer active:bg-primary-100/90"
                        onClick={signIn}
                    >
                        Try again
                    </button>

                    {import.meta.env.VITE_ALLOW_FAKE_PROFILES === 'true' && (
                        <div className="grid grid-cols-2 gap-2">
                            {FAKE_PROFILES.map((p) => (
                                <a
                                    key={p.user.username}
                                    href={`/#tgWebAppData=${encodeURIComponent(p.encoded)}`}
                                    className="bg-slate-600 p-2 rounded-md cursor-pointer"
                                >
                                    {p.user.username}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <img
                    src={loadingScreenImage}
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom opacity-50"
                />
            </div>
        )
    }

    return null
}
