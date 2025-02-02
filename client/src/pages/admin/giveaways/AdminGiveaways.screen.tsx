import { Card } from '@/components/Card'
import Checkbox from '@/components/Checkbox'
import { buildImageUrl } from '@/config/path'
import { TelegramUserLink } from '@/features/accounts/components/TelegramUserLink'
import { useMutation } from '@/hooks/common/useMutation'
import { api } from '@/services/api'
import { IAdminExpressGiveawayListItem } from '@/store/types'
import { useEffect, useState } from 'react'
import { cn } from 'tailwind-cn'

export const AdminGiveawaysScreen = () => {
    const [giveaways, setGiveaways] = useState<IAdminExpressGiveawayListItem[]>([])

    const markProceeded = useMutation<IAdminExpressGiveawayListItem, [string, string]>({
        fn: async (giveawayId, winnerId) => {
            return api(`/admin/expressGiveaways/${giveawayId}/processedWinners`, {
                method: 'POST',
                body: JSON.stringify({ winnerId }),
            })
        },
        onSuccess: (giveaway) => {
            setGiveaways((prev) => {
                return prev.map((g) => (g._id === giveaway._id ? giveaway : g))
            })
        },
    })

    const markPending = useMutation<IAdminExpressGiveawayListItem, [string, string]>({
        fn: async (giveawayId, winnerId) => {
            return api(`/admin/expressGiveaways/${giveawayId}/processedWinners/${winnerId}`, {
                method: 'DELETE',
            })
        },
        onSuccess: (giveaway) => {
            setGiveaways((prev) => {
                return prev.map((g) => (g._id === giveaway._id ? giveaway : g))
            })
        },
    })

    const rerollWinner = useMutation<IAdminExpressGiveawayListItem, [string, string]>({
        fn: async (giveawayId, winnerId) => {
            return api(`/admin/expressGiveaways/${giveawayId}/rerolledWinners`, {
                method: 'POST',
                body: JSON.stringify({ winnerId }),
            })
        },
        onSuccess: (giveaway) => {
            setGiveaways((prev) => {
                return prev.map((g) => (g._id === giveaway._id ? giveaway : g))
            })
        },
    })

    const listGiveaways = useMutation<IAdminExpressGiveawayListItem[]>({
        fn: async () => {
            return api(`/admin/expressGiveaways`)
        },
        onSuccess: (giveaways) => {
            setGiveaways(giveaways)
        },
    })

    useEffect(() => {
        listGiveaways.send()
    }, [])

    return (
        <div className="h-full overflow-auto flex flex-col p-2 gap-4">
            {giveaways.map((g) => (
                <Card key={g._id} className="px-2 pt-3 divide-y-2 space-y-2">
                    <div className="grid grid-cols-[max-content,minmax(0,1fr),max-content] items-center">
                        <img
                            src={buildImageUrl(g.giveawayItem.photoPath)}
                            alt={g.giveawayItem.name}
                            className="w-12 h-12 mr-2 bg-white p-1 rounded-full"
                        />
                        <div className="flex flex-col text-sm">
                            <span className="text-primary-700">{g.name}</span>
                            <span>
                                {g.participants} / {g.maxParticipants}
                            </span>
                        </div>
                        <div className="text-sm">{new Date(g.finishedAt).toDateString()}</div>
                    </div>

                    <div className="flex flex-col divide-y">
                        {g.winners.map((w) => (
                            <div
                                key={w._id}
                                className="grid grid-cols-[max-content,minmax(0,1fr),max-content] gap-3 items-center py-3"
                            >
                                <Checkbox
                                    checked={w.processed}
                                    className={cn({
                                        'animate-pulse':
                                            markPending.isLoading || markProceeded.isLoading,
                                    })}
                                    onChange={(checked) => {
                                        if (checked) {
                                            markProceeded.send(g._id, w._id)
                                        } else {
                                            markPending.send(g._id, w._id)
                                        }
                                    }}
                                />

                                <TelegramUserLink
                                    nickname={w.nickname}
                                    userId={w._id}
                                    className="underline underline-offset-4 text-primary-700"
                                />
                                <button
                                    disabled={rerollWinner.isLoading || w.processed}
                                    onClick={() => {
                                        if (
                                            confirm(
                                                `Вы уверены что хотите перевыбрать нового победителя вместо "${w.nickname}"?`,
                                            )
                                        ) {
                                            rerollWinner.send(g._id, w._id)
                                        }
                                    }}
                                    className={cn(
                                        'bg-stone-800 text-primary-700 disabled:bg-gray-400 disabled:border-black disabled:text-black rounded-full px-2 py-1 border border-primary-700',
                                        {},
                                    )}
                                >
                                    Re-roll
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    )
}
