import { useStore } from '@/context/app/useStore'
import { IIdentity } from '@/context/auth/AuthContext'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { api } from '@/services/api'
import { IListingExpressGiveaway } from '@/store/types'
import { buildImageUrl } from '@/utils/url'
import { useEffect, useState } from 'react'
import { cn } from 'tailwind-cn'

const calculateTimeLeftInSeconds = (startedAt: Date | null, durationInS: number) => {
    let timeLeftInS: number
    if (startedAt) {
        timeLeftInS = Math.floor((startedAt.getTime() + durationInS * 1000 - Date.now()) / 1000)
    } else {
        timeLeftInS = durationInS
    }
    timeLeftInS = Math.max(timeLeftInS, 0)

    return timeLeftInS
}

const formatClock = (timeLeftInS: number, reachedMaxParticipants: boolean) => {
    if (timeLeftInS === 0 || reachedMaxParticipants) {
        return <span className="animate-pulse">Choosing the winner...</span>
    }

    const hours = Math.floor(timeLeftInS / 60 / 60)
    const minutes = Math.floor(timeLeftInS / 60) % 60
    const seconds = timeLeftInS % 60

    return (
        <span className={timeLeftInS <= 60 ? 'text-red-700' : ''}>
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
        </span>
    )
}

const Giveaway = ({
    giveaway,
    onParticipateSuccess,
}: {
    giveaway: IListingExpressGiveaway
    onParticipateSuccess: () => Promise<void>
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [clock, setClock] = useState(0)
    void clock

    const onParticipate = async () => {
        try {
            setIsSubmitting(true)
            setError('')
            const response = await api(`/expressGiveaways/${giveaway._id}/participants`, {
                method: 'POST',
            })
            if (response.success) {
                try {
                    await onParticipateSuccess()
                } catch (e) {
                    console.error(e)
                }
            } else {
                setError(response.error)
            }
        } catch (e) {
            console.error(e)
            setError('Something went wrong')
        } finally {
            setIsSubmitting(false)
            setTimeout(() => {
                setError('')
            }, 3000)
        }
    }

    const timeLeftInSeconds = calculateTimeLeftInSeconds(
        giveaway.startedAt ? new Date(giveaway.startedAt) : null,
        giveaway.durationInSeconds,
    )
    const participantsRequired = giveaway.minParticipants - giveaway.participants

    const hasEnded =
        (timeLeftInSeconds <= 0 || giveaway.participants >= giveaway.maxParticipants) &&
        !!giveaway.finishedAt

    useEffect(() => {
        if (!giveaway.startedAt || hasEnded) return

        const interval = window.setInterval(() => setClock((prev) => prev + 1), 1000)

        return () => window.clearInterval(interval)
    }, [giveaway.startedAt, hasEnded])

    return (
        <div className="bg-stone-800/90 border border-primary-700 rounded-xl p-2">
            <div className="flex justify-between items-center">
                <div className="font-semibold text-primary-700">
                    {giveaway.name}
                    <span className="text-xs text-white">{hasEnded ? ' (ended)' : ''}</span>
                </div>
                <div className="text-xs">{new Date(giveaway.createdAt).toDateString()}</div>
            </div>

            <div className="font-semibold text-white text-center text-3xl my-3">
                {hasEnded
                    ? ''
                    : formatClock(
                          timeLeftInSeconds,
                          giveaway.participants >= giveaway.maxParticipants,
                      )}
            </div>

            <div className="flex flex-col items-center">
                <img
                    src={buildImageUrl(giveaway.giveawayItem.photoPath)}
                    className="w-3/5 aspect-square"
                    alt={giveaway.giveawayItem.name}
                />

                <div className="text-xl">
                    <span className="mr-1 text-primary-700">{giveaway.giveawayItem.name}</span>
                    <span className="text-xs">({giveaway.maxWinners} winners)</span>
                </div>
            </div>

            <div className="flex flex-col mt-4">
                <div className="relative rounded-full overflow-hidden bg-[#131313] h-8">
                    <div
                        className="h-full w-0 bg-gradient-to-r from-primary-700 to-white transition-all duration-300"
                        style={{
                            width: (giveaway.participants / giveaway.maxParticipants) * 100 + '%',
                        }}
                    ></div>

                    <div className="text-primary-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#131313] py-1 px-2 text-xs rounded-xl">
                        {giveaway.participants} / {giveaway.maxParticipants}
                    </div>
                </div>

                {hasEnded ? (
                    <div>
                        <div className="text-primary-700 font-semibold mt-2">Winners</div>
                        <div className="grid grid-cols-3 gap-2 auto-rows-max mt-2">
                            {giveaway.winners.map((winner) => (
                                <div
                                    key={winner._id}
                                    className="grid grid-cols-[max-content,minmax(0,1fr)] items-center gap-2"
                                >
                                    <AccountAvatar
                                        size="md"
                                        nickname={winner.nickname}
                                        url={winner.avatarUrl}
                                    />
                                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                        {winner.nickname}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : giveaway.isParticipating ? (
                    <div className="mb-4 mt-6 p-2 text-center text-primary-700 font-semibold">
                        You are participating!
                    </div>
                ) : (
                    <button
                        disabled={
                            giveaway.participants >= giveaway.maxParticipants ||
                            giveaway.finishedAt !== null ||
                            giveaway.isParticipating ||
                            timeLeftInSeconds <= 60 ||
                            isSubmitting
                        }
                        onClick={() => onParticipate()}
                        className="mb-4 mt-6 self-center group disabled:cursor-not-allowed rounded-md overflow-hidden font-semibold flex items-center justify-center"
                    >
                        <span className="text-sm bg-primary-700 text-stone-800 px-5 py-2 group-disabled:bg-gray-400">
                            Participate
                        </span>

                        <span className="flex items-center gap-1 px-2 py-2 bg-stone-800 text-primary-700 group-disabled:w-0 group-disabled:px-0 transition-all">
                            <img src="/currency/lunite.png" className="w-5 h-5" />
                            <span className="text-sm">{giveaway.cost}</span>
                        </span>
                    </button>
                )}

                {participantsRequired > 0 && (
                    <div className="text-center">
                        {participantsRequired} participants more to go!
                    </div>
                )}

                <div
                    className={cn('italic text-red-500 text-center h-8 invisible', {
                        visible: error,
                    })}
                >
                    {error}
                </div>
            </div>
        </div>
    )
}

export const GiveawayScreen = () => {
    const { setUser } = useStore((state) => state.identity)
    const { items, setItems } = useStore((state) => state.expressGiveaways)

    const onParticipateSuccess = async () => {
        {
            const response = await api<IListingExpressGiveaway[]>('/expressGiveaways')
            if (response.success) {
                setItems(response.data)
            }
        }

        {
            const response = await api<IIdentity>('/users/me')
            if (response.success) {
                setUser(response.data.user)
            }
        }
    }

    useEffect(() => {
        const interval = window.setInterval(async () => {
            const response = await api<IListingExpressGiveaway[]>('/expressGiveaways')
            if (response.success) {
                setItems(response.data)
            }
        }, 5000)

        return () => {
            window.clearInterval(interval)
        }
    }, [])

    return (
        <div className="h-full overflow-auto space-y-2 p-1 py-2">
            {items.map((item) => (
                <Giveaway giveaway={item} onParticipateSuccess={onParticipateSuccess} />
            ))}
        </div>
    )
}
