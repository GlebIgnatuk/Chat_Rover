import { Card } from '@/components/Card'
import { Timer } from '@/components/Timer'
import { useStore } from '@/context/app/useStore'
import { api } from '@/services/api'
import { IUser } from '@/store/types'
import { useState } from 'react'

export const GiftsScreen = () => {
    const [event, setEvent] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // @todo show error
    void error
    void event

    const { user, setUser } = useStore((state) => state.identity)

    const hasAvailableGift =
        Date.now() - new Date(user.dailyBonusCollectedAt).getTime() >= 12 * 60 * 60 * 1000
    const nextBonusAt = new Date(
        new Date(user.dailyBonusCollectedAt).getTime() + 12 * 60 * 60 * 1000,
    )

    const redeem = async () => {
        try {
            setIsLoading(true)

            const response = await api<IUser>(`/me/bonuses/daily/redeems`, { method: 'POST' })
            if (response.success) {
                setUser(response.data)
            } else {
                setError(response.error)
            }

            setIsLoading(false)
        } catch {
            setError('Something wen wrong')
            setIsLoading(false)
        }
    }

    return (
        <div className="px-2 py-2 grid grid-cols-2">
            <Card className="flex flex-col py-3 px-2">
                <img src="/currency/lunite.png" className="w-40 h-40 mx-auto animate-pulse" />

                <div className="text-primary-700 text-xl mx-auto mb-3">1x Lunite</div>

                <button
                    className="bg-primary-700 text-stone-800 disabled:bg-gray-500 disabled:cursor-not-allowed font-semibold py-1 rounded-md text-md"
                    onClick={redeem}
                    disabled={!hasAvailableGift || isLoading}
                >
                    <Timer
                        end={nextBonusAt}
                        onComplete={() => {
                            setEvent({})
                        }}
                    >
                        Redeem
                    </Timer>
                </button>
            </Card>
        </div>
    )
}
