import { useStore } from '@/context/app/useStore'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { api } from '@/services/api'
import { IListingExpressGiveaway } from '@/store/types'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

const formatClock = (timeLeftInS: number) => {
    if (timeLeftInS === 0) {
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

    useEffect(() => {
        if (!giveaway.startedAt || giveaway.finishedAt) return

        const interval = window.setInterval(() => setClock((prev) => prev + 1), 1000)

        return () => window.clearInterval(interval)
    }, [giveaway.startedAt, giveaway.finishedAt])

    return (
        <div className="bg-stone-800/90 border border-primary-700 rounded-xl p-2">
            <div className="flex justify-between items-center">
                <div className="font-semibold text-primary-700">
                    {giveaway.name}
                    <span className="text-xs text-white">
                        {giveaway.finishedAt ? ' (ended)' : ''}
                    </span>
                </div>
                <div className="text-xs">{new Date(giveaway.createdAt).toDateString()}</div>
            </div>

            <div className="font-semibold text-white text-center text-3xl my-3">
                {giveaway.finishedAt ? '' : formatClock(timeLeftInSeconds)}
            </div>

            <div className="flex flex-col items-center">
                <img
                    src={giveaway.giveawayItem.photoUrl}
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

                {giveaway.finishedAt ? (
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
                        className="mb-4 mt-6 self-center bg-primary-700 text-stone-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg px-2 py-2 font-semibold flex items-center justify-center gap-2"
                    >
                        <span>Participate</span>

                        {giveaway.participants < giveaway.maxParticipants && giveaway.cost > 0 && (
                            <span className="inline-block bg-stone-800 text-yellow-500 rounded-md px-2">
                                <span>{giveaway.cost}</span>
                                <FontAwesomeIcon icon={faStar} className="w-4 h-4 ml-1" />
                            </span>
                        )}
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
    const { items, setItems } = useStore((state) => state.expressGiveaways)

    const onParticipateSuccess = async () => {
        const response = await api<IListingExpressGiveaway[]>('/expressGiveaways')
        if (response.success) {
            setItems(response.data)
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
        <div className="h-full overflow-auto space-y-2">
            {items.map((item) => (
                <Giveaway giveaway={item} onParticipateSuccess={onParticipateSuccess} />
            ))}
        </div>
    )
}
