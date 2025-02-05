import { Card } from '@/components/Card'
import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { buildAdminPath } from '@/config/path'
import { AccountAvatar } from '@/features/accounts/components/AccountAvatar'
import { TelegramUserLink } from '@/features/accounts/components/TelegramUserLink'
import { Price } from '@/features/shop/components/Price'
import { useMutation } from '@/hooks/common/useMutation'
import { api } from '@/services/api'
import {
    ICurrency,
    IShopOrderAdminListItem,
    IShopOrderStatus,
    SHOP_ORDER_STATUSES,
} from '@/store/types'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from 'tailwind-cn'

const OrdersList = ({
    orders,
    onStatusUpdated,
}: {
    orders: IShopOrderAdminListItem[]
    onStatusUpdated: (productId: string, status: IShopOrderStatus) => void
}) => {
    const changeStatus = useMutation<null, [string, IShopOrderStatus]>({
        fn: async (orderId, status) => {
            return api(`/admin/shopOrders/${orderId}/statuses`, {
                method: 'POST',
                body: JSON.stringify({ status }),
            })
        },
        onSuccess: (_, orderId, status) => {
            onStatusUpdated(orderId, status)
        },
    })

    return orders.map((order) => (
        <Card
            className={cn(
                'grid gap-2 grid-cols-[max-content,minmax(0,1fr),max-content] p-2 items-center',
                {
                    'bg-green-100/20': order.status === 'pending',
                },
            )}
        >
            <AccountAvatar nickname={order.user.nickname} size="lg" />
            <div className="flex flex-col justify-start">
                <TelegramUserLink
                    nickname={order.user.nickname}
                    userId={order.user._id}
                    className="underline underline-offset-4 text-primary-700"
                />
                <div className="flex gap-2 items-center">
                    <span>
                        {order.processedCount} / {order.totalCount}
                    </span>
                    {Object.keys(order.price)
                        .sort()
                        .map((currency, idx, arr) => (
                            <Fragment key={currency}>
                                <div className="flex items-center px-1">
                                    <Price
                                        className="text-xs"
                                        currency={currency as ICurrency}
                                        value={order.price[currency as ICurrency]!}
                                    />
                                </div>
                                {idx !== arr.length - 1 && <div>/</div>}
                            </Fragment>
                        ))}
                </div>
            </div>

            <div className="flex flex-col gap-2 justify-between">
                <select
                    onChange={(e) =>
                        changeStatus.send(order._id, e.target.value as IShopOrderStatus)
                    }
                    value={order.status}
                    className="bg-stone-800 text-primary-700 px-3 py-2 rounded-full"
                >
                    {SHOP_ORDER_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                    ))}
                </select>
                <Link
                    to={buildAdminPath(`/orders/${order._id}`)}
                    className="bg-primary-700 text-stone-800 rounded-full text-center font-medium py-1"
                >
                    View
                </Link>
            </div>
        </Card>
    ))
}

export const AdminOrdersScreen = () => {
    const [status, setStatus] = useState<IShopOrderStatus | null>(null)
    const [orders, setOrders] = useState<IShopOrderAdminListItem[]>([])

    const loadOrders = useMutation<IShopOrderAdminListItem[], [IShopOrderStatus | null]>({
        fn: async (status) => {
            if (status) {
                return api(`/admin/shopOrders?status=${status}`)
            } else {
                return api(`/admin/shopOrders`)
            }
        },
        onSuccess: setOrders,
    })

    let tabs: Array<IShopOrderStatus | null> = [null]
    tabs = tabs.concat(SHOP_ORDER_STATUSES)

    const updateStatusFor = (productId: string, status: IShopOrderStatus) => {
        setOrders((prev) => prev.map((p) => (p._id === productId ? { ...p, status } : p)))
    }

    useEffect(() => {
        loadOrders.send(status)
    }, [status])

    return (
        <div className="h-full grid grid-rows-[max-content,minmax(0,1fr)]">
            <div
                className="grid grid-cols-2"
                style={{
                    gridTemplateColumns: `repeat(${SHOP_ORDER_STATUSES.length + 1}, minmax(0, 1fr))`,
                }}
            >
                {tabs.map((s) => (
                    <button
                        key={s || 'all'}
                        className={cn('py-2 bg-stone-800', {
                            'text-primary-700': s === status,
                        })}
                        onClick={() => setStatus(s)}
                    >
                        {s || 'All'}
                    </button>
                ))}
            </div>

            <div className="overflow-y-auto space-y-2 p-2">
                {loadOrders.isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <CircularLoaderIndicator size="xl" />
                    </div>
                ) : loadOrders.error ? (
                    <div className="h-full flex items-center justify-center text-red-500">
                        {loadOrders.error}
                    </div>
                ) : (
                    <OrdersList orders={orders} onStatusUpdated={updateStatusFor} />
                )}
            </div>
        </div>
    )
}
