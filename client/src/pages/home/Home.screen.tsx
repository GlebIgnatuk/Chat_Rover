import { useProfiles } from '@/context/profiles'
import { buildProtectedUrl } from '@/utils/url'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

export const HomeScreen = () => {
    const profiles = useProfiles()

    useEffect(() => {
        if (profiles.profiles.length !== 0) return

        const abortController = new AbortController()
        profiles.searchProfiles(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    if (profiles.loading.is) {
        return <>Loading...</>
    } else if (profiles.loading.error) {
        return <>Failed to load: {profiles.loading.error}</>
    }

    return (
        <div className="h-full overflow-auto p-1 shadow-inner space-y-2">
            {profiles.profiles.map((u) => (
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
                        to={buildProtectedUrl(`/chats/new?peerId=${u._id}`)}
                        className="text-2xl w-8 h-8 text-center"
                    >
                        💬
                    </NavLink>
                </div>
            ))}
        </div>
    )
}
