import loadingScreenImage from '@/assets/loading-screen.webp'
import { useAuth } from '@/context/auth/useAuth'

import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export const SignUpScreen = () => {
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const auth = useAuth()

    const createUser = async () => {
        try {
            setError('')
            setIsLoading(true)

            const response = await auth.signUp(name)
            if (!response.success) {
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
        <div className="relative h-full flex justify-center pt-32">
            <div className="z-10 flex flex-col gap-20 items-stretch">
                <p className="text-4xl font-medium">Welcome, Rover!</p>
                <div>
                    <p className="text-lg font-medium self-start">How should I call you?</p>
                    <input
                        placeholder="Name"
                        type="text"
                        className="text-gray-700 font-medium p-2 rounded-md w-full"
                        autoComplete=""
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        onClick={createUser}
                        disabled={isLoading || name.length < 3}
                        className="bg-primary-100 px-8 py-2 text-gray-700 flex items-center justify-center font-medium text-2xl rounded-md mt-8 mx-auto active:bg-primary-100/90 disabled:bg-primary-100/50"
                    >
                        {isLoading ? (
                            <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 animate-spin" />
                        ) : (
                            'Start'
                        )}
                    </button>
                </div>
            </div>

            <img
                src={loadingScreenImage}
                className="absolute top-0 left-0 w-full h-full object-cover object-bottom opacity-50"
            />
        </div>
    )
}
