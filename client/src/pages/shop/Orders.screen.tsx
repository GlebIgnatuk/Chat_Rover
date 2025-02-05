import { Card } from '@/components/Card'
import { CircularLoaderIndicator } from '@/components/LoaderIndicator'
import { buildAppPath } from '@/config/path'
import { Price } from '@/features/shop/components/Price'
import { useMutation } from '@/hooks/common/useMutation'
import { useLocalize } from '@/hooks/intl/useLocalize'
import { api } from '@/services/api'
import { ICurrency, IShopOrderListItem } from '@/store/types'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from 'tailwind-cn'

const OrdersList = ({
    orders,
    onCancelOrder,
}: {
    orders: IShopOrderListItem[]
    onCancelOrder: (orderId: string) => void
}) => {
    const localize = useLocalize()

    const cancelOrder = useMutation<never, [string]>({
        fn: (orderId) => {
            return api(`/shopOrders/${orderId}/statuses`, {
                method: 'POST',
                body: JSON.stringify({ status: 'cancelled' }),
            })
        },
        onSuccess: (_, orderId) => {
            onCancelOrder(orderId)
        },
        onError: () => {},
    })

    return orders.map((order) => (
        <Card className={cn('grid gap-2 grid-cols-[minmax(0,1fr),max-content] p-2 items-center')}>
            <div className="flex flex-col justify-between h-full self-start">
                <div className="text-primary-700">
                    {new Date(order.createdAt).toLocaleDateString()}{' '}
                    <span
                        className={cn('text-sm text-white rounded-full px-2 py-1 ml-2 lowercase', {
                            'bg-amber-600': order.status === 'pending',
                            'bg-red-700': order.status === 'cancelled',
                            'bg-green-700': order.status === 'processed',
                        })}
                    >
                        {localize(`shop__order__${order.status}`)}
                    </span>
                </div>

                <div className="flex items-center gap-3">
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
                <Link
                    to={buildAppPath(`/shop/orders/${order._id}`)}
                    className="bg-primary-700 text-stone-800 rounded-full text-center font-medium py-1"
                >
                    {localize('general__details')}
                </Link>

                <button
                    disabled={order.status !== 'pending'}
                    className="bg-red-800 disabled:bg-gray-400 text-white rounded-full px-3 py-1"
                    onClick={() => {
                        const confirmed = confirm(
                            `Вы уверены что хотите отменить заказ RUB${order.price.RUB}?`,
                        )
                        if (!confirmed) return

                        cancelOrder.send(order._id)
                    }}
                >
                    {localize('general__cancel')}
                </button>
            </div>
        </Card>
    ))
}

export const OrdersScreen = () => {
    const [orders, setOrders] = useState<IShopOrderListItem[]>([])

    const loadOrders = useMutation<IShopOrderListItem[]>({
        fn: async () => {
            return api(`/shopOrders`)
        },
        onSuccess: setOrders,
    })

    const onCancelOrder = (orderId: string) => {
        setOrders((prev) =>
            prev.map((p) => (p._id === orderId ? { ...p, status: 'cancelled' } : p)),
        )
    }

    useEffect(() => {
        loadOrders.send()
    }, [])

    return (
        <div className="h-full overflow-y-auto space-y-2 p-2">
            {loadOrders.isLoading ? (
                <div className="h-full flex items-center justify-center">
                    <CircularLoaderIndicator size="xl" />
                </div>
            ) : loadOrders.error ? (
                <div className="h-full flex items-center justify-center text-red-500">
                    {loadOrders.error}
                </div>
            ) : (
                <OrdersList orders={orders} onCancelOrder={onCancelOrder} />
            )}
        </div>
    )
}
