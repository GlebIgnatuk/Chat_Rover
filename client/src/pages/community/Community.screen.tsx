import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { buildProtectedPath } from '@/config/path'
import { ProfileCard } from '@/features/profiles/components/ProfileCard'
import { useSearch } from '@/features/search/hooks/useSearch'
import { useScrollRestoration } from '@/hooks/common/useScrollRestoration'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { FiltersModal } from '@/modules/community/FiltersModal'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const CommunityScreen = () => {
    const search = useSearch()

    const [isOpen, setIsOpen] = useState(false)
    const localize = useLocalize()
    const navigate = useNavigate()
    const scrollableRef = useScrollRestoration<HTMLDivElement>()

    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const cardHeight = 200
        const scrollHeight =
            e.currentTarget.scrollHeight - e.currentTarget.clientHeight - e.currentTarget.scrollTop
        const cardsLeft = Math.floor(scrollHeight / cardHeight)

        if (cardsLeft <= 5 && !search.loading.is && !search.loading.error) {
            search.goForward()
        }
    }

    if (search.items.length === 0) {
        if (search.loading.is) {
            return (
                <div className="h-full flex items-center justify-center">
                    <CircularLoaderIndicator size="lg" />
                </div>
            )
        } else if (search.loading.error) {
            return (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                    <div className="text-3xl">Failed to load</div>
                    <button
                        className="bg-stone-800 text-primary-700 border border-primary-700 rounded-xl px-6 py-2"
                        onClick={() => search.search(search.page, search.filters)}
                    >
                        Retry
                    </button>
                </div>
            )
        } else {
            return (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                    <div className="text-3xl">Nothing was found</div>
                    <div className="flex gap-2">
                        <button
                            className="bg-stone-800 text-primary-700 border border-primary-700 rounded-xl px-6 py-2"
                            onClick={() => search.search(search.page, search.filters)}
                        >
                            Retry
                        </button>
                        <button
                            className="bg-stone-800 text-primary-700 border border-primary-700 rounded-xl px-6 py-2"
                            onClick={() => {
                                search.reset()
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="h-full overflow-hidden grid grid-rows-[max-content,minmax(0,1fr)]">
            <Modal open={isOpen} hideBackdrop>
                <FiltersModal
                    onClose={() => setIsOpen(false)}
                    onSubmit={() => {
                        search.search(1, search.filters)
                        setIsOpen(false)
                    }}
                />
            </Modal>

            <div className="grid grid-cols-1 p-1 gap-2">
                {/* <div className="bg-gray-500 p-2 rounded-xl flex items-center gap-2 text-gray-200">
                    <FontAwesomeIcon icon={faPerson} />
                    <span>{localize('search__characters')}</span>
                </div> */}

                <div
                    className="bg-stone-800 p-2 rounded-xl flex items-center gap-2 cursor-pointer text-primary-700"
                    onClick={() => setIsOpen(true)}
                >
                    <FontAwesomeIcon icon={faFilter} />
                    <span>{localize('search__filters')}</span>
                </div>
            </div>

            <div
                ref={scrollableRef}
                className="h-full overflow-auto p-1 shadow-inner space-y-2"
                onScroll={onScroll}
            >
                {search.items.map(({ user, ...profile }) => (
                    <ProfileCard
                        key={profile._id}
                        user={user}
                        profile={profile}
                        onClick={() => navigate(buildProtectedPath(`/u/${user._id}`))}
                        onNicknameClick={() =>
                            navigate(buildProtectedPath(`/u/${user._id}/profiles/${profile._id}`))
                        }
                    />
                ))}

                {search.items.length !== 0 && search.loading.is && (
                    <div className="flex justify-center py-6">
                        <CircularLoaderIndicator size="sm" />
                    </div>
                )}
            </div>
        </div>
    )
}
