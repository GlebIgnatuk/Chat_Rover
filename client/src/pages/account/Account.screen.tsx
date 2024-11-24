import { useStore } from '@/context/app/useStore'
// import { api } from '@/services/api'
// import { useState } from 'react'

export const AccountScreen = () => {
    const user = useStore((state) => state.identity.user)
    // const [isDeleting, setIsDeleting] = useState(false)

    const deleteAccount = async () => {
        // try {
        //     setIsDeleting(true)
        //     const response = await api('/users/me', { method: 'DELETE' })
        //     if (response.success) {
        //         auth.logout()
        //     }
        // } finally {
        //     setIsDeleting(false)
        // }
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-slate-800/10 backdrop-blur-sm p-2">
            <p className="font-bold text-3xl">{user.nickname}</p>

            <button
                onClick={deleteAccount}
                // disabled={isDeleting}
                className="bg-primary-100 text-black disabled:bg-gray-700 px-3 py-2 rounded-md"
            >
                Delete account
            </button>
        </div>
    )
}
