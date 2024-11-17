import { api } from '@/services/api'
import { useStore } from '@/store/store'
import { ISearchedProfile } from '@/store/types'
import { buildProtectedUrl } from '@/utils/url'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

export const CommunityScreen = () => {
    const state = useStore((state) => state.community)
    const loading = state.loading.items.$ ?? { is: false }

    const searchProfiles = async (signal?: AbortSignal) => {
        try {
            state.loading.start()

            const filters = state.filters

            const query = new URLSearchParams()
            for (let i = 0, t = filters.team[i]; i < filters.team.length; i++) {
                if (!t) continue

                if (t.characterId) query.append(`team[${i}][characterId]`, t.characterId)
                if (t.minConstellation)
                    query.append(`team[${i}][minConstellation]`, t.minConstellation.toString())
                if (t.maxConstellation)
                    query.append(`team[${i}][maxConstellation]`, t.maxConstellation.toString())
                if (t.minLevel) query.append(`team[${i}][minLevel]`, t.minLevel.toString())
                if (t.maxLevel) query.append(`team[${i}][maxLevel]`, t.maxLevel.toString())
            }

            if (filters.server) query.append('server', filters.server)
            if (filters.usesVoice !== undefined)
                query.append('usesVoice', filters.usesVoice.toString())

            for (const language of filters.languages) {
                query.append('languages[]', language)
            }

            if (filters.minWorldLevel !== 0)
                query.append('minWorldLevel', filters.minWorldLevel.toString())
            if (filters.maxWorldLevel !== 8)
                query.append('maxWorldLevel', filters.maxWorldLevel.toString())

            const response = await api<ISearchedProfile[]>(`/profiles?${query}`, { signal })
            if (response.success) {
                state.setSearchedItems(response.data)
                state.loading.stop()
            } else {
                state.loading.stopWithError(response.error)
            }
        } catch (e) {
            console.error(e)
            state.loading.stopWithError('Something went wrong')
        }
    }

    useEffect(() => {
        if (loading.is || loading.error) return

        const abortController = new AbortController()
        searchProfiles(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [])

    if (loading.is) {
        return <>Loading...</>
    } else if (loading.error) {
        return <>Failed to load: {loading.error}</>
    }

    return (
        <div className="h-full overflow-auto p-1 shadow-inner space-y-2">
            {state.searchedItems.map((item) => (
                <div
                    key={item._id}
                    className="bg-[#FFFAE7] p-2 flex gap-3 items-center rounded-xl border-[4px] border-[#D2AA6C]"
                >
                    {item.user.avatarUrl ? (
                        <img
                            src={item.user.avatarUrl}
                            className="w-14 h-14 object-cover object-center border-2 border-[#A17DA8] rounded-full shrink-0"
                        />
                    ) : (
                        <div className="flex items-center justify-center border-2 border-[#A17DA8] bg-gradient-to-b from-[#f0c0fb] to-[#A17DA8] rounded-full w-14 h-14 uppercase font-semibold text-xl overflow-hidden">
                            {item.user.nickname.substring(0, 2)}
                        </div>
                    )}

                    <div className="grow font-semibold text-[#E79B46]">{item.user.nickname}</div>

                    <NavLink
                        to={buildProtectedUrl(`/chats/new?peerId=${item.user._id}`)}
                        className="text-2xl w-8 h-8 text-center"
                    >
                        💬
                    </NavLink>
                </div>
            ))}
        </div>
    )
}
