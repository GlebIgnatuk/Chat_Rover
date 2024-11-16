import signupImage from '@/assets/signup.webp'
import { FAKE_PROFILES, generateFakeProfile } from '@/config/config'

import { buildAuthUrl, buildProtectedUrl, buildPublicUrl } from '@/utils/url'
import { faCircleNotch, faHeartPulse } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { inferProfileState } from '../../../context/auth/auth'
import { api } from '@/services/api'
import { IIdentity } from '@/context/auth/AuthContext'

export const SignInScreen = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const signIn = async (signal?: AbortSignal) => {
        try {
            setError('')
            setIsLoading(true)

            const response = await api<IIdentity>('/users/me', { signal })
            setIsLoading(false)

            if (response.success) {
                const identity = response.data
                const state = inferProfileState(response.data)

                switch (state) {
                    case 'complete':
                        {
                            navigate(buildProtectedUrl('/'), {
                                replace: true,
                                state: { user: identity },
                            })
                        }
                        break

                    case 'created':
                        {
                            navigate(buildAuthUrl('/signup/profile'), {
                                replace: true,
                                state: { user: identity },
                            })
                        }
                        break

                    default: {
                        throw new Error(`Invalid state "${state}"`)
                    }
                }
            } else {
                if (response.error === 'NOT_FOUND') {
                    navigate(buildAuthUrl('/signup/nickname'), { replace: true })
                } else {
                    setError(response.error)
                }
            }
        } catch (e) {
            if (e instanceof Error && e.name !== 'AbortError') {
                setError('Something went wrong')
            }

            setIsLoading(false)
        }
    }

    useEffect(() => {
        const abortController = new AbortController()
        signIn(abortController.signal)

        return () => {
            abortController.abort()
        }
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
                    src={signupImage}
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom animate-pulse-25-50"
                />
            </div>
        )
    }

    const random = generateFakeProfile({})

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
                        onClick={() => signIn()}
                    >
                        Try again
                    </button>

                    {import.meta.env.VITE_ALLOW_FAKE_PROFILES === 'true' && (
                        <div className="grid grid-cols-2 gap-2">
                            {FAKE_PROFILES.map((p, idx) => (
                                <a
                                    key={p.profile.username}
                                    href={buildPublicUrl(
                                        `/#tgWebAppData=${encodeURIComponent(p.encoded)}`,
                                    )}
                                    className="p-2 rounded-md cursor-pointer"
                                    style={{
                                        backgroundColor: `hsl(${(idx / FAKE_PROFILES.length) * 360}deg, 60%, 50%)`,
                                    }}
                                >
                                    {p.profile.id}. {p.profile.first_name} {p.profile.last_name}
                                </a>
                            ))}

                            <a
                                href={buildPublicUrl(
                                    `/#tgWebAppData=${encodeURIComponent(random.encoded)}`,
                                )}
                                className="p-2 rounded-md cursor-pointer bg-black text-white col-span-2"
                            >
                                {random.profile.first_name} {random.profile.last_name} (random)
                            </a>
                        </div>
                    )}
                </div>
                <img
                    src={signupImage}
                    className="absolute top-0 left-0 w-full h-full object-cover object-bottom opacity-50"
                />
            </div>
        )
    }

    return null
}
