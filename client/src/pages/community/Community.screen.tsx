import { FlagIcon } from '@/components/FlagIcon'
import { useStore } from '@/context/app/useStore'
import { useWuwaCharacters } from '@/context/initializer/useWuwaCharacters'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { CharacterAvatar } from '@/features/profiles/components/ProfileForm/CharacterAvatar'
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
import { useNavigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const CommunityScreen = () => {
    const state = useStore((state) => state.community)
    const loading = state.loading.items.$ ?? { is: false }
    const [isOpen, setIsOpen] = useState(false)
    const characters = useWuwaCharacters((state) => state.items)
    const localize = useLocalize()
    const navigate = useNavigate()

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
                <div className="bg-gray-500 p-2 rounded-xl flex items-center gap-2 text-gray-200">
                    <FontAwesomeIcon icon={faPerson} />
                    <span>{localize('search__characters')}</span>
                </div>

                <div
                    className="bg-stone-800 p-2 rounded-xl flex items-center gap-2 cursor-pointer text-primary-700"
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
                        className="bg-black/30 backdrop-blur-sm rounded-xl"
                        onClick={() =>
                            navigate(buildProtectedUrl(`/chats/new?peerId=${item.user._id}`))
                        }
                    >
                        <div className="pl-2 flex items-start justify-between">
                            <div className="pt-1">
                                <span className="font-semibold text-accent">{item.nickname}</span>
                                <span className="text-gray-400"> / </span>
                                <span className="text-xs text-accent">{item.user.nickname}</span>
                            </div>

                            <div className="text-xs w-16 bg-stone-800 border border-primary-700 text-primary-700 rounded-tr-xl rounded-bl-xl text-center">
                                {item.server}
                            </div>
                        </div>

                        <div className="px-2 my-1 grid grid-cols-[max-content,minmax(0,1fr),max-content] items-center">
                            <AccountAvatar
                                url={
                                    `https://picsum.photos/200?r=${Math.random()}` ||
                                    item.user.avatarUrl
                                }
                                nickname={item.user.nickname}
                                size="2xl"
                                // radius="xl"
                            />

                            <div className="border-t border-primary-700"></div>

                            <div className="relative flex gap-2 justify-end">
                                <div className="absolute w-full top-1/2 -translate-y-1/2 border-t border-primary-700 -z-10"></div>

                                {item.team.map((t, idx) => (
                                    <CharacterAvatar
                                        key={idx}
                                        size="xl"
                                        url={
                                            t
                                                ? buildImageUrl(
                                                      characters[t.characterId]?.photoPath ?? '',
                                                  )
                                                : null
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="px-2">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm text-primary-700">
                                    {localize('auth__profile__world_level')}
                                </span>
                                <span className="text-xs text-gray-300">
                                    Rank {item.worldLevel}
                                </span>
                            </div>
                            <hr className="border-gray-500 border-1" />
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm text-primary-700">
                                    {localize('auth__profile__voice')}
                                </span>
                                <span className="text-xs text-gray-300">
                                    {item.usesVoice ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <hr className="border-gray-500 border-1" />
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm text-primary-700">
                                    {localize('auth__profile__languages')}
                                </span>
                                <span className="flex gap-1">
                                    {item.languages.map((lang) => (
                                        <div
                                            key={lang}
                                            className="bg-stone-800 pr-2 flex gap-2 items-center rounded-xl overflow-hidden border border-primary-700"
                                        >
                                            <FlagIcon code={lang} className="w-5 h-5" />
                                            <span className="uppercase text-xs text-gray-300">
                                                {lang}
                                            </span>
                                        </div>
                                    ))}
                                </span>
                            </div>
                        </div>

                        {/* <NavLink
                            to={buildProtectedUrl(`/chats/new?peerId=${item.user._id}`)}
                            className="text-2xl w-8 h-8 text-center"
                        >
                            💬
                        </NavLink> */}
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
