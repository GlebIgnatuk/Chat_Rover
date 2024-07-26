import { useAuth } from '@/context/auth/useAuth'
import { useUser } from '@/context/auth/useUser'
import { api } from '@/services/api'
import { useState } from 'react'

export const AccountScreen = () => {
    const [isDeleting, setIsDeleting] = useState(false)
    const auth = useAuth()
    const user = useUser()

    const deleteAccount = async () => {
        try {
            setIsDeleting(true)
            const response = await api('/users/me', { method: 'DELETE' })
            if (response.success) {
                auth.logout()
            }
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-slate-800/10 backdrop-blur-sm p-2">
            <p className="font-bold text-3xl">{user.user.displayName}</p>

            <button
                onClick={deleteAccount}
                disabled={isDeleting}
                className="bg-primary-100 text-black disabled:bg-gray-700 px-3 py-2 rounded-md"
            >
                Delete account
            </button>
        </div>
    )
}
