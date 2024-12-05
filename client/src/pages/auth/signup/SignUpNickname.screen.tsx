import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'

import backgroundImage from '@/assets/auth.jpeg'
import { cn } from 'tailwind-cn'
import { useNavigate } from 'react-router-dom'
import { buildAuthUrl } from '@/utils/url'
import { api } from '@/services/api'
import { IIdentity } from '@/context/auth/AuthContext'
import { useLocalize } from '@/hooks/intl/useLocalize'

const getInitialUsername = () => {
    // @ts-expect-error add types
    const data = window.Telegram.WebApp.initData
    const params = new URLSearchParams(data)
    const user = params.get('user')

    const random = Math.floor(Math.random() * (9999 - 1000)) + 1000

    return user ? JSON.parse(user).username : `Rover${random}`
}

export const SignUpNicknameScreen = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [name, setName] = useState<string>(getInitialUsername())
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const localize = useLocalize()

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const isValidName = name.length >= 1

    const createUser = async () => {
        try {
            setError('')
            setIsLoading(true)

            const response = await api<IIdentity>('/users', {
                method: 'POST',
                body: JSON.stringify({ nickname: name }),
                signal: undefined,
            })

            if (response.success) {
                navigate(buildAuthUrl('/signup/profile'), {
                    replace: true,
                    state: { user: response.data },
                })
            } else {
                setError(response.error)
            }
            // await new Promise((res) => setTimeout(res, 2100))
            // setIsScrollOpen(false)
        } finally {
            setIsLoading(false)
        }
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="relative h-full font-vasek">
            <img
                src={backgroundImage}
                className="absolute top-0 left-0 w-full h-full object-cover object-bottom"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full transition-all text-black">
                <div className="transition-all w-4/5 relative mx-auto opacity-80 bg-white/50 p-4 rounded-md shadow-[0px_0px_8px_2px_rgba(255,255,255,0.3)] before:absolute before:inset-0 before:border before:border-white/70 before:rotate-12 before:rounded-md before:pointer-events-none">
                    <div className="text-4xl text-center font-bold">
                        {localize('auth__nickname__title')}
                    </div>
                    <div className="text-3xl">{localize('auth__nickname__text')}</div>

                    <div className="relative mt-4">
                        <input
                            ref={inputRef}
                            placeholder=""
                            type="text"
                            className={cn(
                                'text-gray-700 w-full text-3xl text-center bg-transparent outline-none border-b border-b-black',
                                {
                                    'border-b-red-700 text-red-700': !isValidName,
                                },
                            )}
                            autoComplete=""
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button
                            onClick={createUser}
                            disabled={isLoading}
                            className="mt-2 mx-auto flex items-center justify-center bg-black w-36 h-12 rounded-xl disabled:cursor-not-allowed disabled:bg-gray-500"
                        >
                            {isLoading ? (
                                <FontAwesomeIcon
                                    icon={faCircleNotch}
                                    onClick={createUser}
                                    className="w-6 h-6 animate-spin text-white font-semibold"
                                />
                            ) : (
                                <span className="text-3xl text-white">
                                    {localize('general__continue')}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
