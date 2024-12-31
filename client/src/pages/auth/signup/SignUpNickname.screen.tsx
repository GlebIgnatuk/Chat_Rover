import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'

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
        } finally {
            setIsLoading(false)
        }
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div className="relative h-full bg-[#131313] font-vasek">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full transition-all text-primary-700">
                <div className="transition-all w-4/5 relative mx-auto p-4 rounded-md">
                    <div
                        className="text-4xl text-center font-bold text-primary-700 font-great-vibes"
                        style={{
                            textShadow: `0 0 7px #c9ac67,
                                    0 0 10px #c9ac67,
                                    0 0 31px #c9ac67,
                                    0 0 62px #c9ac67,
                                    0 0 102px #c9ac67`,
                        }}
                    >
                        {localize('auth__nickname__title')}
                    </div>
                    <div className="text-4xl text-primary-700 mt-6">
                        {localize('auth__nickname__text')}
                    </div>

                    <div className="relative mt-4">
                        <input
                            ref={inputRef}
                            placeholder=""
                            type="text"
                            className={cn(
                                'text-white w-full text-xl text-center bg-transparent outline-none border-b border-b-primary-700 font-exo2',
                                {
                                    'border-b-red-400 text-red-400': !isValidName,
                                },
                            )}
                            autoComplete=""
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button
                            onClick={createUser}
                            disabled={isLoading || name.trim().length === 0}
                            className="mt-6 mx-auto flex items-center justify-center w-36 h-12 rounded-xl text-primary-700 disabled:cursor-not-allowed disabled:text-stone-400"
                        >
                            {isLoading ? (
                                <FontAwesomeIcon
                                    icon={faCircleNotch}
                                    onClick={createUser}
                                    className="w-6 h-6 animate-spin font-semibold"
                                />
                            ) : (
                                <span className="text-5xl">{localize('general__continue')}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
