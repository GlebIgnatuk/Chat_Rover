import { useStore } from '@/context/app/useStore'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { FiltersModal } from '@/modules/community/FiltersModal'
import { api } from '@/services/api'
import { ISearchedProfile } from '@/store/types'
import { buildImageUrl, buildProtectedUrl } from '@/utils/url'
import {
    faChevronLeft,
    faChevronRight,
    faFilter,
    faPerson,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const CommunityScreen = () => {
    const state = useStore((state) => state.community)
    const loading = state.loading.items.$ ?? { is: false }
    const [isOpen, setIsOpen] = useState(false)
    const characters = useWuwaCharacters((state) => state.items)
    const localize = useLocalize()

    const pageRef = useRef(1)

    const searchProfiles = async (page: number, signal?: AbortSignal) => {
        if (page < 1) return

        try {
            state.loading.start()

            const filters = state.filters

            const query = new URLSearchParams()
            for (let i = 0; i < filters.team.length; i++) {
                const t = filters.team[i]
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

            query.append('page', page.toString())
            query.append('limit', '10')
            console.log(query.toString())
            const response = await api<ISearchedProfile[]>(`/profiles?${query}`, { signal })
            if (response.success) {
                state.setSearchedItems(response.data)
                pageRef.current = page
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
        searchProfiles(1, abortController.signal)

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
        <div className="h-full overflow-hidden grid grid-rows-[max-content,minmax(0,1fr),max-content]">
            <Modal open={isOpen} hideBackdrop>
                <FiltersModal
                    onClose={() => setIsOpen(false)}
                    onSubmit={() => {
                        searchProfiles(1)
                        setIsOpen(false)
                    }}
                />
            </Modal>

            <div className="grid grid-cols-2 p-2 gap-2">
                <div className="bg-gray-500 p-2 rounded-xl flex items-center gap-2">
                    <FontAwesomeIcon icon={faPerson} />
                    <span>{localize('search__characters')}</span>
                </div>

                <div
                    className="bg-cyan-600 p-2 rounded-xl flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <FontAwesomeIcon icon={faFilter} />
                    <span>{localize('search__filters')}</span>
                </div>
            </div>

            <div className="h-full overflow-auto p-1 shadow-inner space-y-2">
                {state.searchedItems.length === 0 && (
                    <div className="text-center text-2xl mt-10">Nothing was found...</div>
                )}

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

                        <div className="grow">
                            <div className="font-semibold text-[#E79B46]">
                                {item.user.nickname} ({item.nickname})
                            </div>
                            <div className="font-medium text-[#402c14] grid grid-cols-7 items-center">
                                <span className="col-span-2 font-semibold text-sm">
                                    {item.server}
                                </span>
                                <div className="col-span-4 text-sm text-gray-500">
                                    {item.languages.map((l) => (
                                        <span key={l} className="mr-1">
                                            {l}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm">
                                    {item.usesVoice ? 'Voice' : 'Muted'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.team.map((t, idx) => (
                                    <img
                                        key={idx}
                                        className="bg-white w-8 h-8 object-cover object-top rounded-full"
                                        src={
                                            t
                                                ? buildImageUrl(
                                                      characters[t.characterId]?.photoPath ?? '',
                                                  )
                                                : undefined
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        <NavLink
                            to={buildProtectedUrl(`/chats/new?peerId=${item.user._id}`)}
                            className="text-2xl w-8 h-8 text-center"
                        >
                            💬
                        </NavLink>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2 pb-6 px-3">
                <button
                    onClick={() => searchProfiles(pageRef.current - 1)}
                    className={cn({
                        'text-gray-300 pointer-events-none': pageRef.current === 1,
                    })}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                    Back
                </button>

                <div>{pageRef.current}</div>

                <button
                    onClick={() => searchProfiles(pageRef.current + 1)}
                    className={cn({
                        'text-gray-300 pointer-events-none': state.searchedItems.length < 10,
                    })}
                >
                    Next
                    <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
