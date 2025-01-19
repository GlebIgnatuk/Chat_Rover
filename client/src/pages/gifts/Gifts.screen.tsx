import { Card } from '@/components/Card'
import { Timer } from '@/components/Timer'
import { useStore } from '@/context/app/useStore'
import { api, APIResponse } from '@/services/api'
import { IUser } from '@/store/types'
import { buildImageUrl } from '@/utils/url'
import { useRef, useState } from 'react'
import { cn } from 'tailwind-cn'

interface UseMutationProps<T, A extends unknown[]> {
    fn: (...args: A) => Promise<APIResponse<T>>
    onSuccess?: (data: T) => void
    errorTimerMs?: number
}

const useMutation = <T, A extends unknown[] = []>({
    fn,
    onSuccess,
    errorTimerMs,
}: UseMutationProps<T, A>) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [data, setData] = useState<T | null>(null)

    const send = async (...args: A) => {
        try {
            setError('')
            setIsLoading(true)

            const response = await fn(...args)
            if (response.success) {
                setData(response.data)
                onSuccess?.(response.data)
            } else {
                setError(response.error)
                if (errorTimerMs !== undefined) {
                    setTimeout(() => setError(''), errorTimerMs)
                }
            }

            setIsLoading(false)
        } catch {
            setError('Something went wrong')
            if (errorTimerMs !== undefined) {
                setTimeout(() => setError(''), errorTimerMs)
            }
            setIsLoading(false)
        }
    }

    return { isLoading, error, data, send }
}

export const GiftsScreen = () => {
    const promocodeRef = useRef<HTMLInputElement>(null)
    const [claimedPromocode, setClaimedPromocode] = useState(false)
    const [event, setEvent] = useState({})
    const { user, setUser } = useStore((state) => state.identity)

    void event

    const bonusRedeem = useMutation<IUser>({
        fn: async () => {
            return api(`/me/bonuses/daily/redeems`, { method: 'POST' })
        },
        onSuccess: setUser,
    })
    const promocodeActivation = useMutation<IUser, [string]>({
        fn: async (code) => {
            return api(`/me/balancePromocodes/${code}/activations`, { method: 'POST' })
        },
        onSuccess: (user) => {
            setUser(user)
            setClaimedPromocode(true)
            setTimeout(() => setClaimedPromocode(false), 3000)
        },
        errorTimerMs: 3000,
    })

    const hasAvailableGift =
        Date.now() - new Date(user.dailyBonusCollectedAt).getTime() >= 12 * 60 * 60 * 1000
    const nextBonusAt = new Date(
        new Date(user.dailyBonusCollectedAt).getTime() + 12 * 60 * 60 * 1000,
    )

    return (
        <div className="px-2 py-2 overflow-auto space-y-2">
            <Card className="flex flex-col p-2">
                <p className="text-primary-700">Activate Promocode</p>
                <input
                    type="text"
                    placeholder="code"
                    className="px-1 py-1 text-black rounded-lg"
                    ref={promocodeRef}
                />
                <p className="text-red-500 h-6 flex items-center">{promocodeActivation.error}</p>
                <button
                    className={cn(
                        'text-stone-800 bg-primary-700 font-medium px-6 py-1 rounded-lg transition-all duration-300',
                        {
                            'bg-green-600': claimedPromocode,
                            'bg-gray-400': promocodeActivation.isLoading,
                        },
                    )}
                    disabled={promocodeActivation.isLoading || claimedPromocode}
                    onClick={() => {
                        if (!promocodeRef.current) return

                        const code = promocodeRef.current.value.trim()
                        if (code.length === 0) return

                        promocodeActivation.send(code)
                    }}
                >
                    {claimedPromocode ? 'Success' : 'Claim'}
                </button>
            </Card>

            <div className="grid grid-cols-2">
                <Card className="flex flex-col py-3 px-2">
                    <img
                        src={buildImageUrl('/currency/lunite.png')}
                        className="w-40 h-40 mx-auto animate-pulse"
                    />

                    <div className="text-primary-700 text-xl mx-auto mb-3">1x Lunite</div>

                    <button
                        className="bg-primary-700 text-stone-800 disabled:bg-gray-500 disabled:cursor-not-allowed font-semibold py-1 rounded-md text-md"
                        onClick={bonusRedeem.send}
                        disabled={!hasAvailableGift || bonusRedeem.isLoading}
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
        </div>
    )
}
