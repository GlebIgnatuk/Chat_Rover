import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { ProfileCard } from '@/features/profiles/components/ProfileCard'
import { useSearch } from '@/features/search/hooks/useSearch'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { FiltersModal } from '@/modules/community/FiltersModal'
import { buildProtectedUrl } from '@/utils/url'
import {
    faChevronLeft,
    faChevronRight,
    faFilter,
    faPerson,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from 'tailwind-cn'

export const CommunityScreen = () => {
    const search = useSearch()

    const [isOpen, setIsOpen] = useState(false)
    const localize = useLocalize()
    const navigate = useNavigate()

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
                    onClick={() => search.search(search.page)}
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="h-full overflow-hidden grid grid-rows-[max-content,minmax(0,1fr),max-content]">
            <Modal open={isOpen} hideBackdrop>
                <FiltersModal
                    onClose={() => setIsOpen(false)}
                    onSubmit={() => {
                        search.search()
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
                {search.items.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                        <div className="text-3xl">Nothing was found</div>
                        <button
                            className="bg-stone-800 text-primary-700 border border-primary-700 rounded-xl px-6 py-2"
                            onClick={() => search.search(search.page)}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {search.items.map(({ user, ...profile }) => (
                    <ProfileCard
                        key={profile._id}
                        user={user}
                        profile={profile}
                        onClick={() => navigate(buildProtectedUrl(`/chats/new?peerId=${user._id}`))}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between pt-2 pb-6 px-3">
                <button
                    onClick={() => search.goBack()}
                    className={cn({
                        'text-gray-300 pointer-events-none': search.page === 1,
                    })}
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                    Back
                </button>

                <div>{search.page}</div>

                <button
                    onClick={() => search.goForward()}
                    className={cn({
                        'text-gray-300 pointer-events-none': search.items.length < 10,
                    })}
                >
                    Next
                    <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
