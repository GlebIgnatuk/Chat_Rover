import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

interface IExpressGiveaway {
    name: string
    cost: number
    participants: number
    minParticipants: number
    maxParticipants: number
    maxWinners: number
    scheduledAt: string
    startedAt: string | null
    durationInSeconds: number
    product: {
        _id: string
        name: string
        photoPath: string
    }
}

const giveaway1: IExpressGiveaway = {
    name: 'Express Giveaway #23',
    cost: 2,
    participants: 230,
    minParticipants: 10,
    maxParticipants: 250,
    maxWinners: 3,
    scheduledAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    durationInSeconds: 3 * 60 * 60,
    product: {
        _id: '1',
        name: 'Lunite Subscription',
        photoPath: '/public/products/lunite_subscription.png',
    },
}

const giveaway2: IExpressGiveaway = {
    name: 'Express Giveaway #24',
    cost: 5,
    participants: 0,
    minParticipants: 10,
    maxParticipants: 100,
    maxWinners: 1,
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    startedAt: null,
    durationInSeconds: 1 * 60 * 60,
    product: {
        _id: '1',
        name: 'Insider Channel',
        photoPath: '/public/products/insider_channel.png',
    },
}

const giveaway3: IExpressGiveaway = {
    name: 'Express Giveaway #25',
    cost: 10,
    participants: 0,
    minParticipants: 10,
    maxParticipants: 50,
    maxWinners: 1,
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    startedAt: null,
    durationInSeconds: 12 * 60 * 60,
    product: {
        _id: '1',
        name: 'Connoiseur Channel',
        photoPath: '/public/products/connoiseur_channel.png',
    },
}

const formatClock = (startedAt: Date | null, durationInS: number) => {
    let timeLeftInS: number
    if (startedAt) {
        timeLeftInS = Math.floor((startedAt.getTime() + durationInS * 1000 - Date.now()) / 1000)
    } else {
        timeLeftInS = durationInS
    }

    const hours = Math.floor(timeLeftInS / 60 / 60)
    const minutes = Math.floor(timeLeftInS / 60) % 60
    const seconds = timeLeftInS % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const Giveaway = ({ giveaway }: { giveaway: IExpressGiveaway }) => {
    const [participants, setParticipants] = useState(giveaway.participants)
    const [clock, setClock] = useState(0)
    void clock

    useEffect(() => {
        if (!giveaway.startedAt) return

        const interval = window.setInterval(() => setClock((prev) => prev + 1), 1000)

        return () => window.clearInterval(interval)
    }, [giveaway.startedAt])

    return (
        <div className="bg-stone-800/90 border border-primary-700 rounded-xl p-2">
            <div className="flex justify-between items-center">
                <div className="font-semibold text-primary-700">{giveaway.name}</div>
                <div className="text-xs">{new Date(giveaway.scheduledAt).toDateString()}</div>
            </div>

            <div className="font-semibold text-white text-center text-3xl my-3">
                {formatClock(
                    giveaway.startedAt ? new Date(giveaway.startedAt) : null,
                    giveaway.durationInSeconds,
                )}
            </div>

            <div className="flex flex-col items-center">
                <img
                    src={giveaway.product.photoPath}
                    className="w-3/5 aspect-square"
                    alt={giveaway.product.name}
                />

                <div className="text-xl">
                    <span className="mr-1 text-primary-700">{giveaway.product.name}</span>
                    {/* <span className="text-xs">({giveaway.maxWinners} winners)</span> */}
                </div>
            </div>

            <div className="flex flex-col gap-10 mt-4 mb-6">
                <div className="relative rounded-full overflow-hidden bg-[#131313] h-8">
                    <div
                        className="h-full w-0 bg-gradient-to-r from-primary-700 to-white transition-all duration-300"
                        style={{
                            width: (participants / giveaway.maxParticipants) * 100 + '%',
                        }}
                    ></div>

                    <div className="text-primary-700 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#131313] py-1 px-2 text-xs rounded-xl">
                        {participants} / {giveaway.maxParticipants}
                    </div>
                </div>

                <button
                    disabled={
                        participants >= giveaway.maxParticipants ||
                        new Date(giveaway.scheduledAt).getTime() > Date.now()
                    }
                    onClick={() => setParticipants((p) => p + 1)}
                    className="self-center bg-primary-700 text-stone-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg px-2 py-2 font-semibold flex items-center justify-center gap-2"
                >
                    <span>Participate</span>

                    {participants < giveaway.maxParticipants && (
                        <span className="inline-block bg-stone-800 text-yellow-500 rounded-md px-2">
                            <span>{giveaway.cost}</span>
                            <FontAwesomeIcon icon={faStar} className="w-4 h-4 ml-1" />
                        </span>
                    )}
                </button>
            </div>
        </div>
    )
}

export const GiveawayScreen = () => {
    return (
        <div className="h-full overflow-auto space-y-2">
            <Giveaway giveaway={giveaway1} />
            <Giveaway giveaway={giveaway2} />
            <Giveaway giveaway={giveaway3} />
        </div>
    )
}
