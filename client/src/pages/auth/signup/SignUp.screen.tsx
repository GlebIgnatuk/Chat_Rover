// import loadingScreenImage from '@/assets/loading-screen.webp'
import { useAuth } from '@/context/auth/useAuth'

import { faPlay, faSpinner, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'

import scrollImage from '@/assets/scroll.png'
import handArrowImage from '@/assets/hand_arrow.png'
import signupImage from '@/assets/signup.webp'
import { cn } from 'tailwind-cn'

const getInitialUsername = () => {
    // @ts-expect-error add types
    const data = window.Telegram.WebApp.initData
    const params = new URLSearchParams(data)
    const user = params.get('user')

    const random = Math.floor(Math.random() * (9999 - 1000)) + 1000

    return user ? JSON.parse(user).username : `Rover${random}`
}

export const SignUpScreen = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [name, setName] = useState<string>(getInitialUsername())
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [isScrollOpen, setIsScrollOpen] = useState(false)

    const openScroll = () => {
        setTimeout(() => {
            setIsScrollOpen(true)
        }, 0)
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        openScroll()
    }, [])

    const auth = useAuth()

    const isValidName = name.length >= 1

    const createUser = async () => {
        try {
            setError('')
            setIsLoading(true)

            const response = await auth.signUp(name)
            if (response.success) {
                setIsScrollOpen(false)
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
        <div className="relative h-full">
            {/* <img
                src={loadingScreenImage}
                className="absolute top-0 left-0 w-full h-full object-cover object-bottom opacity-50"
            /> */}
            <img
                src={signupImage}
                className="absolute top-0 left-0 w-full h-full object-cover object-bottom animate-pulse-25-50"
            />

            <div
                className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[375px] transition-all font-tangerine text-black overflow-hidden',
                    {
                        'h-[550px] duration-1000': isScrollOpen,
                        'h-4 duration-150': !isScrollOpen,
                    },
                )}
            >
                <img
                    src={scrollImage}
                    className={cn('absolute w-full top-0 left-0 transition-all', {
                        'duration-300': !isScrollOpen,
                        'h-full duration-[0.89s]': isScrollOpen,
                    })}
                    // className="absolute w-full h-full top-0 left-0 transition-all"
                />

                <div
                    // className="transition-all h-full relative w-3/5 mx-auto pt-32 opacity-80 overflow-hidden"
                    className={cn(
                        'transition-all relative w-3/5 mx-auto pt-32 opacity-80 overflow-hidden',
                        {
                            'opacity-0 duration-100': !isScrollOpen,
                            'h-full opacity-100 duration-[1.3s]': isScrollOpen,
                        },
                    )}
                >
                    <div className="text-4xl text-center font-bold">Welcome, Rover</div>
                    <div className="text-2xl">
                        We'd like to see you in our world. Let's proceed with a quick setup. Please
                        write your name below...
                    </div>

                    <div className="relative mt-16">
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

                        <img
                            src={handArrowImage}
                            className="absolute top-[calc(100%+10px)] right-16 w-20 -scale-y-100 rotate-12 opacity-80"
                        />

                        {isLoading && isScrollOpen && (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="absolute right-[11px] bottom-[-93px] w-8 h-8 text-gray-700 cursor-pointer animate-spin"
                            />
                        )}
                        {!isLoading && isScrollOpen && (
                            <FontAwesomeIcon
                                icon={isValidName ? faPlay : faX}
                                onClick={createUser}
                                className={cn('absolute w-8 h-8 text-gray-700', {
                                    'right-[9px] bottom-[-93px] hover:animate-none cursor-pointer animate-pulse':
                                        isValidName,
                                    'right-[11px] bottom-[-93px] opacity-70': !isValidName,
                                })}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
