// import { api } from "@/services/api";
// import { useEffect, useState } from "react"
// import { io, Socket } from "socket.io-client";

import { IUser } from '@/context/auth/AuthContext'
import { api } from '@/services/api'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

export const HomeScreen = () => {
    const [users, setUsers] = useState<IUser['user'][]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    console.log(error)
    const loadUsers = async (signal?: AbortSignal) => {
        try {
            setIsLoading(true)
            const response = await api<IUser['user'][]>('/users', { signal })
            if (response.success) {
                setUsers(response.data)
            } else {
                setError(response.error)
            }
        } catch (e) {
            console.error(e)
            setError('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const abortController = new AbortController()
        loadUsers(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    if (isLoading) {
        return <>Loading...</>
    }

    return (
        <div className="h-full overflow-auto p-1 shadow-inner space-y-2">
            {users.map((u) => (
                <div
                    key={u._id}
                    className="bg-[#FFFAE7] p-2 flex gap-3 items-center rounded-xl border-[4px] border-[#D2AA6C]"
                >
                    {u.avatarUrl ? (
                        <img
                            src={u.avatarUrl}
                            className="w-14 h-14 object-cover object-center border-2 border-[#A17DA8] rounded-full shrink-0"
                        />
                    ) : (
                        <div className="flex items-center justify-center border-2 border-[#A17DA8] bg-gradient-to-b from-[#f0c0fb] to-[#A17DA8] rounded-full w-14 h-14 uppercase font-semibold text-xl overflow-hidden">
                            {u.nickname.substring(0, 2)}
                        </div>
                    )}

                    <div className="grow font-semibold text-[#E79B46]">{u.nickname}</div>

                    <NavLink
                        to={`/home/chats/new?peerId=${u._id}`}
                        className="text-2xl w-8 h-8 text-center"
                    >
                        💬
                    </NavLink>
                </div>
            ))}
        </div>
    )
}
